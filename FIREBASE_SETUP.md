# Googleログイン掲示板の接続

サイト側の実装は完了しています。Firebaseプロジェクトを1つ接続すると、次が有効になります。

- コメントは誰でも閲覧可能
- 投稿時だけGoogleアカウントでログイン
- ツール別の感想・質問
- 各ツールを開いた回数と合計回数

## 1. FirebaseプロジェクトとWebアプリを作る

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成します。
2. プロジェクトの概要からWebアプリ（`</>`）を追加します。
3. 表示された `firebaseConfig` の値を `firebase-config.js` に貼ります。

## 2. Googleログインを有効にする

1. Firebase Consoleの「Authentication」を開きます。
2. 「ログイン方法」でGoogleを有効にします。
3. 承認済みドメインに `mlabpages.github.io` が入っていることを確認します。

## 3. Firestoreを作る

1. Firebase Consoleの「Firestore Database」でデータベースを作成します。
2. 本番モードを選びます。
3. 「ルール」タブに `firestore.rules` の内容を貼り、公開します。

## 4. 動作確認

1. ローカルではHTTPサーバー経由で開きます（ファイルを直接ダブルクリックしません）。
2. コメント閲覧、Googleログイン、投稿、ツールを開いた回数を確認します。

## 運用上の注意

- `firebase-config.js` の設定値はWebアプリ用の公開識別情報です。秘密鍵ではありません。
- サービスアカウントのJSONや秘密鍵は、このリポジトリに保存しないでください。
- 不適切な投稿への対応はFirebase Consoleから対象コメントを削除します。
- 公開後はFirebase Consoleで利用量と請求アラートを確認してください。
