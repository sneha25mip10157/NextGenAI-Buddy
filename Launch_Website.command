#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; do
    PORT=$((PORT+1))
done

echo "========================================================"
echo "  🚀 Starting NextGenAI Buddy Production Platform..."
echo "  🌐 Full-Stack URL: http://localhost:$PORT"
echo "  ⚡ Database: SQLite (nextgenai.db)"
echo "  💡 Press Ctrl+C in this terminal window anytime to stop."
echo "========================================================"

# Automatically open browser
(sleep 1 && open "http://localhost:$PORT") &

# Start production server
PORT=$PORT python3 server.py
