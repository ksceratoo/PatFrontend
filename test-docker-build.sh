#!/bin/bash

echo "🧪 Testing Docker build for Pat Frontend with mbcheck..."

# Build the Docker image
echo "Building Docker image..."
docker build -t pat-frontend-test .

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Docker build succeeded!"

    # Test if mbcheck executable exists in the image
    echo "Testing mbcheck executable in container..."
    docker run --rm pat-frontend-test ls -la mbcheck/_build/default/bin/main.exe

    if [ $? -eq 0 ]; then
        echo "✅ mbcheck executable found in container!"

        # Test if mbcheck is executable
        echo "Testing mbcheck execution..."
        docker run --rm pat-frontend-test bash -c "cd mbcheck && ./_build/default/bin/main.exe --help"

        if [ $? -eq 0 ]; then
            echo "✅ mbcheck is working in container!"
        else
            echo "❌ mbcheck execution failed"
        fi
    else
        echo "❌ mbcheck executable not found in container"
    fi

else
    echo "❌ Docker build failed"
fi

echo "🎯 Test completed"
