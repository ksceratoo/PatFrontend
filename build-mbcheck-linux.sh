#!/bin/bash
# Build mbcheck for Linux deployment (compatible with Vercel)

set -e

echo "Building mbcheck for Linux x86-64..."

# Create a temporary directory for Linux build
BUILD_DIR="linux-build"
mkdir -p $BUILD_DIR

# Create Dockerfile for building mbcheck on Linux
cat > $BUILD_DIR/Dockerfile << 'EOF'
FROM ocaml/opam:ubuntu-22.04-ocaml-4.14

# Install system dependencies
USER root
RUN apt-get update && apt-get install -y \
    libgmp-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

USER opam
WORKDIR /home/opam

# Copy mbcheck source
COPY patCom/paterl/mbcheck /home/opam/mbcheck
RUN sudo chown -R opam:opam /home/opam/mbcheck

# Install OCaml dependencies
RUN opam install -y dune menhir ppx_import visitors cmdliner z3 bag

# Build mbcheck
WORKDIR /home/opam/mbcheck
RUN eval $(opam env) && make clean && make

# The binary will be at /home/opam/mbcheck/_build/default/bin/main.exe
EOF

# Copy mbcheck source to build directory
cp -r patCom $BUILD_DIR/

echo "Docker setup created in $BUILD_DIR/"
echo "To build Linux mbcheck binary:"
echo "  cd $BUILD_DIR"
echo "  docker build -t mbcheck-linux ."
echo "  docker run --name mbcheck-container mbcheck-linux"
echo "  docker cp mbcheck-container:/home/opam/mbcheck/_build/default/bin/main.exe ./mbcheck-linux"
echo "  docker rm mbcheck-container"
echo ""
echo "Then copy mbcheck-linux to patCom/paterl/mbcheck/mbcheck and deploy!"
