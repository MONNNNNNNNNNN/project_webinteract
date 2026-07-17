import { JSEARCH_API_KEY, hasJSearchKey } from "./_lib/env.js";
import { MOCK_JOBS } from "./_lib/mockData.js";

function simulatedJobs(interest) {
  const jobs = interest ? MOCK_JOBS.filter((j) => j.interest === interest) : MOCK_JOBS;
  return jobs;
}

const INTEREST_QUERY_TERMS = {
  "3D & Animation": "3D animation artist",
  "Game Dev": "game developer",
  "AI & Data": "AI data science",
  Software: "software developer",
};

async function liveJobs(interest) {
  const term = INTEREST_QUERY_TERMS[interest] || "digital media";
  const query = `${term} jobs Thailand`;
  const url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&num_pages=1&country=th&date_posted=all`;

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": JSEARCH_API_KEY,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  });

  if (!res.ok) throw new Error(`JSearch API ${res.status}`);
  const data = await res.json();
  const jobs = data.data?.jobs || [];

  return jobs.map((j) => ({
    id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    location: j.job_city
      ? `${j.job_city}, ${j.job_country}`
      : (j.job_location || "").split("•")[0].trim() || j.job_country || "Thailand",
    interest: interest || "",
    postedAt: j.job_posted_at_datetime_utc || j.job_posted_at || null,
    url: j.job_apply_link,
  }));
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const interest = (req.query?.interest || "").toString();

  if (hasJSearchKey) {
    try {
      const jobs = await liveJobs(interest);
      res.status(200).json({ jobs, simulated: false });
      return;
    } catch {
      res.status(200).json({
        jobs: simulatedJobs(interest),
        simulated: true,
        note: "Live JSearch call failed, showing simulated listings instead.",
      });
      return;
    }
  }

  res.status(200).json({ jobs: simulatedJobs(interest), simulated: true });
}
