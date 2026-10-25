"use client";

import { useEffect, useState } from "react";

const WORDS = ["websites", "Android apps", "billing systems", "automation"];

export function Typewriter() {
  const [text, setText] = useState(WORDS[0] ?? "");

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let wi = 0;
    let ci = WORDS[0]?.length ?? 0;
    let deleting = true;
    let timer = 0;
    const tick = () => {
      const word = WORDS[wi] ?? "";
      ci += deleting ? -1 : 1;
      setText(word.slice(0, ci));
      let delay = deleting ? 35 : 75;
      if (!deleting && ci === word.length) {
        deleting = true;
        delay = 1400;
      } else if (deleting && ci === 0) {
        deleting = false;
        wi = (wi + 1) % WORDS.length;
        delay = 300;
      }
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="type" aria-hidden="true">
      Right now I build <b>{text}</b>
      <i className="caret" />
    </div>
  );
}
