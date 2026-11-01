#!/usr/bin/env python3
"""
CarbonIQ Launcher - Starts both backend and frontend with a single command.
"""
import subprocess
import sys
import os
import time
import signal
import webbrowser
from pathlib import Path

ROOT = Path(__file__).parent
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"

processes = []


def run_backend():
    venv_python = BACKEND_DIR / ".venv" / "Scripts" / "python.exe"
    if not venv_python.exists():
        print("Creating backend virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", ".venv"], cwd=BACKEND_DIR, check=True)
        print("Installing backend dependencies...")
        subprocess.run([str(venv_python), "-m", "pip", "install", "-r", "requirements.txt"], cwd=BACKEND_DIR, check=True)

    print("Starting backend on http://127.0.0.1:8000")
    return subprocess.Popen([str(venv_python), "-m", "uvicorn", "app:app", "--reload"], cwd=BACKEND_DIR)


def run_frontend():
    node_modules = FRONTEND_DIR / "node_modules"
    if not node_modules.exists():
        print("Installing frontend dependencies...")
        subprocess.run(["npm", "install"], cwd=FRONTEND_DIR, check=True)

    print("Starting frontend on http://localhost:5173")
    return subprocess.Popen(["npm", "run", "dev"], cwd=FRONTEND_DIR)


def cleanup(signum=None, frame=None):
    print("\nShutting down...")
    for p in processes:
        if p.poll() is None:
            p.terminate()
    for p in processes:
        try:
            p.wait(timeout=5)
        except subprocess.TimeoutExpired:
            p.kill()
    sys.exit(0)


def main():
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    print("=" * 50)
    print("  CarbonIQ Launcher")
    print("=" * 50)

    # Start backend
    backend_proc = run_backend()
    processes.append(backend_proc)

    # Wait for backend to be ready
    time.sleep(3)

    # Start frontend
    frontend_proc = run_frontend()
    processes.append(frontend_proc)

    # Wait a bit then open browser
    time.sleep(3)
    webbrowser.open("http://localhost:5173")

    print("\n" + "=" * 50)
    print("  CarbonIQ is running!")
    print("  Frontend: http://localhost:5173")
    print("  Backend:  http://127.0.0.1:8000")
    print("  API Docs: http://127.0.0.1:8000/api/docs")
    print("=" * 50)
    print("Press Ctrl+C to stop both servers")
    print("=" * 50)

    # Wait for processes
    try:
        while True:
            time.sleep(1)
            # Check if any process died
            for p in processes:
                if p.poll() is not None:
                    print(f"\nProcess {p.pid} exited with code {p.returncode}")
                    cleanup()
    except KeyboardInterrupt:
        cleanup()


if __name__ == "__main__":
    main()