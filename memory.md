# CYBERMENTOR PROJECT MEMORY

## Identity
Project name: CyberMentor

## Purpose
CyberMentor is a structured cybersecurity learning and career-preparation platform.

## Current AI Provider
OpenRouter.

## AI Role
Primarily:
* Quiz generation
* Topic-aware quiz explanations
* Mentor assistance where explicitly implemented

AI must not fabricate learning resources.

## Learning Model
Career Role → Course → Module → Topic → Resources → Quiz → Progress

## Resource Philosophy
Every important topic should be independently learnable.
Therefore resources should be associated with individual topics whenever practical.

Example:
Networking → DNS → DNS-specific video
Networking → TCP → TCP-specific video
Networking → UDP → UDP-specific video

Do not depend on one giant course video for every topic.

## Resource Types
* YouTube
* Books
* Notes
* Handbooks
* Documentation
* Articles
* Practical rooms

## Practical Labs
CyberMentor does not host custom sandbox CTF infrastructure.
Use external legitimate training-room links where appropriate.

## Content Verification
Never fabricate:
* Video IDs
* URLs
* Titles
* Authors
* Channels
* Courses

Unverified resources must not be presented as verified.

## Career Roles
Current target catalog:
1. SOC Analyst
2. Penetration Tester
3. Cybersecurity Analyst
4. VAPT Analyst
5. Bug Bounty Hunter
6. Incident Responder
7. Digital Forensics Analyst
8. Threat Hunter
9. Threat Intelligence Analyst
10. Malware Analyst
11. Security Engineer
12. Network Security Engineer
13. Cloud Security Engineer
14. Application Security Engineer
15. DevSecOps Engineer
16. GRC Analyst
17. Security Auditor
18. IAM Analyst
19. Security Architect
20. Security Automation Engineer

This catalog can expand.

## Recent Progress & Verification
* Phase 0 — Repository Audit: Complete.
* Phase 1 — Foundation: Complete.
* Phase 2 — Authentication: Complete (JWT Auth with bcrypt hashing and rate limiting).
* Phase 3 — Database & Content: Complete (Curriculum pathways defined for all 13 core roles: SOC Analyst, Penetration Tester, Cybersecurity Analyst, VAPT Analyst, Bug Bounty Hunter, Incident Responder, Digital Forensics Analyst, Threat Hunter, Threat Intelligence Analyst, Malware Analyst, Security Engineer, Network Security Engineer, and Cloud Security Engineer in `src/data/curriculum.ts`).
* Phase 4 — Course Experience: Complete (Structured module & topic inspection modals with 4-stage study methodology).
* Phase 5 — Learning Resources: Complete (Curated YouTube masterclass playlists for SOC, Pentesting, and Threat Hunting without fake URLs).
* Phase 6 — Progress: Complete (Topic completion toggle, XP rewards, level system, localStorage and backend state persistence).
* Phase 7 — Quiz System: Complete (Server-authoritative quiz engine with masked correct options and explanations).
* Phase 8 — OpenRouter Integration: Complete (OpenRouter API gateway configured in `server/ai.ts` with `OPENROUTER_API_KEY` support for Socratic mentor & AI quiz generation).
* Phase 9 — Search & UX: Complete (Cmd+K Global Search modal and in-app video playlist theater).
* Phase 10 & 11 — Security & Production Verification: Complete (Clean build via `npm run build` and `tsc --noEmit`).

