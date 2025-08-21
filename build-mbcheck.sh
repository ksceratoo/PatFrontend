#!/bin/bash
set -e

echo "Building mbcheck for Pat type checking..."

# Navigate to mbcheck directory
cd patCom/paterl/mbcheck

# Check if opam is available, if not install it
if ! command -v opam &> /dev/null; then
    echo "Installing opam..."
    # For Ubuntu/Debian (common in CI environments)
    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y opam libgmp-dev
    # For Alpine (if using alpine-based containers)
    elif command -v apk &> /dev/null; then
        apk add --no-cache opam gmp-dev
    # For macOS (if building locally)
    elif command -v brew &> /dev/null; then
        brew install opam
    else
        echo "Error: Cannot install opam. Please install manually."
        exit 1
    fi
fi

# Initialize opam if needed
if [ ! -d ~/.opam ]; then
    echo "Initializing opam..."
    opam init --disable-sandboxing -y
fi

# Update environment
eval $(opam env --switch=default)

# Install required OCaml packages
echo "Installing OCaml dependencies..."
opam install -y dune menhir ppx_import visitors cmdliner z3 bag

# Build mbcheck
echo "Building mbcheck..."
make clean || true
make

# Ensure the mbcheck binary is executable
chmod +x mbcheck

echo "mbcheck built successfully!"
