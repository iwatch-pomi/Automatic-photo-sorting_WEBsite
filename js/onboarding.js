// =========================================================
//  コマフォト オンボーディング診断（Cal AI 風の事前入力フロー）
//  サイト訪問時にまず質問へ答えてもらい、結果とともに
//  App Store ダウンロード／Pro 1ヶ月無料コードへ誘導する。
// =========================================================
(function () {
  'use strict';

  var STORAGE_KEY = 'komafoto_onboarded';
  var REDEEM_URL = 'https://apps.apple.com/redeem?ctx=offercodes&id=6779217541&code=QR1MONTH';
  var APPSTORE_URL = 'https://apps.apple.com/jp/app/id6779217541';

  // 質問データ（コマフォト＝大学生向け授業写真整理アプリ に最適化）
  var QUESTIONS = [
    { id: 'grade', q: 'いまの学年は？', options: [
      { e: '🆕', label: '大学1年生' }, { e: '📗', label: '大学2年生' },
      { e: '📘', label: '大学3年生' }, { e: '🎓', label: '大学4年生・大学院生' } ] },
    { id: 'field', q: '文系？ 理系？', options: [
      { e: '📚', label: '文系' }, { e: '🧪', label: '理系' }, { e: '🎨', label: 'その他・芸術系' } ] },
    { id: 'coma', q: '1週間に受けている授業は何コマ？', options: [
      { e: '🙂', label: '〜10コマ', value: 8 }, { e: '😀', label: '11〜15コマ', value: 13 },
      { e: '😅', label: '16〜20コマ', value: 18 }, { e: '🥵', label: '21コマ以上', value: 23 } ] },
    { id: 'shoot', q: '授業中、板書やスライドを写真に撮る？', options: [
      { e: '📸', label: 'よく撮る' }, { e: '🤳', label: 'たまに撮る' }, { e: '🙅', label: 'ほとんど撮らない' } ] },
    { id: 'lost', q: '撮った写真、あとで探すのに困ったことは？', options: [
      { e: '😱', label: 'しょっちゅうある' }, { e: '😥', label: 'たまにある' }, { e: '😌', label: 'あまりない' } ] },
    { id: 'searchtime', q: 'テスト前、目当ての板書を探すのにかかる時間は？', options: [
      { e: '⚡', label: '5分未満', value: 4 }, { e: '⏱️', label: '5〜15分', value: 10 },
      { e: '⏳', label: '15〜30分', value: 22 }, { e: '😵', label: '30分以上', value: 35 } ] },
    { id: 'roll', q: 'いまのカメラロールの状態は？', options: [
      { e: '🌀', label: '板書と私生活が混ざってカオス' }, { e: '📂', label: 'だいたい整理できている' }, { e: '✨', label: 'きれいに整理済み' } ] },
    { id: 'note', q: 'ノートを取るのは得意？', options: [
      { e: '✍️', label: '得意' }, { e: '😐', label: '普通' }, { e: '📷', label: '苦手（写真に頼りがち）' } ] },
    { id: 'volume', q: '1科目で学期末までに撮る板書はどれくらい？', options: [
      { e: '🍃', label: '〜10枚' }, { e: '📄', label: '11〜50枚' }, { e: '📚', label: '51〜100枚' }, { e: '🗻', label: '100枚以上' } ] },
    { id: 'value', q: 'いちばん重視したいのは？', options: [
      { e: '⏰', label: 'タイパ（時間短縮）' }, { e: '📈', label: '成績アップ' },
      { e: '😮‍💨', label: 'ストレス軽減' }, { e: '💯', label: 'ぜんぶ' } ] },
    { id: 'testrange', q: 'テスト範囲のメモ・管理はどうしてる？', options: [
      { e: '🤷', label: '特にしていない' }, { e: '📝', label: '手書きでメモ' },
      { e: '📱', label: 'アプリで管理' }, { e: '🧠', label: '記憶で何とか' } ] },
    { id: 'term', q: '複数学期・通年での管理は必要？', options: [
      { e: '✅', label: '必要' }, { e: '🤔', label: 'たぶん必要' }, { e: '🙆', label: 'いまは不要' } ] },
    { id: 'device', q: '使っている端末は？', options: [
      { e: '📱', label: 'iPhone' }, { e: '📲', label: 'iPad' },
      { e: '🍎', label: 'iPhone と iPad 両方' }, { e: '🤖', label: 'Android など' } ] },
    { id: 'expect', q: 'コマフォトにいちばん期待するのは？', options: [
      { e: '🗂️', label: '時間割で自動仕分け' }, { e: '🔎', label: '探す時間をゼロに' },
      { e: '🧹', label: 'カメラロールの整理' }, { e: '🔖', label: 'メモ・テスト範囲の管理' } ] }
  ];

  var LOAD_MSGS = [
    'あなたの回答を分析しています…',
    '時間割と撮影パターンを照合中…',
    'おすすめの自動仕分け設定を選定中…',
    'あなた専用の「授業写真 整理プラン」を作成中…'
  ];

  var ob, main, barFill;
  var index = 0;
  var answers = {};

  function pct() {
    return Math.round((index / QUESTIONS.length) * 100);
  }

  function setBar(p) {
    if (barFill) barFill.style.width = p + '%';
  }

  function renderQuestion() {
    var qd = QUESTIONS[index];
    setBar(pct());
    var selected = answers[qd.id] ? answers[qd.id].label : null;
    var opts = qd.options.map(function (o) {
      var sel = selected === o.label ? ' is-selected' : '';
      return '<button class="ob__opt' + sel + '" type="button" data-label="' +
        o.label.replace(/"/g, '&quot;') + '">' +
        '<span class="ob__opt-emoji">' + o.e + '</span><span>' + o.label + '</span></button>';
    }).join('');

    main.innerHTML =
      '<div class="ob__inner">' +
        '<div class="ob__step">質問 ' + (index + 1) + ' / ' + QUESTIONS.length + '</div>' +
        '<h2 class="ob__q">' + qd.q + '</h2>' +
        '<div class="ob__options">' + opts + '</div>' +
        (index > 0 ? '<button class="ob__back" type="button" data-back>← 前へ戻る</button>' : '') +
      '</div>';

    Array.prototype.forEach.call(main.querySelectorAll('.ob__opt'), function (btn) {
      btn.addEventListener('click', function () {
        var label = btn.getAttribute('data-label');
        var opt = qd.options.filter(function (o) { return o.label === label; })[0];
        answers[qd.id] = opt;
        if (index < QUESTIONS.length - 1) {
          index++;
          renderQuestion();
        } else {
          renderLoading();
        }
      });
    });

    var back = main.querySelector('[data-back]');
    if (back) back.addEventListener('click', function () { index--; renderQuestion(); });
  }

  function renderLoading() {
    setBar(100);
    main.innerHTML =
      '<div class="ob__inner ob__loading">' +
        '<div class="ob__spinner"></div>' +
        '<h2 class="ob__loading-title">あなた専用のプランを作成中です</h2>' +
        '<p class="ob__loading-msg" id="obLoadMsg">' + LOAD_MSGS[0] + '</p>' +
        '<div class="ob__loading-track"><div class="ob__loading-fill" id="obLoadFill"></div></div>' +
      '</div>';

    var fill = document.getElementById('obLoadFill');
    var msg = document.getElementById('obLoadMsg');
    var i = 0;
    setTimeout(function () { if (fill) fill.style.width = '100%'; }, 60);
    var timer = setInterval(function () {
      i++;
      if (i < LOAD_MSGS.length) {
        if (msg) msg.textContent = LOAD_MSGS[i];
      } else {
        clearInterval(timer);
        renderResult();
      }
    }, 850);
  }

  function val(id, fallback) {
    return (answers[id] && typeof answers[id].value === 'number') ? answers[id].value : fallback;
  }

  function renderResult() {
    setBar(100);
    // テスト前の「写真を探すだけ」の年間ロス時間を試算
    var subjects = val('coma', 13);
    var searchMin = val('searchtime', 10);
    var examsPerYear = 4; // 前期中間・期末／後期中間・期末 など
    var annualHours = Math.max(1, Math.round((searchMin * subjects * examsPerYear) / 60));

    var expect = answers.expect ? answers.expect.label : '時間割で自動仕分け';

    main.innerHTML =
      '<div class="ob__inner ob__result">' +
        '<span class="ob__result-badge">✅ 診断完了</span>' +
        '<h2 class="ob__result-title">あなたにピッタリなのは<br>「コマフォト Pro」でした</h2>' +
        '<div class="ob__stat">' +
          '<div class="ob__stat-label">いまのままだと、テスト前の写真探しに</div>' +
          '<div class="ob__stat-num">年間 約<span>' + annualHours + '</span>時間</div>' +
          '<div class="ob__stat-sub">を失っている可能性があります。コマフォトなら、その大半をゼロにできます。</div>' +
        '</div>' +
        '<div class="ob__card">' +
          '<h4>あなたへのおすすめポイント</h4>' +
          '<ul>' +
            '<li>あなたの回答（' + expect + '）にいちばん効くのが、時間割と連動した<strong>全自動の仕分け</strong>です。</li>' +
            '<li>撮るだけで授業・回数ごとに整理。「あの板書どこ？」を探す時間がなくなります。</li>' +
            '<li>Proなら、テスト範囲マーカー・複数学期管理・PDF書き出しまで使えます。</li>' +
          '</ul>' +
        '</div>' +
        '<span class="ob__offer-tag">🎁 今だけ Pro 1ヶ月無料</span>' +
        '<div class="ob__cta">' +
          '<a class="btn btn--code" href="' + REDEEM_URL + '" target="_blank" rel="noopener">🎁 1ヶ月無料コードを引き換える</a>' +
          '<a class="btn btn--primary" href="' + APPSTORE_URL + '" target="_blank" rel="noopener">App Store で無料ダウンロード</a>' +
        '</div>' +
        '<button class="ob__close" type="button" data-close>サイトをじっくり見る ›</button>' +
      '</div>';

    // 完了を記録（次回は自動表示しない）
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}

    var close = main.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeOb);
  }

  function openOb(restart) {
    if (!ob) return;
    if (restart) { index = 0; answers = {}; }
    ob.classList.add('is-open');
    document.body.classList.add('ob-lock');
    renderQuestion();
  }

  function closeOb() {
    if (!ob) return;
    ob.classList.remove('is-open');
    document.body.classList.remove('ob-lock');
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
  }

  function init() {
    ob = document.getElementById('ob');
    main = document.getElementById('obMain');
    barFill = document.getElementById('obBarFill');
    if (!ob || !main) return;

    var skip = document.getElementById('obSkip');
    if (skip) skip.addEventListener('click', closeOb);

    // ヒーロー等からの再診断ボタン
    Array.prototype.forEach.call(document.querySelectorAll('[data-ob-open]'), function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openOb(true); });
    });

    // 初回アクセス時は自動表示（診断済みなら表示しない）
    var done;
    try { done = localStorage.getItem(STORAGE_KEY); } catch (e) { done = null; }
    if (!done) {
      openOb(true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
