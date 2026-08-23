import { useEffect } from "react";

function upsertMeta(name, content) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function PageMeta({ title, description, noindex = false }) {
  useEffect(() => {
    document.title = title;
    upsertMeta("description", description);
    upsertMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
  }, [title, description, noindex]);

  return null;
}
