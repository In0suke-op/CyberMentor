import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Save,
  BookOpen,
  Search,
  Check,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  FileDown
} from 'lucide-react';
import { StudentNote } from '../types';
import { createNote, updateNote, deleteNote } from '../services/api';
import { exportSingleNoteToPdf, exportAllNotesToPdf } from '../utils/pdfExport';

interface NotesViewProps {
  notes: StudentNote[];
  onNotesUpdated: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ notes, onNotesUpdated }) => {
  const [selectedNote, setSelectedNote] = useState<StudentNote | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'unsaved' | 'saving' | 'saved' | 'error'>('idle');
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentNoteRef = useRef<StudentNote | null>(selectedNote);
  const editTitleRef = useRef(editTitle);
  const editContentRef = useRef(editContent);

  // Sync refs for timeout safety
  useEffect(() => {
    currentNoteRef.current = selectedNote;
  }, [selectedNote]);

  useEffect(() => {
    editTitleRef.current = editTitle;
    editContentRef.current = editContent;
  }, [editTitle, editContent]);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectNote = (n: StudentNote) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    setSelectedNote(n);
    setIsEditing(false);
    setAutoSaveStatus('idle');
  };

  const performAutoSave = async () => {
    const activeNote = currentNoteRef.current;
    const titleToSave = editTitleRef.current;
    const contentToSave = editContentRef.current;

    if (!activeNote || !titleToSave.trim()) return;

    try {
      setAutoSaveStatus('saving');
      let savedNote: StudentNote;

      if (activeNote.id.startsWith('draft-')) {
        savedNote = await createNote({
          title: titleToSave,
          content: contentToSave,
          courseId: activeNote.courseId,
          tags: activeNote.tags
        });
        setSelectedNote(savedNote);
        currentNoteRef.current = savedNote;
      } else {
        savedNote = await updateNote(activeNote.id, {
          title: titleToSave,
          content: contentToSave,
          tags: activeNote.tags
        });
        setSelectedNote(savedNote);
        currentNoteRef.current = savedNote;
      }

      const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastAutoSavedAt(formattedTime);
      setAutoSaveStatus('saved');
      onNotesUpdated();
    } catch (err) {
      console.error('Auto-save error:', err);
      setAutoSaveStatus('error');
    }
  };

  // Debounced auto-save effect
  useEffect(() => {
    if (!isEditing || !selectedNote) return;

    const titleChanged = editTitle !== selectedNote.title;
    const contentChanged = editContent !== selectedNote.content;

    if (!titleChanged && !contentChanged && autoSaveStatus !== 'unsaved') {
      return;
    }

    setAutoSaveStatus('unsaved');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      performAutoSave();
    }, 1500);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [editTitle, editContent, isEditing]);

  const handleStartCreate = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    const newDraft: StudentNote = {
      id: `draft-${Date.now()}`,
      userId: '',
      title: 'New Security Research Note',
      content: '## Executive Summary\n\nDocument findings, CVE references, or payload notes here...',
      tags: ['research'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSelectedNote(newDraft);
    setEditTitle(newDraft.title);
    setEditContent(newDraft.content);
    setIsEditing(true);
    setAutoSaveStatus('idle');
  };

  const handleStartEdit = () => {
    if (!selectedNote) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
    setIsEditing(true);
    setAutoSaveStatus('idle');
  };

  const handleSave = async () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    if (!selectedNote || !editTitle.trim()) return;
    try {
      setSaving(true);
      let savedNote: StudentNote;
      if (selectedNote.id.startsWith('draft-')) {
        savedNote = await createNote({
          title: editTitle,
          content: editContent,
          courseId: selectedNote.courseId,
          tags: selectedNote.tags
        });
      } else {
        savedNote = await updateNote(selectedNote.id, {
          title: editTitle,
          content: editContent,
          tags: selectedNote.tags
        });
      }
      setSelectedNote(savedNote);
      setIsEditing(false);
      setAutoSaveStatus('saved');
      setLastAutoSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      onNotesUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to save note');
      setAutoSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note from your RAG index?')) return;
    try {
      await deleteNote(noteId);
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
      onNotesUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to delete note');
    }
  };

  const handleExportCurrentNote = () => {
    if (!selectedNote) return;
    // Use current edit title/content if editing, otherwise note state
    const noteToExport: StudentNote = isEditing
      ? { ...selectedNote, title: editTitle, content: editContent }
      : selectedNote;
    exportSingleNoteToPdf(noteToExport);
  };

  const handleExportAllNotes = () => {
    if (notes.length === 0) {
      alert('No notes available in your memory vault to export.');
      return;
    }
    exportAllNotesToPdf(notes);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Personal Notes & RAG Memory Vault</h2>
          <p className="text-xs text-slate-400">
            Multi-tenant notes automatically vector-indexed into your private AI mentor knowledge base.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportAllNotes}
            disabled={notes.length === 0}
            title="Export all vault notes as a single PDF study compendium"
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-colors backdrop-blur-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <FileDown className="h-4 w-4 text-emerald-400" />
            <span>Export Vault (PDF)</span>
          </button>

          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notes Sidebar List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes & tags..."
              className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-9 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-emerald-400/50 focus:outline-none shadow-sm"
            />
          </div>

          <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm p-6 text-center text-xs text-slate-400 shadow-sm">
                No notes found. Create one to empower your personal RAG agent!
              </div>
            ) : (
              filteredNotes.map((n) => {
                const isSelected = selectedNote?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleSelectNote(n)}
                    className={`group flex cursor-pointer flex-col rounded-xl border p-3.5 backdrop-blur-sm transition-all shadow-sm ${
                      isSelected
                        ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                        : 'border-white/15 bg-white/10 text-slate-200 hover:border-white/30 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate max-w-[170px] text-slate-100">{n.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(n.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {n.content}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {n.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-white/10 border border-white/15 px-1.5 py-0.2 text-[9px] font-mono text-slate-300"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">RAG INDEXED</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Note Detail / Editor Viewport */}
        <div className="md:col-span-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          {selectedNote ? (
            <div>
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-base font-bold text-slate-100 focus:border-emerald-400 focus:outline-none backdrop-blur-sm"
                  />
                ) : (
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{selectedNote.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 mt-0.5">
                      <span>Updated: {new Date(selectedNote.updatedAt).toLocaleString()}</span>
                      <span>•</span>
                      <span className="text-emerald-400">RAG Vector Status: Active</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {isEditing && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono">
                      {autoSaveStatus === 'saving' && (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin text-amber-400" />
                          <span className="text-amber-300">Auto-saving...</span>
                        </>
                      )}
                      {autoSaveStatus === 'saved' && (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-300">Auto-saved {lastAutoSavedAt ? `at ${lastAutoSavedAt}` : ''}</span>
                        </>
                      )}
                      {autoSaveStatus === 'unsaved' && (
                        <>
                          <Clock className="h-3 w-3 text-slate-400 animate-pulse" />
                          <span className="text-slate-400">Unsaved changes...</span>
                        </>
                      )}
                      {autoSaveStatus === 'error' && (
                        <>
                          <AlertCircle className="h-3 w-3 text-rose-400" />
                          <span className="text-rose-300">Auto-save failed</span>
                        </>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleExportCurrentNote}
                    title="Export this note as a formatted PDF"
                    className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Export PDF</span>
                  </button>

                  {isEditing ? (
                    <button
                      disabled={saving}
                      onClick={handleSave}
                      className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{saving ? 'Saving...' : 'Save & Vectorize'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartEdit}
                      className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/20 transition-colors backdrop-blur-sm"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  {!selectedNote.id.startsWith('draft-') && (
                    <button
                      onClick={() => handleDelete(selectedNote.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Note Content View / Edit */}
              <div className="mt-4">
                {isEditing ? (
                  <textarea
                    rows={18}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 font-mono text-xs text-slate-100 focus:border-emerald-400 focus:outline-none leading-relaxed"
                  />
                ) : (
                  <div className="whitespace-pre-line font-mono text-xs leading-relaxed text-slate-200 bg-white/5 p-4 rounded-xl border border-white/15 min-h-[350px] backdrop-blur-sm">
                    {selectedNote.content}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-slate-400 text-xs">
              Select a note from the left sidebar or create a new note to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
