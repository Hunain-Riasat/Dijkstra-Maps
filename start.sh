#!/bin/bash

echo "🚀 Smart Navigation System - Quick Start"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Clear vite cache if it exists
if [ -d "node_modules/.vite" ]; then
    echo "🧹 Clearing Vite cache..."
    rm -rf node_modules/.vite
    echo ""
fi

echo "✨ Starting development server..."
echo ""
echo "🌐 App will open at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
