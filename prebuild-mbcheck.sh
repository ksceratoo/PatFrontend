#!/bin/bash

echo "🔨 Pre-building mbcheck for Render deployment..."

# Check if we're on macOS or Linux (for Render compatibility)
OS=$(uname)
echo "Detected OS: $OS"

if [[ "$OS" == "Darwin" ]]; then
    echo "⚠️  Building on macOS - binary may not be compatible with Render (Linux)"
    echo "Consider building in a Linux environment or using pre-built binary"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build mbcheck
echo "Building mbcheck..."
./build-mbcheck.sh

# Check if build succeeded
if [ -f "mbcheck/_build/default/bin/main.exe" ]; then
    echo "✅ mbcheck built successfully!"

    # Copy binary to a location that will be committed
    cp mbcheck/_build/default/bin/main.exe mbcheck-binary
    chmod +x mbcheck-binary

    echo "✅ Binary copied to mbcheck-binary"
    ls -la mbcheck-binary

    # Test the binary
    echo "Testing binary..."
    ./mbcheck-binary --help > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Binary is working!"
    else
        echo "⚠️  Binary may have issues"
    fi

    echo ""
    echo "🎯 Next steps:"
    echo "1. Add mbcheck-binary to git: git add mbcheck-binary"
    echo "2. Commit: git commit -m 'Add pre-built mbcheck binary'"
    echo "3. Push: git push origin main"
    echo "4. Update Dockerfile.render to use ./mbcheck-binary instead of mbcheck/_build/default/bin/main.exe"

else
    echo "❌ Build failed"
    exit 1
fi
