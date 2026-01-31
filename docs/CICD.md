# CI/CD

## コミット時（Husky + lint-staged）

- pre-commit でステージしたファイルに `biome check --write --unsafe` を実行
- `bun install` で Husky が有効になる

## CI（GitHub Actions）

- **トリガー**: push は全ブランチ、pull_request は `main`/`master` 向けのみ
- **内容**: `bun install --frozen-lockfile` → `bun run lint` → `bun run build`
- **ローカルで再現**: `bun run lint` → `bun run build`
- **ブランチ保護**: Status check に「Lint & Build」を必須にすると安全

## CD（デプロイ）

| 方法 | 概要 |
|------|------|
| **Vercel** | GitHub 連携で main に push すると自動デプロイ。環境変数はダッシュボードで設定 |
| **GitHub Pages** | `output: 'export'` で静的出力し、`out/` を gh-pages に push するワークフローを追加 |
| **自前** | `.next/` と `node_modules` をアップロードし、本番で `bun run start` |

環境変数は CI は **Secrets and variables → Actions**、本番は各プラットフォームの設定で。`.env*` はコミットしない。

## 拡張案

- テスト: Vitest/Jest を入れ、CI に `bun run test` を追加
- E2E: Playwright 等
- セキュリティ: Dependabot / `bun audit`
