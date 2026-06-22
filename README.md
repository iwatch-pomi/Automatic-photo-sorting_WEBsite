# コマフォト 紹介サイト

アプリ「コマフォト」の紹介サイト（ランディングページ）です。
コマフォトは、授業中に撮影した板書などの写真を、登録した時間割に基づいて授業ごとに自動で整理する学生向けアプリです。

## 構成

```
.
├── index.html      … トップ（ヒーロー・機能紹介・使い方・ダウンロード）
├── privacy.html    … プライバシーポリシー
├── css/style.css   … 共通スタイル（白＋フォレストグリーン）
├── js/main.js      … モバイルメニュー開閉
└── .nojekyll       … GitHub Pages の Jekyll 処理を無効化
```

フレームワーク不要の静的サイトです。ビルドは必要ありません。

## ローカルでの確認

```bash
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## GitHub Pages での公開手順

このリポジトリには、GitHub Actions による自動デプロイのワークフロー
（`.github/workflows/deploy-pages.yml`）が含まれています。

1. GitHub の **Settings → Pages** を開く
2. **Build and deployment → Source** を「**GitHub Actions**」に設定する（1回だけ）
3. 以降、`claude/magical-euler-pqjjf2` ブランチへプッシュするたびに自動でデプロイされます
   （手動実行は Actions タブの「Deploy to GitHub Pages」→ Run workflow からも可能）
4. 数分後、`https://iwatch-pomi.github.io/Automatic-photo-sorting_WEBsite/` で公開されます

> 別のブランチ（例: `main`）から公開したい場合は、`deploy-pages.yml` の
> `on.push.branches` を該当ブランチ名に変更してください。

## 掲載内容について

App Store（[コマフォト｜大学生のための時間割アルバム](https://apps.apple.com/jp/app/id6779217541)）の
説明文・スクリーンショットの訴求内容をもとに作成しています。ダウンロードボタンは実際のApp StoreのURLにリンク済みです。

### カスタマイズ時のメモ（TODO）

- **スクリーンショット**: ヒーローおよび「コマフォトでできること」内の端末画面は、App Storeの4パネルの訴求を
  HTML/CSSで再現したモックです。実際のスクリーンショット画像を表示したい場合は、PNGを `assets/` に置き、
  該当の `.phone` ブロックを `<img>` に差し替えてください（画像ファイルはリポジトリにコミットして使います）。
- **プライバシーポリシー**: `privacy.html` の「3. アプリ内課金について」「4. お問い合わせ」は一般的な内容で
  補完しています。実際の内容に合わせて修正してください。
