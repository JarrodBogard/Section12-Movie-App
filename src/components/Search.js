import { useRef } from "react";
import { useKey } from "../hooks/useKey";

// stateful component //
export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  function callback() {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  }

  useKey("Enter", callback);
  useKey("NumpadEnter", callback);

  return (
    <input
      autoFocus
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputEl}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
