## 環境構築ガイド（ローカル開発用）

このドキュメントでは、完全に何も知らない状態から、このプロジェクトをローカルで動かすまでの手順を説明します。

---

## 1. 事前にインストールしておくもの

- **Git**
- **Docker Desktop**（または同等のコンテナ環境）
- **Bun**  
  インストール例: `curl -fsSL https://bun.sh/install | bash`

Docker は Supabase のローカル環境を立ち上げるために必須です。

---

## 2. リポジトリを取得する

```bash
git clone https://github.com/your-org/club-kit.git
cd club-kit
```

（上の URL は実プロジェクトのものに読み替えてください）

---

## 3. 依存関係のインストール

```bash
bun install
```

`bun.lock` に基づいて必要なパッケージがすべてインストールされます。

---

## 4. 環境変数（.env）の設定

1. `.env.example` をコピーして `.env` を作ります。

   ```bash
   cp .env.example .env
   ```

2. `.env` を開いて、必要に応じて値を確認・修正します。

   ```env
   # ローカル Supabase（CLI）の URL と anon key
   NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."  # supabase start 時に表示される anon key に差し替え推奨

   # Drizzle / サーバーサイド用 DB 接続文字列
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
   ```

   - `DATABASE_URL` は Supabase CLI のデフォルトローカル DB と揃えています。
   - 本番環境では **別の接続文字列**を Vercel の環境変数で設定します。

---

## 5. Supabase CLI でローカル DB を起動する

### 5-1. 初回だけ（プロジェクト初期化）

```bash
bun run supabase:init
```

- `supabase/` ディレクトリや設定ファイルが作成されます。
- 1 回実行すれば OK です（既にあるならスキップ可）。

### 5-2. ローカル Supabase の起動

```bash
bun run supabase:start
```

- Docker コンテナが立ち上がり、ローカル Supabase が起動します。
- 初回はイメージのダウンロードが入るので少し時間がかかります。

起動後に使える主な URL:

- Supabase Studio: `http://localhost:54323`
- REST API: `http://localhost:54321`
- PostgreSQL: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

### 5-3. 停止

```bash
bun run supabase:stop
```

データはコンテナボリュームに残るので、再度 `supabase:start` すれば続きから使えます。

---

## 6. DB マイグレーション（Drizzle + Supabase CLI）

このプロジェクトでは:

- スキーマ定義: `src/db/schema/`（Drizzle）
- マイグレーション SQL: `supabase/migrations/`（Supabase CLI が読む）

という構成になっています。

### 6-1. スキーマを編集する

例: `src/db/schema/users.ts` にカラムを追加するなど。

```ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  // 例: プロフィール文を追加
  // bio: text("bio"),
});
```

### 6-2. Drizzle でマイグレーションファイルを生成

```bash
bun run db:generate
```

- `supabase/migrations/` 配下に `0001_xxx.sql` のようなファイルが作られます。
- これが **DB に適用される SQL** です。

### 6-3. ローカル DB にマイグレーションを適用

Supabase CLI は `supabase/migrations` の内容を、自動でローカル DB に適用します。

一番シンプルな流れは:

1. Supabase を一度止める

   ```bash
   bun run supabase:stop
   ```

2. 再度起動する

   ```bash
   bun run supabase:start
   ```

これで新しいマイグレーションが適用された状態になります。

> すべてのマイグレーションをやり直したい場合は、以下のようにリセットも可能です（データは全消しされます）。  
> **※ 破壊的なので注意**
>
> ```bash
> bunx supabase db reset
> ```

### 6-4. Drizzle Studio でテーブルを確認（任意）

```bash
bun run db:studio
```

- ブラウザで Drizzle Studio が立ち上がり、テーブル定義やデータを GUI で確認できます。

---

## 7. 環境構築完了の基準（まとめ）
1. フロントエンドが表示されること
Supabase を起動した状態で:
```bash
    bun run dev
```
ブラウザで `http://localhost:3000` を開く

Club Kit のトップページが表示される

2. Swagger UI からユーザー一覧が取得できること

ブラウザで `http://localhost:3000/api/doc` を開く

`Swagger UI` が表示される

一覧の中から `GET /users` を選択

「Try it out」→「Execute」を押す

下部にレスポンスの Response body が表示され、ユーザー一覧（空配列でも OK）が JSON で返ってくる

この 2 点が確認できていれば、

Next.js（フロント）
Hono（API）
Supabase + Drizzle（DB）
OpenAPI + Swagger UI（API ドキュメント）

がすべて正しくつながっている状態と見なして問題ありません。
---

## 8. よく使うコマンドまとめ

```bash
# 依存インストール
bun install

# Supabase CLI
bun run supabase:init    # 初回だけ
bun run supabase:start   # ローカル Supabase 起動
bun run supabase:stop    # 停止

# Drizzle
bun run db:generate      # スキーマ変更 → マイグレーション SQL 生成
bun run db:studio        # Drizzle Studio を開く

# アプリ
bun run dev              # 開発サーバー
bun run lint             # Lint チェック
```

ここまでできれば、ローカル環境はほぼ整っています。

