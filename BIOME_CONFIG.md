# Biome設定ドキュメント

このドキュメントは、Next.jsプロジェクト用に最適化されたBiome設定（`biome.json`）の詳細な説明です。

## 目次

- [概要](#概要)
- [VCS設定](#vcs設定)
- [ファイル設定](#ファイル設定)
- [フォーマッター設定](#フォーマッター設定)
- [JavaScript設定](#javascript設定)
- [リンター設定](#リンター設定)
- [アシスト設定](#アシスト設定)
- [オーバーライド設定](#オーバーライド設定)
- [使用方法](#使用方法)

## 概要

この設定は、Next.js 16とReact 19を使用するプロジェクト向けに最適化されています。コードの品質、一貫性、パフォーマンス、セキュリティを向上させるためのルールが有効化されています。

## VCS設定

```json
"vcs": {
  "enabled": true,
  "clientKind": "git",
  "useIgnoreFile": true
}
```

- **`enabled: true`**: バージョン管理システム（Git）との統合を有効化
- **`clientKind: "git"`**: Gitリポジトリとして認識
- **`useIgnoreFile: true`**: `.gitignore`ファイルを使用してファイルを無視

この設定により、`.gitignore`で無視されているファイルは自動的にBiomeの処理対象から除外されます。

## ファイル設定

```json
"files": {
  "ignoreUnknown": true,
  "experimentalScannerIgnores": [...],
  "includes": [...]
}
```

### `ignoreUnknown: true`
未知のファイル形式をエラーとして扱わず、無視します。

### `experimentalScannerIgnores`
Biomeのスキャン対象から除外するファイル・ディレクトリのパターン：

- `node_modules/**` - 依存パッケージ
- `.next/**` - Next.jsのビルド成果物
- `dist/**`, `build/**` - ビルド出力ディレクトリ
- `.vercel/**` - Vercelのデプロイファイル
- `.turbo/**` - Turborepoのキャッシュ
- `coverage/**` - テストカバレッジレポート
- `*.min.js`, `*.min.css` - ミニファイ済みファイル

### `includes`
Biomeが処理するファイルのパターン：

- `**/*.js`, `**/*.jsx` - JavaScript/JSXファイル
- `**/*.ts`, `**/*.tsx` - TypeScript/TSXファイル
- `**/*.json`, `**/*.jsonc` - JSONファイル

## フォーマッター設定

```json
"formatter": {
  "enabled": true,
  "indentStyle": "space",
  "indentWidth": 2,
  "lineWidth": 100,
  "lineEnding": "lf"
}
```

- **`enabled: true`**: コードフォーマッターを有効化
- **`indentStyle: "space"`**: インデントにスペースを使用（タブではなく）
- **`indentWidth: 2`**: インデント幅は2スペース（Next.jsの標準）
- **`lineWidth: 100`**: 1行の最大文字数は100文字（Next.jsの一般的な設定）
- **`lineEnding: "lf"`**: 改行コードをLF（Line Feed）に統一（クロスプラットフォーム対応）

## JavaScript設定

```json
"javascript": {
  "formatter": {
    "quoteStyle": "double",
    "jsxQuoteStyle": "double",
    "trailingCommas": "es5",
    "semicolons": "always",
    "arrowParentheses": "always"
  },
  "globals": []
}
```

### フォーマッター設定

- **`quoteStyle: "double"`**: 文字列リテラルにダブルクォート（`"`）を使用
- **`jsxQuoteStyle: "double"`**: JSX属性にもダブルクォートを使用
- **`trailingCommas: "es5"`**: ES5互換の末尾カンマ（オブジェクト・配列の最後の要素の後にカンマを許可）
- **`semicolons: "always"`**: セミコロンを常に使用（ASIに依存しない）
- **`arrowParentheses: "always"`**: アロー関数の引数に常に括弧を付ける（例：`(x) => x`）

### `globals`
グローバル変数の定義。必要に応じて追加できます（例：`["$", "jQuery"]`）。

## リンター設定

```json
"linter": {
  "enabled": true,
  "rules": {...},
  "domains": {...}
}
```

### 基本設定

- **`enabled: true`**: リンターを有効化
- **`recommended: true`**: Biomeの推奨ルールを有効化

### ルールカテゴリ

#### 正確性（Correctness）

```json
"correctness": {
  "useExhaustiveDependencies": "warn",
  "useHookAtTopLevel": "error"
}
```

- **`useExhaustiveDependencies: "warn"`**: `useEffect`、`useMemo`、`useCallback`などの依存配列の網羅性をチェック（警告）
- **`useHookAtTopLevel: "error"`**: Reactフックはコンポーネントのトップレベルでのみ使用可能（エラー）

#### 疑わしいパターン（Suspicious）

```json
"suspicious": {
  "noUnknownAtRules": "off",
  "noExplicitAny": "warn",
  "noArrayIndexKey": "warn"
}
```

- **`noUnknownAtRules: "off"`**: CSSの`@`ルールを無視（Tailwind CSS等で必要）
- **`noExplicitAny: "warn"`**: `any`型の使用を警告（型安全性のため）
- **`noArrayIndexKey: "warn"`**: 配列のインデックスを`key`に使用することを警告（Reactのベストプラクティス）

#### スタイル（Style）

```json
"style": {
  "useImportType": "error",
  "useConst": "error",
  "noParameterAssign": "error"
}
```

- **`useImportType: "error"`**: 型のみのインポートには`import type`を使用（エラー）
- **`useConst: "error"`**: 再代入されない変数は`const`を使用（エラー）
- **`noParameterAssign: "error"`**: 関数パラメータへの代入を禁止（エラー）

#### 複雑度（Complexity）

```json
"complexity": {
  "noForEach": "off",
  "useSimplifiedLogicExpression": "warn"
}
```

- **`noForEach: "off"`**: `forEach`の使用を許可（必要に応じて使用可能）
- **`useSimplifiedLogicExpression: "warn"`**: 論理式の簡略化を推奨（警告）

#### パフォーマンス（Performance）

```json
"performance": {
  "noDelete": "error"
}
```

- **`noDelete: "error"`**: `delete`演算子の使用を禁止（パフォーマンスと型安全性のため）

#### セキュリティ（Security）

```json
"security": {
  "noDangerouslySetInnerHtml": "warn"
}
```

- **`noDangerouslySetInnerHtml: "warn"`**: `dangerouslySetInnerHTML`の使用を警告（XSS対策）

#### アクセシビリティ（a11y）

```json
"a11y": {
  "recommended": true
}
```

- **`recommended: true`**: アクセシビリティの推奨ルールを有効化（WCAG準拠）

#### 実験的ルール（Nursery）

```json
"nursery": {
  "useSortedClasses": {
    "fix": "safe",
    "level": "warn",
    "options": {
      "functions": ["cn", "twMerge", "twJoin"]
    }
  }
}
```

- **`useSortedClasses`**: Tailwind CSSクラスの自動並び替えルール（`prettier-plugin-tailwindcss`と同等の機能）
  - **`fix: "safe"`**: 安全な自動修正を有効化
  - **`level: "warn"`**: 警告レベルで実行（エラーではなく警告として表示）
  - **`options.functions`**: クラス文字列を含む関数名を指定
    - `cn`: shadcn/uiで使用されるクラス結合関数
    - `twMerge`: Tailwind Mergeライブラリの関数
    - `twJoin`: Tailwind Mergeの`twJoin`関数
    - デフォルトで`clsx`と`cva`は常に対象となるため、省略可能

このルールにより、`className`属性や指定した関数内のTailwind CSSクラスが自動的に推奨順序に並び替えられます。

### ドメイン固有ルール

```json
"domains": {
  "next": "recommended",
  "react": "recommended"
}
```

- **`next: "recommended"`**: Next.jsの推奨ルールを有効化
- **`react: "recommended"`**: Reactの推奨ルールを有効化

## アシスト設定

```json
"assist": {
  "actions": {
    "source": {
      "organizeImports": "on"
    }
  }
}
```

- **`organizeImports: "on"`**: インポート文の自動整理を有効化（未使用のインポート削除、ソート）

## オーバーライド設定

特定のファイルパターンに対して、デフォルト設定を上書きできます。

### App Routerファイル

```json
{
  "includes": ["**/app/**/*.tsx", "**/app/**/*.ts"],
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  }
}
```

`app`ディレクトリ内のファイルでは、`any`型の使用をエラーとして扱います（より厳格な型チェック）。

### 設定ファイルとミドルウェア

```json
{
  "includes": ["**/*.config.*", "**/middleware.*"],
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  }
}
```

設定ファイル（`*.config.*`）とミドルウェア（`middleware.*`）では、`any`型の使用を許可します（Next.jsの設定ファイルで必要）。

## 使用方法

### リンターの実行

```bash
bun run lint
```

または

```bash
biome check .
```

### 自動フォーマットと修正

```bash
bun run format
```

または

```bash
biome format --write .
biome check --write .
```

### リンターエラーの自動修正（推奨）

```bash
bun run lint:fix
```

このコマンドは以下を自動的に実行します：
- Tailwind CSSクラスの並び替え
- インポート文の整理と不要なインポートの削除
- その他の安全な自動修正

### 特定のファイルのみチェック

```bash
biome check src/app/page.tsx
```

### 設定の検証

```bash
biome check --config-path biome.json
```

## ルールの優先度

各ルールには以下の優先度があります：

- **`error`**: エラーとして扱い、ビルドを失敗させる
- **`warn`**: 警告として扱い、ビルドは成功するが警告を表示
- **`off`**: ルールを無効化

## 参考リンク

- [Biome公式ドキュメント](https://biomejs.dev/)
- [Biome設定リファレンス](https://biomejs.dev/reference/configuration/)
- [Biomeルール一覧](https://biomejs.dev/linter/rules/)
