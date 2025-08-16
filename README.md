# FPApp

Monorepo for the Financial Planning Application.

- `backend/`: Spring Boot backend
- `frontend/`: React single-page application

## Frontend

The frontend is a Vite-powered React SPA. Development requires **Node.js ^20.19 or >=22.12**.

```bash
cd frontend
npm ci
npm run dev
```

This starts the app at [http://localhost:5173](http://localhost:5173).

To create a production build and preview it:

```bash
npm run build && npm run preview
```

GoldenLayout state persists in `localStorage.fpapp_gl_v1`. Remove that key to reset the layout.

### Scripts

- `npm run dev` - 開発サーバーを起動します
- `npm run build` - 本番ビルドを作成します
- `npm run preview` - ビルド済みアプリをプレビューします
- `npm test` - テストを実行します（現在はプレースホルダー）

### 環境変数

現時点では必須の環境変数はありませんが、バックエンド API のエンドポイントを変更する場合は `VITE_API_URL` を設定してください。
