export function getParam(searchParams, key) {
  return searchParams.get(key) ?? "";
}

export function setParam(searchParams, setSearchParams, key, value) {
  const next = new URLSearchParams(searchParams);
  if (value) next.set(key, value);
  else next.delete(key);
  setSearchParams(next, { replace: true });
}
