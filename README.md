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

1. このリポジトリに変更をプッシュする
2. GitHub の **Settings → Pages** を開く
3. **Source** を「Deploy from a branch」にする
4. **Branch** を公開したいブランチ（例: `main`）/ `root` に設定して保存
5. 数分後、`https://iwatch-pomi.github.io/Automatic-photo-sorting_WEBsite/` で公開されます

## カスタマイズ時のメモ（TODO）

- **ストアURL**: `index.html` のダウンロードボタン（`.store-btn` の `href="#"`）を、実際の App Store / Google Play のURLに差し替えてください。
- **スクリーンショット**: ヒーローの端末モックは仮の表示です。実際のアプリ画面画像を `assets/` に置いて差し替えると、より魅力的になります。
- **プライバシーポリシー**: `privacy.html` の「3. アプリ内課金について」「4. お問い合わせ」は一般的な内容で補完しています。実際の内容に合わせて修正してください。
