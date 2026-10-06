import { useEffect, useMemo, useState } from "react";

type Job = {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  category: string;
  level: string;
  posted: string;
  url: string;
  apply_url: string;
};

type JobsResponse = { total_live: number; jobs: Job[] };

const API_URL = "https://artificialintelligencejobs.co/api/jobs";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All disciplines");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Unable to load jobs");
        const data: JobsResponse = await response.json();
        setJobs(data.jobs);
        setTotal(data.total_live);
      } catch {
        setError("We could not load the latest roles. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const categories = useMemo(
    () => ["All disciplines", ...new Set(jobs.map((job) => job.category))],
    [jobs],
  );
  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const searchable =
          `${job.title} ${job.company} ${job.location}`.toLowerCase();
        return (
          searchable.includes(query.toLowerCase()) &&
          (category === "All disciplines" || job.category === category) &&
          (!remoteOnly || job.remote)
        );
      }),
    [jobs, query, category, remoteOnly],
  );

  return (
    <main>
      <header className="border-b border-[#d8d5cc] bg-[#f5f3ed]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a
            href="/"
            className="flex items-center gap-3 text-sm font-extrabold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center bg-[#b9d45a] text-lg font-black">
              +
            </span>
            <span>
              THE AI
              <br />
              JOB BOARD
            </span>
          </a>
          <div className="mono hidden text-[10px] uppercase tracking-[.18em] text-[#66716b] sm:block">
            Curated intelligence careers
          </div>
          <a href="#jobs" className="action-button action-button--light">
            Browse jobs <span aria-hidden="true">↘</span>
          </a>
        </div>
      </header>

      <section className="border-b border-[#d8d5cc] bg-[#172321] text-[#f5f3ed]">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10 lg:pb-24 lg:pt-28">
          <p className="mono mb-6 text-[11px] uppercase tracking-[.2em] text-[#b9d45a]">
            The future of work starts here
          </p>
          <h1 className="max-w-4xl text-5xl font-extrabold leading-[.98] tracking-[-.06em] sm:text-7xl lg:text-[96px]">
            Find your place
            <br />
            <span className="text-[#b9d45a]">in intelligence.</span>
          </h1>
          <div className="mt-10 flex max-w-2xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-base leading-7 text-[#c2cbc2]">
              The most focused job board for people building what comes next in
              AI, machine learning, and the systems around them.
            </p>
            <p className="mono text-xs leading-5 text-[#89958d] sm:text-right">
              <span className="text-[#f5f3ed]">
                {total.toLocaleString() || "—"}
              </span>
              <br />
              live opportunities
            </p>
          </div>
        </div>
      </section>

      <section
        id="jobs"
        className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14"
      >
        <div className="mb-8 flex flex-col gap-5 border-b border-[#d8d5cc] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mono mb-2 text-[10px] uppercase tracking-[.2em] text-[#7b857e]">
              Open roles
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-.04em]">
              Make an impact.
            </h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="relative block sm:min-w-72">
              <span className="sr-only">Search jobs</span>
              <span className="pointer-events-none absolute left-4 top-3 text-lg">
                ⌕
              </span>
              <input
                className="search-input w-full border border-[#cbc9c0] bg-transparent py-3 pl-10 pr-4 text-sm placeholder:text-[#89918b]"
                placeholder="Search title, company, city"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label>
              <span className="sr-only">Filter by discipline</span>
              <select
                className="filter-select w-full border border-[#cbc9c0] bg-transparent px-4 py-3 text-sm sm:min-w-44"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="mono text-xs text-[#7b857e]">
            {filteredJobs.length} roles shown
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-bold">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#172321]"
              checked={remoteOnly}
              onChange={(event) => setRemoteOnly(event.target.checked)}
            />{" "}
            Remote only
          </label>
        </div>
        {loading && (
          <div className="loader border-y border-[#d8d5cc] py-16 text-center mono text-xs uppercase tracking-[.2em]">
            Loading roles...
          </div>
        )}
        {error && (
          <div className="border border-[#d8b7a5] bg-[#f1dfd5] p-5 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="border-y border-[#d8d5cc] py-16 text-center text-sm text-[#66716b]">
            No roles match those filters.
          </div>
        )}
        <div className="divide-y divide-[#d8d5cc] border-y border-[#d8d5cc]">
          {filteredJobs.map((job) => (
            <article
              className="job-row grid gap-5 px-1 py-6 lg:grid-cols-[1fr_1fr_auto] lg:items-center lg:gap-10"
              key={job.url}
            >
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="mono text-[10px] uppercase tracking-wider text-[#66716b]">
                    {job.category}
                  </span>
                  {job.remote && (
                    <span className="bg-[#dcebb0] px-2 py-0.5 mono text-[10px] uppercase tracking-wider">
                      Remote
                    </span>
                  )}
                </div>
                <h3 className="max-w-xl text-lg font-extrabold leading-snug tracking-[-.02em]">
                  {job.title}
                </h3>
                <p className="mt-2 text-sm text-[#66716b]">{job.company}</p>
              </div>
              <div className="flex gap-8 text-sm text-[#53605a]">
                <p>
                  <span className="mono mb-1 block text-[9px] uppercase tracking-wider text-[#89918b]">
                    Location
                  </span>
                  {job.location}
                </p>
                <p className="hidden sm:block">
                  <span className="mono mb-1 block text-[9px] uppercase tracking-wider text-[#89918b]">
                    Level
                  </span>
                  {job.level}
                </p>
              </div>
              <div className="flex items-center justify-between gap-8 lg:justify-end">
                <span className="mono text-[10px] text-[#89918b]">
                  {formatDate(job.posted)}
                </span>
                <a
                  className="action-button action-button--dark"
                  href={job.apply_url || job.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View role <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <footer className="border-t border-[#d8d5cc] px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-[#66716b] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold text-[#172321]">THE AI JOB BOARD</span>
          <span>Data sourced from Artificial Intelligence Jobs</span>
        </div>
      </footer>
    </main>
  );
}

export default Home;
