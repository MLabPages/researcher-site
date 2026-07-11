# 研究者サイト(researcher-site)

牧野耀の研究紹介・ツール公開サイトです。ビルド不要の静的サイト(HTML/CSS/JS)。

- 公開URL: https://mlabpages.github.io/researcher-site/
- main ブランチに push すると GitHub Actions が自動でデプロイします(十数秒)
- ただしブラウザのキャッシュで**最大10分ほど古い表示のまま**のことがあります。
  変わっていないように見えたら Ctrl+F5(強制再読込)か、少し待ってから確認してください

## カスタマイズは data.js だけ

表示内容の変更はすべて `data.js` で行います。HTML や app.js を触る必要はありません。

| 変えたいこと | data.js のどこ |
|---|---|
| お知らせの追加 | `news:` に1行足す |
| 公開ツールの表示/非表示 | `tools:` の各項目の `show: true/false` |
| ツールの名前・説明・リンク | `tools:` の `name` / `description` / `url` |
| セクションの並び順・非表示 | `sectionOrder:`(順番=表示順。消せば非表示) |
| 関心テーマの内容 | `interests:` の `items` |
| 問い合わせフォームのURL | `contact.googleFormUrl` |

## 新しいツールを載せたいとき

公開サイトの URL に `?admin=1` を付けて開くと、GitHub の公開リポジトリと
data.js を照合した管理パネルが出ます(訪問者には見えません)。
「＋ 未登録」のブロックをコピーして `tools: [` の中に貼るだけです。

## 自動取得している部分

氏名・所属・研究キーワード・論文・学会発表・経歴は researchmap
(https://researchmap.jp/7000029092)から自動取得しています。
researchmap を更新すればサイトも自動で最新になります(訪問者側に最大6時間のキャッシュ)。

## 検索エンジンについて

現在は試し公開のため `index.html` に `<meta name="robots" content="noindex">` を
入れており、検索結果に載りません。載せたくなったらこの1行を削除して push してください。
