/**
 * 手土産を進めるときは、関数名を resetGiftForm にして実行する。
 * 写真の自動変換は、そのあと setupOnce を実行する。
 * createForms は使わない（項目が二重になる）。
 */
var SPREADSHEET_ID = "1sJucCTSK8oxWaS2U2JymEGOAVcf7Dv8DUmK8GkV68-g";
var RESTAURANT_FORM_ID = "1rJtytnT-ae7xADcK1YAmvYD9UT3CmpIFZRJF-bZotiM";
var GIFT_FORM_ID = "1sNEqXBwg-rqq5gJW3ixIYbs2eX3MD1dYltG0ksXqzuA";

function resetGiftForm() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var log = ensureSettings_(ss);
  log.clear();
  log.getRange("A1").setValue("手土産フォームを整えています " + new Date());
  SpreadsheetApp.flush();

  var giftForm = findGiftForm_(ss);
  if (!giftForm) {
    log.getRange("A2").setValue("手土産フォームが見つからないので新規作成します");
    SpreadsheetApp.flush();
    giftForm = FormApp.create("M's Omotenashi Concierge｜手土産・お取り寄せ");
    fillGiftForm_(giftForm);
    linkForm_(ss, giftForm, "手土産入力");
  } else {
    clearFormItems_(giftForm);
    giftForm.setTitle("M's Omotenashi Concierge｜手土産・お取り寄せ");
    fillGiftForm_(giftForm);
  }

  writeSettings_(ss, log);
}

function resetRestaurantForm() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var log = ensureSettings_(ss);
  var form = FormApp.openById(RESTAURANT_FORM_ID);
  clearFormItems_(form);
  form.setTitle("M's Omotenashi Concierge｜レストラン");
  fillRestaurantForm_(form);
  writeSettings_(ss, log);
}

function writeSettingsNow() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  writeSettings_(ss, ensureSettings_(ss));
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Omotenashi")
    .addItem("手土産フォームを整える", "resetGiftForm")
    .addItem("レストランフォームを整える", "resetRestaurantForm")
    .addItem("準備（写真の自動変換）", "setupOnce")
    .addItem("写真URLをすべて更新", "processAllRows")
    .addItem("入力URLを設定タブに書く", "writeSettingsNow")
    .addToUi();
}

function setupOnce() {
  var ss = getSpreadsheet_();
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger("afterFormSubmit").forSpreadsheet(ss).onFormSubmit().create();
  processAllRows();
  var log = ensureSettings_(ss);
  log.getRange("A12").setValue("写真の自動変換");
  log.getRange("B12").setValue("準備できました " + new Date());
}

function afterFormSubmit(e) {
  if (!e || !e.range) return;
  processRow(e.range.getSheet(), e.range.getRow());
}

function processAllRows() {
  var ss = getSpreadsheet_();
  ss.getSheets().forEach(function (sheet) {
    if (sheet.getName() === "設定") return;
    var last = sheet.getLastRow();
    var row;
    for (row = 2; row <= last; row++) {
      processRow(sheet, row);
    }
  });
}

function processRow(sheet, row) {
  if (sheet.getName() === "設定") return;
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  ensureHeader(sheet, headers, "id");
  var headersAfterId = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  ensureHeader(sheet, headersAfterId, "写真表示URL");
  var latestHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var values = sheet.getRange(row, 1, 1, latestHeaders.length).getValues()[0];
  var record = {};
  latestHeaders.forEach(function (name, index) {
    var key = String(name);
    var value = values[index];
    if (record[key] === undefined || String(record[key]).trim() === "") {
      record[key] = value;
    } else if (String(value).trim() !== "") {
      record[key] = value;
    }
  });

  var name = String(record["店名"] || record["商品名"] || "").trim();
  if (!name) return;

  var idCol = latestHeaders.indexOf("id") + 1;
  if (idCol && !String(record["id"] || "").trim()) {
    sheet.getRange(row, idCol).setValue(name);
  }

  var photoCol = latestHeaders.indexOf("写真表示URL") + 1;
  if (!photoCol) return;

  var ids = [];
  latestHeaders.forEach(function (name, index) {
    if (String(name) !== "写真") return;
    extractFromCell_(sheet, row, index + 1).forEach(function (id) {
      if (ids.indexOf(id) === -1) ids.push(id);
    });
  });
  if (ids.length === 0) return;

  var urls = ids.map(function (id) {
    try {
      DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (error) {}
    return "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600";
  });
  sheet.getRange(row, photoCol).setValue(urls.join(", "));
}

function extractFromCell_(sheet, row, col) {
  var range = sheet.getRange(row, col);
  var ids = extractDriveIds(range.getValue());
  var rich = range.getRichTextValue();
  if (rich) {
    collectLink_(ids, rich.getLinkUrl());
    rich.getRuns().forEach(function (run) {
      collectLink_(ids, run.getLinkUrl());
    });
  }
  return ids;
}

function collectLink_(ids, link) {
  extractDriveIds(link).forEach(function (id) {
    if (ids.indexOf(id) === -1) ids.push(id);
  });
}

function extractDriveIds(value) {
  var text = String(value || "");
  var ids = [];
  var patterns = [/[?&]id=([a-zA-Z0-9_-]+)/g, /\/file\/d\/([a-zA-Z0-9_-]+)/g];
  var p;
  var match;
  for (p = 0; p < patterns.length; p++) {
    while ((match = patterns[p].exec(text))) {
      if (ids.indexOf(match[1]) === -1) ids.push(match[1]);
    }
  }
  return ids;
}

function ensureHeader(sheet, headers, name) {
  if (headers.indexOf(name) !== -1) return;
  var col = sheet.getLastColumn() + 1;
  sheet.getRange(1, col).setValue(name);
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function ensureSettings_(ss) {
  return ss.getSheetByName("設定") || ss.insertSheet("設定", 0);
}

function findGiftForm_(ss) {
  try {
    if (GIFT_FORM_ID) return FormApp.openById(GIFT_FORM_ID);
  } catch (error) {}
  var found = null;
  ss.getSheets().forEach(function (sheet) {
    var url = sheet.getFormUrl();
    if (!url) return;
    var form = FormApp.openByUrl(url);
    if (form.getId() === RESTAURANT_FORM_ID) return;
    found = form;
  });
  return found;
}

function writeSettings_(ss, log) {
  var rows = [
    ["項目", "内容"],
    ["更新日時", new Date()],
  ];
  ss.getSheets().forEach(function (sheet) {
    var url = sheet.getFormUrl();
    if (!url) return;
    var form = FormApp.openByUrl(url);
    rows.push([sheet.getName() + " 入力URL", form.getPublishedUrl()]);
    rows.push([sheet.getName() + " 編集URL", form.getEditUrl()]);
  });
  rows.push(["写真の付け方", "各フォームの編集画面で質問を追加し、種類を「ファイルのアップロード」、タイトルを「写真」にする。必須にしない。最大5枚。"]);
  rows.push(["入力するとき", "アドレスが preview で終わっていたら viewform に変える。Googleにログインした状態で送る。"]);
  log.clear();
  log.getRange(1, 1, rows.length, 2).setValues(rows);
  log.setColumnWidth(1, 240);
  log.setColumnWidth(2, 560);
  SpreadsheetApp.flush();
}

function clearFormItems_(form) {
  var items = form.getItems();
  var i;
  for (i = items.length - 1; i >= 0; i--) {
    form.deleteItem(items[i]);
  }
}

function linkForm_(ss, form, sheetName) {
  var before = {};
  ss.getSheets().forEach(function (sheet) {
    before[sheet.getSheetId()] = true;
  });
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  var created = null;
  var i;
  for (i = 0; i < 15; i++) {
    Utilities.sleep(1000);
    created = ss.getSheets().filter(function (sheet) {
      return !before[sheet.getSheetId()];
    })[0];
    if (created) break;
  }
  if (created) {
    var name = sheetName;
    if (ss.getSheetByName(name) && ss.getSheetByName(name).getSheetId() !== created.getSheetId()) {
      name = sheetName + "2";
    }
    created.setName(name);
    return created;
  }
  return ss.getSheets()[0];
}

function fillRestaurantForm_(form) {
  form.setDescription("実際に行った店、または行ってみたい店を登録します。写真は編集画面で「ファイルのアップロード」を追加してください。");
  form.setCollectEmail(false);
  form.addTextItem().setTitle("店名").setRequired(true);
  form.addMultipleChoiceItem().setTitle("ステータス").setChoiceValues(["行ったことがある", "行ってみたい"]).setRequired(true);
  form.addMultipleChoiceItem().setTitle("地域区分").setChoiceValues(["東京", "国内地方", "海外", "その他"]);
  form.addListItem().setTitle("都内エリア").setChoiceValues([
    "銀座", "有楽町", "丸の内", "日本橋", "京橋", "六本木", "麻布十番", "赤坂", "虎ノ門", "新橋",
    "恵比寿", "代官山", "中目黒", "渋谷", "表参道", "青山", "広尾", "白金", "目黒", "品川",
    "新宿", "神楽坂", "浅草", "上野", "その他",
  ]);
  form.addTextItem().setTitle("地方・海外エリア").setHelpText("京都、パリなど。東京の店は空欄で構いません。");
  form.addListItem().setTitle("ジャンル").setChoiceValues([
    "和食", "寿司", "天ぷら", "焼鳥", "焼肉", "鉄板焼", "すき焼き・しゃぶしゃぶ", "うなぎ", "そば・うどん",
    "割烹・懐石", "フレンチ", "イタリアン", "スペイン料理", "中華", "韓国料理", "アジア・エスニック",
    "洋食", "ステーキ", "ビストロ", "居酒屋", "バー", "ワインバー", "カフェ", "スイーツ", "その他",
  ]);
  form.addListItem().setTitle("価格帯").setChoiceValues([
    "〜3,000円", "3,000〜5,000円", "5,000〜8,000円", "8,000〜12,000円", "12,000〜20,000円", "20,000円〜",
  ]);
  form.addMultipleChoiceItem().setTitle("フォーマル度").setChoiceValues([
    "フォーマル", "きちんと", "上質カジュアル", "カジュアル", "とても気軽",
  ]);
  form.addCheckboxItem().setTitle("利用シーン").setChoiceValues([
    "重要な接待", "仕事の会食", "友人", "家族", "デート", "一人", "ランチ", "二次会", "記念日",
  ]);
  form.addCheckboxItem().setTitle("雰囲気").setChoiceValues([
    "静か", "落ち着いている", "活気あり", "眺望が良い", "隠れ家", "個室あり", "カウンター", "テラス",
  ]);
  form.addMultipleChoiceItem().setTitle("犬連れ").setChoiceValues(["可", "不可", "テラス席のみ可", "要確認"]);
  form.addParagraphTextItem().setTitle("おすすめポイント");
  form.addParagraphTextItem().setTitle("注意点");
  form.addTextItem().setTitle("ひとこと評価");
  form.addParagraphTextItem().setTitle("自由メモ");
  form.addDateItem().setTitle("最終訪問日");
  form.addTextItem().setTitle("公式HP URL");
  form.addTextItem().setTitle("食べログURL");
  form.addTextItem().setTitle("予約URL");
  form.addTextItem().setTitle("メディア掲載名");
  form.addTextItem().setTitle("メディア掲載URL");
  form.addMultipleChoiceItem().setTitle("また行きたい度").setChoiceValues(["1", "2", "3", "4", "5"]);
}

function fillGiftForm_(form) {
  form.setDescription("贈ったもの、取り寄せたものを登録します。写真は編集画面で「ファイルのアップロード」を追加してください。");
  form.setCollectEmail(false);
  form.addTextItem().setTitle("商品名").setRequired(true);
  form.addTextItem().setTitle("店名・ブランド");
  form.addListItem().setTitle("カテゴリ").setChoiceValues(["高級", "菓子", "酒", "その他"]);
  form.addListItem().setTitle("価格帯").setChoiceValues([
    "〜3,000円", "3,000〜5,000円", "5,000〜8,000円", "8,000〜12,000円", "12,000〜20,000円", "20,000円〜",
  ]);
  form.addCheckboxItem().setTitle("向いている相手・用途").setChoiceValues(["取引先", "友人", "家族", "自分用"]);
  form.addTextItem().setTitle("日持ち・保存").setHelpText("例: 60日 / 常温");
  form.addTextItem().setTitle("購入先URL");
  form.addParagraphTextItem().setTitle("おすすめポイント");
  form.addParagraphTextItem().setTitle("注意点・メモ");
  form.addTextItem().setTitle("メディア掲載名");
  form.addTextItem().setTitle("メディア掲載URL");
  form.addMultipleChoiceItem().setTitle("また使いたい度").setChoiceValues(["1", "2", "3", "4", "5"]);
}
