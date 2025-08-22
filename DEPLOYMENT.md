# Pat Frontend - Deployment Guide

## Overview

This application includes a Pat type checker that requires OCaml and Dune to build. The type checker is essential for the Pat code analysis functionality.

## Local Development

1. Ensure you have OCaml and Dune installed:

   ```bash
   # macOS
   brew install opam
   opam install dune

   # Ubuntu/Debian
   sudo apt install opam
   opam install dune
   ```

2. Build the mbcheck type checker:

   ```bash
   ./build-mbcheck.sh
   ```

3. Install Node.js dependencies and start development:
   ```bash
   npm install
   npm run dev
   ```

## Deployment on Render

### Prerequisites

- GitHub repository with this code
- Render account

### Deployment Steps

1. **Pre-deployment build (Important!)**
   Before pushing to GitHub, ensure mbcheck is built:

   ```bash
   ./build-mbcheck.sh
   ```

2. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

3. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
   - Select Docker environment
   - Configure:
     - **Runtime**: Docker
     - **Dockerfile Path**: `./Dockerfile`
     - **Port**: `10000`
     - **Build Command**: `docker build -t pat-frontend .`
     - **Start Command**: `npm start`

### Troubleshooting

#### "Pat type checker is not available on server"

This error occurs when the mbcheck executable is not found or not executable. Check:

1. **Verify mbcheck was built**:

   ```bash
   ls -la mbcheck/_build/default/bin/main.exe
   ```

2. **Check file permissions**:

   ```bash
   # Ensure executable permissions
   chmod +x mbcheck/_build/default/bin/main.exe
   ```

3. **Test mbcheck locally**:
   ```bash
   cd mbcheck
   ./_build/default/bin/main.exe --help
   ```

#### Docker Build Issues

If the Docker build fails:

1. **Check build logs** for OCaml/Dune installation errors
2. **Ensure build script is executable**:

   ```bash
   chmod +x build-mbcheck.sh
   ```

3. **Manual build fallback**:
   If automated build fails, you can build mbcheck locally and commit the binary to GitHub:
   ```bash
   ./build-mbcheck.sh
   git add mbcheck/_build/
   git commit -m "Add pre-built mbcheck binary"
   git push
   ```

### Alternative Deployment Options

If Render deployment continues to have issues, consider:

1. **Railway**: Similar to Render, supports Docker
2. **Heroku**: May require different build configuration
3. **Vercel**: Requires serverless-compatible setup

### Environment Variables

For production deployment, set:

- `NODE_ENV=production`
- `PORT=10000` (for Render)

### Monitoring

After deployment, test the Pat type checker:

1. Go to your deployed website
2. Navigate to the communication errors page
3. Try to analyze some Pat code
4. Check browser console and server logs if errors occur
