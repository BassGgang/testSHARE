# UTokyo Channel 申請フォーム - 開発者向けドキュメント

## テストモード（バリデーション無効化）について

開発およびテストの利便性を高めるため、必須項目の入力チェックを一時的にスキップできる「テストモード」を導入しています。

### 設定方法

`src/App.tsx` の冒頭にある `IS_TEST_MODE` 定数を書き換えることで切り替えが可能です。

```tsx
// src/App.tsx

const IS_TEST_MODE = true; // true: バリデーション無効（テスト用）, false: 有効（本番用）
```

### モードによる挙動の違い

| 機能 | `IS_TEST_MODE = true` | `IS_TEST_MODE = false` |
| :--- | :--- | :--- |
| **次へボタン** | 未入力でも次のステップへ進めます | 未入力項目がある場合、アラートを表示して中断します |
| **ブラウザバリデーション** | `required` 属性が無効化されます | `required` 属性が有効になり、ブラウザ標準のチェックが働きます |
| **視覚的表示** | 「必須」バッジは表示されたままです | 「必須」バッジが表示されます |

### 注意事項
本番環境へデプロイする前、または最終的な動作確認を行う際は、必ず **`IS_TEST_MODE = false`** に設定されていることを確認してください。

----memo----
$ npm run deploy

> utchannel_updateform@0.0.0 predeploy
> npm run build


> utchannel_updateform@0.0.0 build
> vite build

vite v6.4.1 building for production...
✓ 2135 modules transformed.
dist/index.html                   0.74 kB │ gzip:   0.43 kB
dist/assets/index-Di3DHtf9.css   33.98 kB │ gzip:   6.76 kB
dist/assets/index-CJFXNc8h.js   383.05 kB │ gzip: 116.15 kB
✓ built in 1.06s

> utchannel_updateform@0.0.0 deploy
> gh-pages -d dist

Published
----------


# utchannel_updateform

このプロジェクトは React 19 + Vite 6 + Tailwind CSS v4 で構築されたフロントエンドアプリケーションです。
GitHub Pages を利用して自動デプロイされるよう設定されています。

## 🌐 公開URL
- https://BassGgang.github.io/testSHARE/

---

## 🚀 開発・運用のためのコマンド集

コードの変更や日々の開発では、以下のコマンドを使用します。

### 1. ローカル環境での起動（開発時）
ローカルサーバーを起動してブラウザで確認しながら開発を進める場合のコマンドです。

```bash
npm run dev
2. ソースコードの変更を保存する（Gitプッシュ）
コードの修正や機能追加が完了したら、まずはソースコードを main ブランチにプッシュします。
# 変更されたファイルをすべて追加
git add .

# コミットメッセージを記録
git commit -m "変更内容をここに記載"

# GitHubにプッシュ
git push origin main

3. 変更を本番サイトに反映する（デプロイ）
npm run deploy

npmには、「コマンドの頭に pre をつけると、そのコマンドが実行される直前に自動で割り込んで実行する」というお約束（フック機能）があります。

今回の場合、以下のような順番で処理が流れます。

あなたが npm run deploy を実行する。

npmが「お、deploy をやるんだな。じゃあ、頭に pre がついた predeploy がないか探そう」と package.json を見にいく。

predeploy が見つかったので、中身に書かれている npm run build をあなたに代わって自動で実行する（＝ここでプロジェクトのビルドが始まります）。

ビルドが無事に終わったら、ようやく本番の deploy（gh-pages -d dist）を実行する。