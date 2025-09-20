# FPApp (React + TypeScript + Vite)

## 必要環境
- Node.js 20 以上（推奨: v20 LTS）
- npm 10+

## セットアップ
```bash
npm ci
# 型定義が必要な場合
npm install --save-dev @types/react @types/react-dom

npm run dev
# http://localhost:5173

npm run build
npm run preview
```

## デプロイ (Vercel)
本リポジトリを Vercel に接続

- Build Command: `npm run build`
- Output Directory: `dist`
- Node バージョン: package.json の `"engines": { "node": ">=20" }` を利用
- SPA ルーティング: `vercel.json` の rewrites を利用

## 技術構成
- React 18, TypeScript, Vite 6
- MUI (UI), Chart.js (グラフ)
- react-router-dom (SPA ルーティング)
- Backend: Spring Boot (MyBatis, Flyway)

## ローカライズ
- 表示言語: 日本語
- 通貨: 日本円 (¥) 3 桁区切り
- 日付: YYYY/MM/DD

## Backend: run locally (PostgreSQL + Flyway)

**Prereqs:** JDK 17, PostgreSQL running at `localhost:5432`.

1. Copy `.env.example` to `.env` and adjust the values if needed:

```bash
cp .env.example .env
```

The file defines:

- `DB_URL` – JDBC connection string
- `DB_USER` – database username
- `DB_PASSWORD` – database password

2. Use `env.sh` (Linux/macOS) or `env.ps1` (Windows) to load environment variables before invoking Gradle:

```bash
# Linux / macOS
./env.sh ./backend/gradlew bootRun

# Windows PowerShell
./env.ps1; ./backend/gradlew bootRun
```

Flyway runs automatically on startup using the database credentials from `.env`.

Once the backend is running, install dependencies and start the frontend:

```bash
cd frontend
npm install
npm run dev
```
