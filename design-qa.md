# Design QA

- Source visual truth: `C:\Users\mkn09\.codex\generated_images\019f65de-c903-7bf1-9a5e-9dcab15b68ca\exec-72b500b8-9f44-4f88-a254-c5e1a2d736b0.png`
- Implementation screenshot: `C:\Users\mkn09\.codex\visualizations\2026\07\15\019f65de-c903-7bf1-9a5e-9dcab15b68ca\researcher-site-desktop-v3.png`
- Combined comparison: `C:\Users\mkn09\.codex\visualizations\2026\07\15\019f65de-c903-7bf1-9a5e-9dcab15b68ca\researcher-site-design-comparison.png`
- Mobile screenshot: `C:\Users\mkn09\.codex\visualizations\2026\07\15\019f65de-c903-7bf1-9a5e-9dcab15b68ca\researcher-site-mobile-final.png`
- Viewport: desktop 1440 x 1024 requested (browser content area 1425 x 1024); mobile 390 x 844 requested (browser content area 375 x 844)
- State: Firebase未接続の正規フォールバック状態。利用回数とGoogleログイン掲示板は「準備中」を表示。

## Full-view comparison evidence

選択されたTool Market Galleryの情報階層を再現した。左に短い導入、右に今週のおすすめ、続いて4列の公開ツール、利用状況、掲示板の順で表示する。教員情報は下部の折りたたみに移した。バーチャルライドは表示せず、View Pulseと尺度アトラスは機能を推測しない予告表示に限定した。

## Focused region comparison evidence

- グループ抽選: 添付された配置図に合わせ、A列からE列を横方向、A1/A2などを縦方向に配置した。
- 卒論セルフチェック: 構成、引用、表記、図表のチェック状態を表示した。
- リアクションメーター: カメラ検出、身体の動き、前傾、反応強度と「映像は保存・送信しません」を表示した。
- Classroom Office Reviewer: 提出物一覧とWord/PowerPointを順番に確認する状態を表示した。
- モバイル: 横スクロールなし。ヒーロー、CTA、おすすめツールが375pxの表示領域内に収まることを確認した。

## Required fidelity surfaces

- Fonts and typography: 既存サイトの日本語システムフォントを継承し、深い青緑の見出し、15-16px本文、明確な見出し階層を維持した。折り返しと可読性に問題なし。
- Spacing and layout rhythm: 初回比較でヒーローとカードが縦長だったため圧縮。最終版では1024px高の画面内に利用状況と掲示板冒頭まで入る。
- Colors and visual tokens: オフホワイト、深い青緑、淡いミントを主色とし、ツール分類だけ黄・コーラル・青を限定使用。コントラストを維持した。
- Image quality and asset fidelity: 装飾画像は使用せず、各ツールの実機能に対応する小型UIプレビューをHTMLで表示。グループ配置はユーザー提供資料と整合。選択画像の飾り旗は機能と無関係なため省略した。
- Copy and content: M-Labツール広場、公開済み4ツール、Googleログイン方針、未公開ツールの予告、運営者情報の優先度をユーザー指定どおり反映した。

## Interaction checks

- ナビゲーションのアンカー移動
- ツール別「感想・質問」から掲示板タブへの移動
- 掲示板のツール切り替え
- 運営者・研究情報の開閉
- Firebase未接続時のGoogleログインボタン無効化
- ブラウザコンソールのerror/warnなし

## Comparison history

1. Desktop v1: ヒーローとツールカードが選択画像より縦長で、活動・掲示板が画面下へ押し出されていた（P2）。
2. Fix: ヒーローの文字サイズ、余白、カードプレビュー、説明文、ボタン、メタ情報の高さを圧縮した。
3. Desktop v2: 利用状況は画面内に入ったが、掲示板冒頭がまだ見えなかった（P2）。
4. Fix: ヒーローを約260px、カードプレビューを106pxに調整し、説明を2行に整理した。
5. Desktop v3: 利用状況と掲示板冒頭が1024px高に入り、情報密度と階層が選択画像に揃った。P0/P1/P2なし。

## Findings

- P3: 選択画像にある飾り旗は省略。機能性を優先し、追加画像を増やさない意図的な差異。
- P3: Firebase実データ接続後、コメント数や長文による密度を再確認するとさらに安全。

## Implementation checklist

- [x] 選択画像の広場型レイアウト
- [x] 公開済み4ツールの実機能に合うプレビュー
- [x] Googleログイン掲示板の画面とFirebase処理
- [x] 利用回数のFirestore処理
- [x] PC・スマホのレスポンシブ確認
- [x] 主要操作とコンソール確認
- [ ] Firebaseプロジェクトの実設定を接続後、実データ状態を再確認

final result: passed
