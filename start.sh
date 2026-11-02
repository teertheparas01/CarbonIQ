#!/usr/bin/env bash
# CarbonIQ - Start both backend and frontend servers
# Usage: ./start.sh (run from project root in Git Bash, WSL, Linux, macOS)

set -e  # Exit on error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Starting CarbonIQ                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists python3 && ! command_exists python; then
    echo -e "${RED}Error: Python not found. Please install Python 3.10+${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Error: Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm not found. Please install Node.js (includes npm)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"
echo ""

# --- BACKEND SETUP ---
echo -e "${BLUE}[Backend] Setting up...${NC}"

cd "$BACKEND_DIR"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}[Backend] Creating virtual environment...${NC}"
    python3 -m venv .venv 2>/dev/null || python -m venv .venv
fi

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    # Git Bash / Windows
    source .venv/Scripts/activate
else
    # Linux / macOS
    source .venv/bin/activate
fi

# Install/update dependencies
echo -e "${YELLOW}[Backend] Installing dependencies...${NC}"
pip install -q -r requirements.txt

# Start backend in background
echo -e "${GREEN}[Backend] Starting on http://127.0.0.1:8000${NC}"
uvicorn app:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Give backend a moment to start
sleep 3

# --- FRONTEND SETUP ---
echo -e "${BLUE}[Frontend] Setting up...${NC}"

cd "$FRONTEND_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[Frontend] Installing dependencies (first run)...${NC}"
    npm install
fi

# Start frontend in background
echo -e "${GREEN}[Frontend] Starting on http://localhost:5173${NC}"
npm run dev &
FRONTEND_PID=$!

# --- CLEANUP HANDLER ---
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    # Kill any child processes
    pkill -P $BACKEND_PID 2>/dev/null || true
    pkill -P $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}Done.${NC}"
    exit 0
}

trap cleanup INT TERM

# --- STATUS ---
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  CarbonIQ is running!                                        ║${NC}"
echo -e "${BLUE}║                                                              ║${NC}"
echo -e "${BLUE}║  ${GREEN}Backend:${NC}  http://127.0.0.1:8000                      ║${NC}"
echo -e "${BLUE}║  ${GREEN}Frontend:${NC} http://localhost:5173                     ║${NC}"
echo -e "${BLUE}║  ${GREEN}API Health:${NC} http://127.0.0.1:8000/health               ║${NC}"
echo -e "${BLUE}║  ${GREEN}API Predict:${NC} POST http://127.0.0.1:8000/predict            ║${NC}"
echo -e "${BLUE}║                                                              ║${NC}"
echo -e "${BLUE}║  Press ${YELLOW}Ctrl+C${BLUE} to stop both servers                        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID