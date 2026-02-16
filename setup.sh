#!/bin/bash

# Setup script for Unknown.cc Forum
# This installs all dependencies for both frontend and backend

echo "🚀 Unknown.cc Forum Setup"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js 18+ or 20+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo "✅ Backend dependencies installed"
echo ""

echo "✨ Setup complete!"
echo ""
echo "To start the application:"
echo "1. In one terminal: cd server && npm start"
echo "2. In another terminal: npm run dev"
echo ""
echo "The backend will run on http://localhost:3000"
echo "The frontend will run on http://localhost:5173"
echo ""
