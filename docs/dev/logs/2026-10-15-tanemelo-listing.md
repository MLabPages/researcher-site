# たねメロ掲載

- `data.js` に「たねメロ」と掲載のお知らせを追加。カテゴリは音楽・創作、用途は授業・学習。
- 起動先は本番の https://tanemelo.pages.dev/ 。開発版の曲構成支援などは本番版との差があるため紹介文には含めていない。
- 公開アプリにサンプルJSONを読み込み、ピアノロールと伴奏設定の実画面を `assets/tanemelo-craft.png` として保存。実録音の採譜精度を示す画像ではない。
- JavaScript構文、差分、デスクトップ1440pxとモバイル390pxで検索・用途フィルター・画像拡大・起動/READMEリンク・画像読込・横はみ出しを確認。
- Browser plugin not available のため、既存Playwrightを使用。実マイクと実スマートフォンは今回の検証対象外。
- 既存の未追跡AGENTS.mdとdocsは保持し、今回の履歴へ含めない。既存のdocs/current-state.mdも未追跡のため変更しない。
