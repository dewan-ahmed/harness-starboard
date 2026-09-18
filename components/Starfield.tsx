"use client";

import { useMemo, useState } from "react";
import type { StarRepo } from "@/lib/github";

function hash(name: string) {
  return [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

export default function Starfield({ repos }: { repos: StarRepo[] }) {
  const [selected, setSelected] = useState<StarRepo | null>(repos[0] ?? null);

  const placed = useMemo(
    () =>
      repos.map((repo, index) => {
        const n = hash(repo.name);
        const left = 6 + (n % 88);
        const top = 8 + ((n * 13 + index * 17) % 72);
        const size = Math.max(8, Math.min(42, 8 + Math.log10(repo.stars + 1) * 10));
        const fresh = Date.now() - new Date(repo.updatedAt).getTime() < 1000 * 60 * 60 * 24 * 14;
        return { repo, left, top, size, fresh };
      }),
    [repos],
  );

  return (
    <div className="starfield-wrap">
      <div className="starfield">
        {placed.map(({ repo, left, top, size, fresh }) => (
          <button
            key={repo.name}
            type="button"
            className={`star ${fresh ? "fresh" : ""} ${selected?.name === repo.name ? "picked" : ""}`}
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            title={`${repo.name} · ${repo.stars} stars`}
            onClick={() => setSelected(repo)}
          />
        ))}
      </div>
      {selected ? (
        <aside className="star-card">
          <p className="eyebrow">{selected.language || "open source"}</p>
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>
          <p className="meta">
            ★ {selected.stars.toLocaleString()} · {selected.forks} forks
          </p>
          <a className="ghost" href={selected.htmlUrl} target="_blank" rel="noreferrer">
            Open on GitHub
          </a>
        </aside>
      ) : null}
    </div>
  );
}
