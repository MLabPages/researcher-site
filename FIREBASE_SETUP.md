# Googleログイン掲示板の接続

サイト側の実装は完了しています。Firebaseプロジェクトを1つ接続すると、次が有効になります。

- コメントは誰でも閲覧可能
- 投稿時だけGoogleアカウントでログイン
- ツール別の感想・質問
- 各ツールを開いた回数と合計回数
- 投稿者本人によるコメント削除
- 登録した運営者による不適切なコメントの削除

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

## 4. App Checkを登録する

1. Google Cloud Consoleで、`mlabpages.github.io` 用のreCAPTCHA Enterprise Webキーを作成します。
2. Firebase Consoleの「App Check」→「アプリ」でWebアプリを登録します。
3. プロバイダはreCAPTCHA Enterpriseを選び、サイトキーを登録します。
4. サイトキーを `firebase-config.js` の `MLAB_APP_CHECK_SITE_KEY` に設定します。
5. コードを公開した直後は、Cloud Firestoreの「適用」をまだ有効にしません。
6. 「App Check」→「API」で確認済みリクエストが記録されることを確認してから、Cloud Firestoreの適用を有効にします。

## 5. 動作確認

1. ローカルではHTTPサーバー経由で開きます（ファイルを直接ダブルクリックしません）。
2. コメント閲覧、Googleログイン、投稿、ツールを開いた回数を確認します。

## 6. 運営者UIDを登録する

1. 公開サイトで、運営に使うGoogleアカウントから一度ログインします。
2. Firebase Consoleの「Authentication」→「Users」を開き、そのアカウントのUIDをコピーします。
3. Firestore Databaseの「データ」で `moderators` コレクションを作成します。
4. ドキュメントIDにコピーしたUIDを指定します。
5. フィールドとして `role`（文字列）に `moderator` を設定して保存します。
6. 「ルール」タブに更新後の `firestore.rules` を貼り、公開します。
7. サイトでログインし直し、「運営者として参加中です」と表示されることを確認します。

UIDはパスワードではありません。実際の権限判定では、Googleログインで本人確認されたUIDと登録済みUIDが一致するかをFirestoreルールが確認します。

## 運用上の注意

- `firebase-config.js` の設定値はWebアプリ用の公開識別情報です。秘密鍵ではありません。
- サービスアカウントのJSONや秘密鍵は、このリポジトリに保存しないでください。
- 運営者UIDを登録すると、サイト上から不適切な投稿を削除できます。Firebase Consoleからの削除も引き続き可能です。
- 公開後はFirebase Consoleで利用量と請求アラートを確認してください。
