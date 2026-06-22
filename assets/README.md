# assets（画像ファイル置き場）

サイトで使う画像（アプリのスクリーンショットやアイコンなど）を、このフォルダに入れてください。

## スクリーンショットの追加方法

1. **加工済みの**スクリーンショット画像（個人情報を含まないもの）を、このフォルダに置きます。
   - 推奨ファイル名: `screen-home.png` / `screen-timetable.png` / `screen-album.png` / `screen-pro.png` など
   - 形式: PNG または JPG / 横幅の目安: 600〜1200px 程度（大きすぎると表示が重くなります）
2. このリポジトリにコミット＆プッシュします。
   ```bash
   git add assets/screen-home.png
   git commit -m "スクリーンショットを追加"
   git push
   ```
3. `index.html` の該当する「アプリ画面風モック」を、画像表示に差し替えます（下記）。

## index.html での差し込み方

現在は HTML/CSS で描いたモック（`<div class="phone"> ... </div>`）を表示しています。
実画像に差し替える場合は、対象の `.phone` ブロックを次のように置き換えます。

```html
<!-- 差し替え前: CSSモック -->
<div class="phone" aria-hidden="true">
  <div class="appscreen"> ... </div>
</div>

<!-- 差し替え後: 実スクリーンショット -->
<img class="phone-shot" src="assets/screen-home.png" alt="コマフォトのホーム画面">
```

`.phone-shot` のスタイル例（必要に応じて `css/style.css` に追加）:

```css
.phone-shot {
  width: 260px;
  max-width: 100%;
  border-radius: 24px;
  box-shadow: var(--shadow);
}
```

> 画像を入れて「差し替えて」と伝えていただければ、こちらで `index.html` と CSS を調整します。
