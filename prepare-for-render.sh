#!/bin/bash

echo "🔧 Preparing project for Render deployment..."
echo ""

# Step 1: Build mbcheck locally
echo "📦 Step 1: Building mbcheck locally..."
if [ -f "build-mbcheck.sh" ]; then
    chmod +x build-mbcheck.sh
    ./build-mbcheck.sh
    if [ $? -eq 0 ]; then
        echo "✅ mbcheck built successfully!"
    else
        echo "⚠️  mbcheck build failed, but continuing with deployment..."
    fi
else
    echo "⚠️  build-mbcheck.sh not found, skipping mbcheck build"
fi

echo ""

# Step 2: Verify mbcheck binary
echo "🔍 Step 2: Verifying mbcheck binary..."
if [ -f "mbcheck/_build/default/bin/main.exe" ]; then
    ls -la mbcheck/_build/default/bin/main.exe
    chmod +x mbcheck/_build/default/bin/main.exe
    echo "✅ mbcheck binary found and executable"
else
    echo "⚠️  mbcheck binary not found - Pat type checking will not work"
fi

echo ""

# Step 3: Check if git is clean
echo "📋 Step 3: Checking git status..."
if command -v git &> /dev/null; then
    if [[ -n $(git status --porcelain) ]]; then
        echo "📝 Git working directory has uncommitted changes"
        echo "Please commit your changes before deploying:"
        echo "  git add ."
        echo "  git commit -m \"Prepare for Render deployment\""
        echo "  git push origin main"
    else
        echo "✅ Git working directory is clean"
        echo "Ready to deploy to Render!"
    fi
else
    echo "⚠️  Git not found - please ensure your changes are committed"
fi

echo ""

# Step 4: Instructions
echo "🚀 Step 4: Deployment instructions"
echo "After running this script, push to GitHub and Render will deploy:"
echo "  git add ."
echo "  git commit -m \"Add pre-built mbcheck for Render deployment\""
echo "  git push origin main"
echo ""
echo "Render will use Dockerfile.render for the deployment."

echo ""
echo "🎯 Preparation completed!"
