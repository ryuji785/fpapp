# AGENTS.md

## Project Name
FPApp (Financial Planning Application)

## Project Overview
FPApp is a web-based financial planning application designed to help users visualize their future cash flow, manage expenses, and make informed decisions about personal finance and asset building.

## Frontend
- Framework: Vue 3
- Build Tool: Vite
- Language: TypeScript
- UI: Golden Layout (planned for modular panel-based UI)

## Backend
- Framework: Spring Boot 3.5.x
- Language: Java 17
- Database: PostgreSQL 17.4
- Migration: Flyway 10.14.0
- API: RESTful

## Key Features (Planned and Implemented)
- Household income/expense tracking
- Categorized spending management
- Cash flow forecasting table (auto-generated)
- Simulation of recurring and event-based expenditures
- Future asset projection (with compound interest support)

## Coding Style and Architecture
- Strong typing on both frontend and backend
- Domain-Driven Design (DDD) principles
- Partial use of Clean Architecture
- Environment configuration managed via `.env` and `application.properties`

## Development Status
- ✅ Backend configured and successfully connected to the database
- 🚧 Frontend setup in progress using Vue 3 + Vite + TypeScript

## Notes
This file (`AGENTS.md`) is placed under `.github/` to help tools like GitHub Copilot and OpenAI Codex understand the structure and goals of this project.
