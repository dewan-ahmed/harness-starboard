export type StarRepo = {
  name: string;
  description: string;
  htmlUrl: string;
  stars: number;
  language: string | null;
  updatedAt: string;
  forks: number;
};

export async function fetchStarboard(): Promise<StarRepo[]> {
  const res = await fetch(
    "https://api.github.com/orgs/harness/repos?per_page=100&sort=updated&type=public",
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "harness-starboard",
      },
      next: { revalidate: 600 },
    },
  );
  if (!res.ok) throw new Error("The starboard could not read GitHub.");
  const json = (await res.json()) as {
    name?: string;
    description?: string | null;
    html_url?: string;
    stargazers_count?: number;
    language?: string | null;
    updated_at?: string;
    forks_count?: number;
    fork?: boolean;
    archived?: boolean;
  }[];

  return json
    .filter((repo) => !repo.fork && !repo.archived)
    .map((repo) => ({
      name: repo.name || "repo",
      description: repo.description || "A public Harness project.",
      htmlUrl: repo.html_url || "https://github.com/harness",
      stars: repo.stargazers_count || 0,
      language: repo.language || null,
      updatedAt: repo.updated_at || new Date().toISOString(),
      forks: repo.forks_count || 0,
    }))
    .sort((a, b) => b.stars - a.stars);
}
