# Running CyberMentor with Docker

CyberMentor is containerized and ready to run on any machine or operating system (macOS Apple Silicon/Intel, Windows Docker Desktop, Ubuntu/Debian/Arch Linux, Raspberry Pi 4/5, or Cloud VPS).

---

## Quickstart (Recommended: Docker Compose)

### 1. Build and Start
```bash
docker compose up --build -d
```

### 2. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Stop the Container
```bash
docker compose down
```

---

## Alternative: Standalone Docker CLI

### 1. Build the Image
```bash
docker build -t cybermentor:latest .
```

### 2. Run the Container
```bash
docker run -d \
  --name cybermentor-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e GEMINI_API_KEY=your_api_key_here \
  --restart unless-stopped \
  cybermentor:latest
```

---

## Features Included in Container
- **Multi-stage build**: Builder stage compiles both the Vite React 19 frontend and the Express backend into `dist/server.cjs`.
- **Lightweight Alpine Node 22 base**: Minimal footprint and fast startup time.
- **Automated Healthcheck**: Continuously polls `/api/v1/health` with `curl`.
- **Least-Privilege Security**: Runs as non-root `node` user.
- **Portability**: Exposes unified port `3000` with both API routes and static frontend serving.
