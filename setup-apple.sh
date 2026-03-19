#!/bin/bash

echo "Currently in $PWD"

DIR="./src"

if [ -d "$DIR" ]; then
   echo "$DIR is present"
else
   echo "$DIR not found"
   exit 1
fi

echo "Checking Node.js installation"
if command -v node > /dev/null; then
   echo "Node.js found: $(node -v)"
else 
   echo "Node.js not found"
   exit 1
fi

echo "Checking npm installation"
if command -v npm > /dev/null; then
   echo "npm found: $(npm -v)"
else
   echo "npm not found"
   exit 1
fi

# Prevent multiple runs
if pgrep -f "npm start" > /dev/null; then
  echo "Application already running"
  exit 0
fi

# Install only if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies"
  npm install
else
  echo "Dependencies already installed"
fi

touch ./logs.txt

echo "Starting application"

nohup npm start > ./logs.txt 2>&1 &

echo "Application started"