# Biome 設定（biome.json）

Next.js 向けに Lint・フォーマット・Tailwind クラス並び替え・インポート整理を有効にした設定の概要。

## 主な設定

| 項目 | 内容 |
|------|------|
| **VCS** | Git 連携、`.gitignore` を尊重 |
| **対象ファイル** | `*.js, jsx, ts, tsx, json, jsonc`。`.next/`, `node_modules/` 等は除外 |
| **フォーマット** | スペース2、行幅100、改行LF、ダブルクォート、セミコロンあり |
| **リンター** | `recommended` + Next/React ドメイン。正確性・スタイル・パフォーマンス・セキュリティ・a11y を有効 |
| **Tailwind 並び替え** | `useSortedClasses`（nursery）。`className` と `cn` / `twMerge` / `twJoin` 内のクラスをソート |
| **インポート** | `organizeImports` で未使用削除・ソート |

## オーバーライド

- **`app/**`**: `noExplicitAny` を `error`（厳格）
- **`*.config.*`, `middleware.*`**: `noExplicitAny` を `off`（設定ファイル向け）

## コマンド

```bash
bun run lint        # チェックのみ
bun run lint:fix   # 自動修正（Tailwind 並び替え・未使用インポート削除含む）
bun run format     # フォーマットのみ
```

ルールの強度: `error`（失敗） / `warn`（警告） / `off`（無効）。

## 参考

- [Biome 設定リファレンス](https://biomejs.dev/reference/configuration/)
- [Biome ルール一覧](https://biomejs.dev/linter/rules/)
