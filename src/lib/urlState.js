export function getParam(searchParams, key) {
  return searchParams.get(key) ?? "";
}

export function setParam(searchParams, setSearchParams, key, value) {
  const next = new URLSearchParams(searchParams);
  if (value) next.set(key, value);
  else next.delete(key);
  setSearchParams(next, { replace: true });
}

export function getList(searchParams, key) {
  return String(getParam(searchParams, key))
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toggleList(searchParams, setSearchParams, key, value) {
  const current = getList(searchParams, key);
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
  setParam(searchParams, setSearchParams, key, next.join(","));
}

export function clearParams(searchParams, setSearchParams, keys) {
  const next = new URLSearchParams(searchParams);
  keys.forEach((key) => next.delete(key));
  setSearchParams(next, { replace: true });
}

export function hasParams(searchParams, keys) {
  return keys.some((key) => Boolean(searchParams.get(key)));
}

