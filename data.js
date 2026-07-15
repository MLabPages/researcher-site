// ============================================================
// サイトの表示内容はこのファイルだけで変更できます。
// 変更したら GitHub に push すると、十数秒で公開サイトに反映されます。
// （researchmap から自動取得する部分＝氏名・所属・業績・経歴 は
//   ここには書きません。researchmap 側を直せば自動で反映されます）
// ============================================================

const SITE_CONFIG = {
  // researchmap の ID（URL の https://researchmap.jp/○○○ の ○○○ 部分）
  researchmapId: "7000029092",

  // GitHub のユーザー名。公開ツール欄の「まだ載せていないリポジトリ」
  // 自動チェック（管理モード）に使います。
  githubUser: "MLabPages",

  // researchmap から取ったデータを何時間ためておくか（同じ人の再訪時に再取得しない）
  cacheHours: 6,

  // ---- 自由に書き換えられる文言 ----
  text: {
    toolsLead: "授業や研究の中で生まれた道具を、どなたでも無料で試せます。",
    upcoming: [],
  },

  // ============================================================
  // セクションの並び順・表示/非表示
  // ------------------------------------------------------------
  // この配列の「順番」が、そのまま画面の並び順になります。
  //   ・並べ替えたい → 名前の順番を入れ替える
  //   ・隠したい     → その名前を消す（例: "publications" を消すと業績欄が消える）
  // 使える名前:
  //   "interests"（研究の関心・今後の課題） / "news"（お知らせ） /
  //   "tools"（公開ツール） / "publications"（研究業績） /
  //   "career"（経歴） / "contact"（連絡先）
  // ============================================================
  sectionOrder: ["news", "tools", "interests", "publications", "career", "contact"],

  // ---- いま関心のあるテーマ（自由記述）----
  // 公開ツールの下に表示されます。items を空 [] にするとセクションごと消えます。
  // lead は任意の一言。空欄でOK。もし柔らかく対話を促したいなら、例えば
  //   lead: "近い関心をお持ちの方とお話しできれば嬉しいです。"
  // のように書くこともできます（無理に入れなくて大丈夫です）。
  // ↓ テーマはご自身の言葉に自由に書き換えてください。
  interests: {
    heading: "いま関心のあるテーマ",
    lead: "",
    items: [
      "消費者の身体的な反応から、ブランドや商品の経験を捉えること",
      "直接知覚論・アフォーダンスの考え方を、マーケティングやデザインに活かすこと",
      "カメラやセンサーで、人の経験を負担なく数値として測る仕組みづくり",
      "デザインやプロダクトが、使いやすさを超えて人の行動や気持ちをどう変えるか",
      "新しい商品・サービスが人々に広まっていく過程（イノベーションの普及）",
      "研究で作った測定ツールを、店舗や教育など実際の現場で役立てること",
    ],
  },

  // ---- お知らせ ----
  // 上に書いたものほど先に表示。古いものは消してOK。
  news: [
    {
      date: "2026-07-14",
      text: "Google ClassroomのWord／PowerPoint提出物を、レイアウトを保って連続確認できる教員向けツールを公開しました。",
    },
    {
      date: "2026-07-07",
      text: "AIで開発したツールを公開するサイトを開設しました。",
    },
  ],

  // ============================================================
  // 公開ツール
  // ------------------------------------------------------------
  // ★ この並び順が、そのまま画面の並び順になります（上=最初に表示）。
  //   古いツールを上に、新しいツールを下に並べてあります。
  //   並び替えたいときは { } のブロックごと入れ替えてください。
  //
  //   ・載せたい      → show: true
  //   ・隠したい      → show: false
  //   ・文言を直したい → name / description / tags を書き換える
  //   ・URL を直したい → url を書き換える
  //
  // ★ 新しいリポジトリを作ったとき:
  //   公開サイトの URL のうしろに ?admin=1 を付けて開くと管理パネルが出ます。
  //   「サイトに載せる」ボタン → 「反映する」で、この一覧の末尾に自動追加されます。
  // ============================================================
  tools: [
    // --- 古い順に表示されます ---
    {
      show: true,
      repo: "class-picker",
      name: "グループ抽選ツール",
      url: "https://mlabpages.github.io/class-picker/",
      description:
        "授業などでグループ分けをするための抽選サイトです。参加コードでクラスを分け、男女均等での振り分けにも対応します。",
      tags: ["Webアプリ", "授業支援"],
      category: "授業支援",
      privacyHighlight: "名簿の準備なしですぐ使えます",
      privacyDetail: "氏名や名簿データは収集しません。",
      screenshot: "assets/class-picker-screen.png",
      screenshotLabel: "実際の画面",
      imagePosition: "center 24%",
    },
    {
      show: true,
      repo: "Thesis-self-check",
      name: "卒論セルフチェック",
      url: "https://thesis-self-check.vercel.app",
      description:
        "卒業論文の形式（文字数・見出し・引用など）を提出前に自分でチェックできるサイトです。",
      tags: ["Webアプリ", "卒論支援"],
      category: "学習サポート",
      privacyHighlight: "ファイルを送らず、その場でチェック",
      privacyDetail: "論文ファイルはブラウザ内で処理され、外部へ送信されません。",
      screenshot: "assets/thesis-check-screen.png",
      screenshotLabel: "実際の画面",
      imagePosition: "center 20%",
    },
    {
      show: true,
      repo: "reaction-meter",
      name: "リアクションメーター",
      url: "https://mlabpages.github.io/reaction-meter/",
      description:
        "カメラで身体反応を計測・記録するWebアプリです。映像は保存・送信せず、数値データのみを扱います。",
      tags: ["Webアプリ", "計測"],
      category: "計測・可視化",
      privacyHighlight: "映像を残さず反応を可視化",
      privacyDetail: "カメラ映像は保存・送信せず、数値データのみを扱います。",
      screenshot: "assets/reaction-meter-screen.png",
      screenshotLabel: "実際の画面",
      imagePosition: "center 27%",
    },
    {
      show: false,
      repo: "virtual-ride",
      name: "バーチャルライド",
      url: "https://mlabpages.github.io/virtual-ride/",
      description:
        "ルームバイクを漕ぐと、街並みの映像が速度に連動して流れるWebアプリです。室内トレーニングを観光気分で楽しめます。",
      tags: ["Webアプリ", "運動"],
    },
    {
      show: false,
      repo: "face-glowup",
      name: "今日は、ひとつだけ。",
      url: "https://mlabpages.github.io/face-glowup/",
      description: "顔をカメラで写すと垢抜けのヒントを提示するWebアプリ(解析はブラウザ内のみ・写真は送信しない)",
      tags: ["Webアプリ", "美容"],
    },

    // ↓ 以下は今は非表示（show: false）。載せたくなったら true にしてください。
    {
      show: false,
      repo: "BodyResponseResearchTool",
      name: "身体反応リサーチツール",
      url: "https://github.com/MLabPages/BodyResponseResearchTool",
      description:
        "カメラ映像から消費者調査向けの身体反応指標を、端末内で推定する研究用プロトタイプです（利用にはローカル環境での起動が必要）。",
      tags: ["研究ツール", "計測"],
    },
    {
      show: true,
      repo: "classroom-office-reviewer",
      name: "Classroom提出物連続表示",
      url: "https://github.com/MLabPages/classroom-office-reviewer",
      description:
        "Google ClassroomでWord／PowerPoint提出物を、レイアウトを保って次々確認・全画面発表できるWindows向け教員支援ツールです。導入手順とダウンロードを公開しています。",
      tags: ["Windows", "授業支援", "Classroom"],
      category: "研究・教育支援",
      privacyHighlight: "PC上で提出物をスムーズに確認",
      privacyDetail: "提出物は利用者のPC上で扱います。",
      cta: "導入方法を見る",
    },
    {
      show: true,
      repo: "student-submission-viewer",
      name: "提出物連続確認ツール",
      url: "https://github.com/MLabPages/student-submission-viewer",
      description:
        "Word／PowerPoint／PDFの提出物をレイアウトを保って連続表示し、採点・メモ・CSV出力まで行えるWindows向けツールです。",
      tags: ["Windows", "授業支援", "採点"],
      category: "授業支援",
      privacyHighlight: "提出物を送らず、PC上で連続確認",
      privacyDetail: "提出物は外部へ送信せず、利用者のWindows PC上で処理します。",
      screenshot: "assets/submission-viewer-screen.png",
      screenshotLabel: "実際の画面",
      imagePosition: "center 18%",
      cta: "導入方法を見る",
    },
    {
      show: true,
      repo: "view-pulse",
      name: "View Pulse",
      url: "https://mlabpages.github.io/view-pulse/",
      description:
        "見ている風景と表情・視線の変化をスマートフォンで同時に記録し、反応が生まれた瞬間を振り返る研究用Webアプリです。",
      tags: ["Webアプリ", "計測", "研究"],
      category: "計測・可視化",
      privacyHighlight: "見た場面と反応を端末内で同期",
      privacyDetail: "表情や視線の推定は端末内で行います。顔動画の保存は利用者が選択できます。",
      screenshot: "assets/view-pulse-screen.png",
      screenshotLabel: "実際の画面",
      imagePosition: "center 38%",
    },
    {
      show: true,
      repo: "management-scale-atlas",
      name: "経営学・マーケティング概念・尺度アトラス（試作版）",
      url: "https://mlabpages.github.io/management-scale-atlas/",
      description:
        "経営学・マーケティングの概念と測定尺度を、日本語で検索・比較し、研究設計につなげるための試作版データベースです。",
      tags: ["Webアプリ", "尺度", "研究支援"],
      category: "研究支援",
      privacyHighlight: "概念探しから尺度比較まで一か所で",
      privacyDetail: "検索や比較はブラウザで行え、研究設計のメモは利用中のブラウザ内に保存されます。",
      screenshot: "assets/scale-atlas-screen.png",
      screenshotLabel: "実際の画面",
      imagePosition: "center 30%",
    },
    // ↓ お試し・実験用のリポジトリ。研究者サイトに載せるものではない想定です（非表示のまま推奨）。
    {
      show: false,
      repo: "my-fruit-picker",
      name: "my-fruit-picker",
      url: "https://mlabpages.github.io/my-fruit-picker/",
      description: "（お試し用。表示する場合は説明文を書いてください）",
      tags: [],
    },
    {
      show: false,
      repo: "group_test",
      name: "group_test",
      url: "https://mlabpages.github.io/group_test/",
      description: "（お試し用。表示する場合は説明文を書いてください）",
      tags: [],
    },
  ],

  // ---- 連絡先 ----
  // Google フォームを作って共有URLをここに貼ると「メッセージを送る」ボタンが出ます。
  // 空欄なら案内文だけ表示されます。
  contact: {
    googleFormUrl: "https://forms.gle/FvAwRbu2spdFFnmR8",
    note: "研究・ツールに関するお問い合わせやご意見をお寄せください。",
  },
};
