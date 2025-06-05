#!/usr/bin/env bash
set -e   # Exit immediately if any command fails

echo "1.) Running tests..."
npm test

echo "2.) Tests passed. Starting Docker Compose..."
docker compose up --build -d

echo "3.) Tailing logs from the 'app' service (Ctrl+C to stop)..."
docker compose logs -f app
