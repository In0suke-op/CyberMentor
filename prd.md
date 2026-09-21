# Product Requirements Document

## Product
CyberMentor

## Vision
Create a structured cybersecurity learning platform that helps learners progress from fundamentals to career-specific cybersecurity skills.

## Primary Users
* Cybersecurity beginners
* Students
* Career switchers
* Entry-level cybersecurity candidates
* SOC learners
* Penetration testing learners
* Security engineering learners
* GRC learners
* Other cybersecurity learners

## Core Features
1. User authentication
2. Dashboard
3. Cybersecurity career roles
4. Courses
5. Modules
6. Topics
7. Topic-specific learning resources
8. YouTube learning resources
9. Books
10. Notes
11. Handbooks
12. Documentation/resources
13. External practical-room links
14. Search
15. Progress tracking
16. Quiz generation
17. Quiz attempts/results
18. AI mentor assistance where implemented
19. Profile/user learning information
20. Secure backend APIs

## Career Role Catalog
The application should support career paths including, but not limited to:
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

The database should allow future roles without requiring a major schema rewrite.

## Content Model
Career Role → Course → Module → Topic → Resource

## Resource Types
* youtube
* book
* notes
* handbook
* documentation
* practical_room
* article
* other

## AI Requirements
OpenRouter is the AI provider.
AI should primarily generate quizzes and provide mentor assistance where explicitly implemented.
AI should NOT be responsible for inventing or automatically fabricating learning resources.

## Non-Goals
The product does not currently include:
* Custom CTF hosting
* Browser hacking machines
* Malware execution
* Exploit execution infrastructure
* Autonomous offensive security agents
* Automatic unverified YouTube scraping
* Fake/mock production content
* AI-generated fake course resources
