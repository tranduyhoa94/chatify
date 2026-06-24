#!/usr/bin/env bash
PORT="${PORT:-3000}"
PIDS=$(lsof -ti ":$PORT" 2>/dev/null || true)

if [ -n "$PIDS" ]; then
  echo "Freeing port $PORT (killing stale process)..."
  kill -9 $PIDS 2>/dev/null || true
fi
