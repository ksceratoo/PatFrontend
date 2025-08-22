#!/bin/bash

echo "🔨 Building mbcheck for deployment..."

# Check if we're in the right directory
if [ ! -d "mbcheck" ]; then
    echo "❌ Error: mbcheck directory not found"
    exit 1
fi

cd mbcheck

# Check if dune is available
if ! command -v dune &> /dev/null; then
    echo "⚠️  Dune not found, trying to install..."

    # Try to install dune via opam if available
    if command -v opam &> /dev/null; then
        echo "Installing dune via opam..."
        eval $(opam env)
        opam install --yes dune
    else
        echo "❌ Neither dune nor opam found. Please install OCaml and Dune first."
        echo "In Docker: This should be handled by the base image"
        exit 1
    fi
fi

# Initialize opam environment if needed
if command -v opam &> /dev/null; then
    eval $(opam env)
fi

# Install dependencies
echo "Installing dependencies..."
opam install --yes cmdliner visitors ppx_import z3 menhir bag || echo "⚠️  Dependency installation had issues"

# Build the project
echo "Building mbcheck..."
dune build

# Check if build succeeded
if [ -f "_build/default/bin/main.exe" ]; then
    echo "✅ mbcheck built successfully!"
    # Use sudo for chmod in Docker environment
    (sudo chmod +x _build/default/bin/main.exe 2>/dev/null) || chmod +x _build/default/bin/main.exe
    ls -la _build/default/bin/main.exe

    # Test the binary
    echo "Testing mbcheck..."
    ./_build/default/bin/main.exe --help > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ mbcheck is working!"
    else
        echo "⚠️  mbcheck built but may have issues"
    fi
else
    echo "❌ Build failed - no executable found"
    exit 1
fi

echo "🎯 mbcheck build completed"
