#!/usr/bin/env python3
"""
ZenithStore Full-Stack E-Commerce Runner
========================================
Runs both Backend (Express + Prisma) and Frontend (React + Vite)
concurrently and opens the web application in your default browser.

Usage:
    python run.py
"""

import os
import sys
import time
import signal
import subprocess
import webbrowser
from pathlib import Path

# ANSI colors for pleasant terminal display
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
MAGENTA = "\033[95m"
BOLD = "\033[1m"
RESET = "\033[0m"

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def print_banner():
    banner = f"""
{CYAN}{BOLD}======================================================================
  🛍️  ZENITHSTORE — FULL-STACK E-COMMERCE WEB PLATFORM
======================================================================{RESET}
  {GREEN}✓{RESET} Frontend:       {BOLD}http://localhost:5173{RESET}
  {GREEN}✓{RESET} Backend API:    {BOLD}http://localhost:5000{RESET}
  {GREEN}✓{RESET} Health Check:   {BOLD}http://localhost:5000/api/health{RESET}
----------------------------------------------------------------------
  {YELLOW}★ Demo Credentials:{RESET}
    • {BOLD}Admin Account:{RESET}    admin@store.com   /  admin123
    • {BOLD}Customer Demo:{RESET}    john@example.com  /  user123
----------------------------------------------------------------------
  {BLUE}Press Ctrl+C at any time to shut down both servers cleanly.{RESET}
======================================================================
"""
    print(banner)

def check_command_exists(cmd):
    """Check if an executable is available in PATH."""
    from shutil import which
    return which(cmd) is not None

def check_environment():
    """Verify Node.js and npm are installed."""
    if not check_command_exists("node"):
        print(f"{YELLOW}[ERROR]{RESET} Node.js is not found in your PATH.")
        print("Please download and install Node.js from https://nodejs.org/")
        sys.exit(1)

    if not check_command_exists("npm") and not check_command_exists("npm.cmd"):
        print(f"{YELLOW}[ERROR]{RESET} npm is not found in your PATH.")
        sys.exit(1)

def ensure_dependencies():
    """Verify backend and frontend dependencies are installed; install if missing."""
    is_windows = sys.platform.startswith("win")
    npm_cmd = "npm.cmd" if is_windows else "npm"
    npx_cmd = "npx.cmd" if is_windows else "npx"

    # Backend node_modules check
    backend_node_modules = BACKEND_DIR / "node_modules"
    if not backend_node_modules.exists():
        print(f"{YELLOW}[INFO]{RESET} Installing backend dependencies (one-time setup)...")
        subprocess.run([npm_cmd, "install"], cwd=str(BACKEND_DIR), check=True)

    # Database check (SQLite file)
    db_file = BACKEND_DIR / "prisma" / "dev.db"
    if not db_file.exists():
        print(f"{YELLOW}[INFO]{RESET} Initializing and seeding database...")
        subprocess.run([npx_cmd, "prisma", "db", "push"], cwd=str(BACKEND_DIR), check=True)
        subprocess.run(["node", "prisma/seed.js"], cwd=str(BACKEND_DIR), check=True)

    # Frontend node_modules check
    frontend_node_modules = FRONTEND_DIR / "node_modules"
    if not frontend_node_modules.exists():
        print(f"{YELLOW}[INFO]{RESET} Installing frontend dependencies (one-time setup)...")
        subprocess.run([npm_cmd, "install"], cwd=str(FRONTEND_DIR), check=True)

def kill_process_tree(pid):
    """Cleanly terminate a process and its child processes on Windows/Linux."""
    try:
        if sys.platform.startswith("win"):
            # Windows taskkill forcefully kills process tree
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(pid)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False,
            )
        else:
            os.killpg(os.getpgid(pid), signal.SIGTERM)
    except Exception:
        pass

def main():
    check_environment()
    ensure_dependencies()

    is_windows = sys.platform.startswith("win")
    npm_cmd = "npm.cmd" if is_windows else "npm"

    print(f"\n{GREEN}[STARTING]{RESET} Launching Backend and Frontend servers...")

    # Start Backend
    backend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(BACKEND_DIR),
        shell=is_windows,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if is_windows else 0,
    )

    # Start Frontend
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR),
        shell=is_windows,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if is_windows else 0,
    )

    # Wait a moment for Vite and Express to bind ports
    time.sleep(2.5)

    print_banner()

    # Open default web browser
    try:
        webbrowser.open("http://localhost:5173")
    except Exception:
        pass

    try:
        while True:
            # Check if any process exited unexpectedly
            b_ret = backend_proc.poll()
            f_ret = frontend_proc.poll()

            if b_ret is not None:
                print(f"{YELLOW}[WARNING]{RESET} Backend process exited with code {b_ret}")
                break
            if f_ret is not None:
                print(f"{YELLOW}[WARNING]{RESET} Frontend process exited with code {f_ret}")
                break

            time.sleep(1)

    except KeyboardInterrupt:
        print(f"\n{YELLOW}[SHUTDOWN]{RESET} Shutting down servers cleanly...")

    finally:
        kill_process_tree(backend_proc.pid)
        kill_process_tree(frontend_proc.pid)
        print(f"{GREEN}[SUCCESS]{RESET} All servers stopped. Thank you for using ZenithStore!\n")

if __name__ == "__main__":
    main()

