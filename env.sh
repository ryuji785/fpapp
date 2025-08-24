#!/bin/bash
# Loads DB_URL, DB_USER, DB_PASSWORD from .env and executes the given command
set -a
if [ -f .env ]; then
  source .env
fi
set +a
exec "$@"
