export function parseCsv(text) {
  const input = String(text || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const header = (rows.shift() || []).map((item) => item.trim());
  return rows
    .filter((item) => item.some((value) => String(value).trim() !== ""))
    .map((item) => {
      const record = {};
      header.forEach((key, index) => {
        const value = item[index] ?? "";
        const previous = record[key];
        if (previous === undefined || String(previous).trim() === "") {
          record[key] = value;
        } else if (String(value).trim() !== "") {
          record[key] = value;
        }
      });
      return record;
    });
}

export function cell(record, ...keys) {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
}

export function splitList(value) {
  if (!value) return [];
  return String(value)
    .split(/[,、，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toNumberOrNull(value) {
  const match = String(value || "").match(/\d+/);
  if (!match) return null;
  return Number(match[0]);
}

export function drivePhotoUrls(value) {
  const text = String(value || "");
  const ids = [
    ...text.matchAll(/[?&]id=([a-zA-Z0-9_-]+)/g),
    ...text.matchAll(/\/file\/d\/([a-zA-Z0-9_-]+)/g),
  ].map((match) => match[1]);
  const unique = [...new Set(ids)];
  return unique.map((id) => `https://drive.google.com/thumbnail?id=${id}&sz=w1600`);
}

export function photoList(record) {
  const ready = cell(record, "写真表示URL");
  if (ready) {
    return ready
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter((item) => item.startsWith("http"));
  }
  return drivePhotoUrls(cell(record, "写真"));
}
