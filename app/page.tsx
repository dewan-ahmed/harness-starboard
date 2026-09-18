import Starfield from "@/components/Starfield";
import { fetchStarboard } from "@/lib/github";

export const revalidate = 600;

export default async function HomePage() {
  let error: string | null = null;
  let repos = [] as Awaited<ReturnType<typeof fetchStarboard>>;
  try {
    repos = await fetchStarboard();
  } catch (err) {
    error = err instanceof Error ? err.message : "Clouds covered the stars.";
  }

  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);

  return (
    <main className="report">
      <p className="eyebrow">Public GitHub · harness org · no token</p>
      <h1>Starboard</h1>
      <p className="lede">
        Each star is an open-source Harness repo. Bigger means more GitHub stars. Click one, then
        sail over to the source.
      </p>
      {error ? <p className="error">{error}</p> : null}
      {repos.length > 0 ? (
        <>
          <section className="stats">
            <article>
              <span>Repos in the sky</span>
              <b>{repos.length}</b>
            </article>
            <article>
              <span>Total starlight</span>
              <b>{totalStars.toLocaleString()}</b>
            </article>
            <article>
              <span>Brightest</span>
              <b>{repos[0]?.name}</b>
            </article>
            <article>
              <span>Its magnitude</span>
              <b>{repos[0]?.stars.toLocaleString()}</b>
            </article>
          </section>
          <Starfield repos={repos.slice(0, 36)} />
          <p className="fineprint">
            Data from the public{" "}
            <a href="https://github.com/harness" target="_blank" rel="noreferrer">
              github.com/harness
            </a>{" "}
            API. No Harness account, org, or PAT.
          </p>
        </>
      ) : null}
    </main>
  );
}
