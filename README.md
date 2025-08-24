# FPApp (React + TypeScript + Vite)

## 必要環境
- Node.js 20 以上（推奨: v20 LTS）
- npm 10+

## セットアップ
```bash
npm ci

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

## ローカライズ
- 表示言語: 日本語
- 通貨: 日本円 (¥) 3 桁区切り
- 日付: YYYY/MM/DD

## Backend: run locally (PostgreSQL + Flyway)

**Prereqs:** JDK 21, PostgreSQL running at `localhost:5432`.

**Environment variables**
- `DB_URL=jdbc:postgresql://localhost:5432/fpapp`
- `DB_USER=fpapp`
- `DB_PASSWORD=fpapp_dev`

**Start**
```bash
# Gradle
./gradlew bootRun
# or Maven
./mvnw spring-boot:run
```

If DB is empty, Flyway will apply migrations automatically on startup. Verify health:
`GET http://localhost:8080/actuator/health → {"status":"UP"}`

### Database migrations (Flyway via Gradle)

**Env (examples)**
- `DB_URL=jdbc:postgresql://localhost:5432/fpapp`
- `DB_USER=fpapp`
- `DB_PASSWORD=fpapp_dev`

**Commands**
```bash
# Check connection & migrations visible to the Gradle plugin
./gradlew :backend:flywayInfo

# Apply migrations
./gradlew :backend:flywayMigrate

# Reset DB (dangerous)
./gradlew :backend:flywayClean
```

Flyway DB plugin and JDBC driver are wired to the Gradle tasks via the flyway configuration.
Spring Boot runtime will also auto-migrate on startup.

For convenience, you can load `.env` before running Gradle tasks:

```bash
# Linux / macOS
./env.sh ./gradlew :backend:flywayMigrate

# Windows PowerShell
./env.ps1; ./gradlew :backend:flywayMigrate
```

Both scripts export variables from `.env` so Flyway and Spring Boot can read `DB_URL`, `DB_USER`, and `DB_PASSWORD` without exposing credentials in the build.

---

### 7) Verification checklist

- `./gradlew :backend:flywayInfo` connects and lists migrations without `No database found to handle jdbc:postgresql…`.
- `./gradlew :backend:flywayMigrate` succeeds.
- App starts, Flyway logs show `Successfully applied … migrations`.
- Deprecation warnings no longer flood the console (may still appear in summary).

---

### Why this fixes it

Flyway 10 splits database support from core. The **Gradle plugin** runs on the build classpath and **needs its own dependencies**:
`flyway-database-postgresql` **and** `org.postgresql:postgresql`.
Without them, the plugin cannot handle `jdbc:postgresql://…` and throws exactly the error you saw.
We also bound the plugin to the same DB URL as Spring to avoid environment drift.
