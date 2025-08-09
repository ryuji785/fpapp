# モックフロントエンド

このディレクトリは日本語UIと円表示を行うモック実装です。

## 起動方法

```bash
# フロントエンド
cd frontend
npm install --legacy-peer-deps
npm run dev

# ビルド
npm run build

# バックエンド
cd ../backend
./gradlew build
```

## 主なファイル
- `frontend/src/utils/format.ts`: 円表記用フォーマッタ
- `frontend/src/components/CashFlowPanel.vue`: 月次キャッシュフロー
- `frontend/src/components/BudgetProgressPanel.vue`: 予算達成状況
- `frontend/src/components/AccountListPanel.vue`: 口座一覧
- `frontend/src/views/DashboardView.vue`: 上記パネルを配置したダッシュボード

## 今後の改善
- 国際化(i18n)対応
- API連携
- DDDによるモジュール分割
