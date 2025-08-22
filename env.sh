#!/bin/bash
# Load environment variables from .env and run Gradle tasks in the backend module.
export $(grep -v '^#' .env | xargs)
cd backend
./gradlew "$@"
