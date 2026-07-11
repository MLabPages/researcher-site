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
    toolsLead: "研究・教育のために開発したツールです。どなたでも無料で利用できます。",
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
      date: "2026-07-07",
      text: "AIで開発したツールを公開するサイトを開設しました。",
    },
  ],

  // ============================================================
  // 公開ツール
  // ------------------------------------------------------------
  // GitHub の公開リポジトリを、あらかじめ全部ここに並べてあります。
  //   ・載せたい      → show: true
  //   ・隠したい      → show: false
  //   ・文言を直したい → name / description / tags を書き換える
  //   ・URL を直したい → url を書き換える
  //
  // ★ 新しいリポジトリを作ったとき:
  //   公開サイトの URL のうしろに ?admin=1 を付けて開くと
  //   （例: https://mlabpages.github.io/?admin=1 ）、
  //   「まだ載せていないリポジトリ」と“貼り付け用の1ブロック”が表示されます。
  //   それをこの tools: [] の中にコピーして show を true にするだけです。
  // ============================================================
  tools: [
    {
      show: true,
      repo: "face-glowup",
      name: "face-glowup",
      url: "https://mlabpages.github.io/face-glowup/",
      description: "顔をカメラで写すと垢抜けのヒントを提示するWebアプリ(解析はブラウザ内のみ・写真は送信しない)",
      tags: [],
    },
    {
      show: true,
      repo: "face-glowup",
      name: "face-glowup",
      url: "https://mlabpages.github.io/face-glowup/",
      description: "顔をカメラで写すと垢抜けのヒントを提示するWebアプリ(解析はブラウザ内のみ・写真は送信しない)",
      tags: [],
    },
    {
      show: true,
      repo: "reaction-meter",
      name: "リアクションメーター",
      url: "https://mlabpages.github.io/reaction-meter/",
      description:
        "カメラで身体反応を計測・記録するWebアプリです。映像は保存・送信せず、数値データのみを扱います。",
      tags: ["Webアプリ", "計測"],
    },
    {
      show: true,
      repo: "Thesis-self-check",
      name: "卒論セルフチェック",
      url: "https://thesis-self-check.vercel.app",
      description:
        "卒業論文の形式（文字数・見出し・引用など）を提出前に自分でチェックできるサイトです。",
      tags: ["Webアプリ", "卒論支援"],
    },

    // ↓ 以下は今は非表示（show: false）。載せたくなったら true にしてください。
    //   説明文は実際の中身に合わせて用意済みです（そのまま／お好みで調整）。
    {
      show: true,
      repo: "virtual-ride",
      name: "バーチャルライド",
      url: "https://mlabpages.github.io/virtual-ride/",
      description:
        "ルームバイクを漕ぐと、街並みの映像が速度に連動して流れるWebアプリです。室内トレーニングを観光気分で楽しめます。",
      tags: ["Webアプリ", "運動"],
    },
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
      repo: "class-picker",
      name: "グループ抽選ツール",
      url: "https://mlabpages.github.io/class-picker/",
      description:
        "授業などでグループ分けをするための抽選サイトです。参加コードでクラスを分け、男女均等での振り分けにも対応します。",
      tags: ["Webアプリ", "授業支援"],
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
