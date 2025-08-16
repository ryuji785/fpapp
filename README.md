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
