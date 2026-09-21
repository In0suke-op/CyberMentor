# CYBERMENTOR DEVELOPMENT PHASES

Development should proceed incrementally.

## Phase 0 — Repository Audit
Inspect:
* Frontend
* Backend
* Database
* Docker
* Environment configuration
* Tests
* Existing documentation

Do not modify code during the initial audit unless necessary to prevent damage.

Output:
* Existing architecture
* Existing features
* Missing features
* Broken features
* Risks

## Phase 1 — Foundation
Verify:
* Project starts
* Backend starts
* Frontend starts
* Database connects
* Environment configuration works
* Health endpoint works

## Phase 2 — Authentication
Verify:
* Registration
* Login
* Password security
* Token/session handling
* Protected routes
* Unauthorized responses

## Phase 3 — Database & Content
Implement/verify:
* Career roles
* Courses
* Modules
* Topics
* Resources

Remove inappropriate production mock data.

## Phase 4 — Course Experience
Implement/verify:
* Course listing
* Course details
* Module navigation
* Topic pages
* Resource display

## Phase 5 — Learning Resources
Implement:
* YouTube resources
* Books
* Notes
* Handbooks
* Documentation
* Practical-room links

Resources must follow verification rules.

## Phase 6 — Progress
Implement/verify:
* Topic completion
* Course progress
* Learning history
* Progress persistence

## Phase 7 — Quiz System
Implement:
* Quiz generation
* Question storage/handling
* Attempts
* Scoring
* Explanations
* Difficulty

## Phase 8 — OpenRouter Integration
Implement/verify:
Backend → OpenRouter → AI model → response validation → application

Protect credentials.
AI should primarily be used for quizzes and explicitly supported mentor functions.

## Phase 9 — Search & UX
Implement/verify:
* Course search
* Topic search
* Resource search
* Filters
* Responsive UI
* Loading states
* Error states

## Phase 10 — Security & Production Verification
Verify:
* Authentication
* Authorization
* Security headers
* CORS
* Rate limiting where required
* Input validation
* Secrets
* Docker
* Database
* API errors
* Logging
* Tests
* Build

## Phase 11 — Final Audit
Do not declare completion until:
* Application starts
* Database works
* APIs work
* Authentication works
* Courses work
* Topics work
* Resources work
* Quiz generation works
* OpenRouter works
* Search works
* Tests pass
* Production build succeeds
* No critical errors remain

Document actual evidence.
