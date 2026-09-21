# Architecture

## General Architecture
Frontend → Backend API → Database → OpenRouter AI Service

External learning resources are linked from the application but are not hosted by CyberMentor unless explicitly implemented.

## Frontend
The frontend is responsible for:
* Authentication UI
* Dashboard
* Course browsing
* Course details
* Topic navigation
* Video player
* PDF/resource viewing where supported
* Notes
* Quiz UI
* Progress UI
* Search
* Profile

The frontend must NOT contain private API keys.

## Backend
The backend should contain logical modules for:
* Authentication
* Users
* Courses
* Modules
* Topics
* Resources
* Progress
* Quizzes
* AI Mentor
* Career
* Health

Use the repository's existing framework where possible.
Do not replace the framework without a clear requirement.

## Database
Database should represent:
User, Role, Course, Module, Topic, Resource, Progress, Quiz, Question, QuizAttempt

Relationships must be normalized appropriately.

## Resource Model
Each resource should support:
* id
* topic_id
* title
* resource_type
* url
* description
* provider
* author
* language
* duration
* difficulty
* verification_status
* created_at
* updated_at

Exact fields may differ according to the existing implementation, but the conceptual model must remain.

## AI Architecture
Frontend → Backend → OpenRouter → Selected model → Backend validation → Frontend

Never: Frontend → OpenRouter directly with private API key.

## Configuration
Use environment variables.
Examples:
OPENROUTER_API_KEY
DATABASE_URL
JWT_SECRET

Never hard-code real credentials.

## Docker
Use Docker where already established or where needed for reproducibility.
Maintain secure container practices.
