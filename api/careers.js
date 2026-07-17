import { JSEARCH_API_KEY, hasJSearchKey } from "./_lib/env.js";
import { MOCK_JOBS } from "./_lib/mockData.js";

function simulatedJobs(interest) {
  const jobs = interest ? MOCK_JOBS.filter((j) => j.interest === interest) : MOCK_JOBS;
  return jobs;
}

async function liveJobs(interest) {
  const query = interest ? `${interest} entry level Thailand` : "digital media engineering Thailand";
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`;

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": JSEARCH_API_KEY,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  });

  if (!res.ok) throw new Error(`JSearch API ${res.status}`);
  const data = await res.json();

  return (data.data || []).map((j) => ({
    id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    location: j.job_city ? `${j.job_city}, ${j.job_country}` : j.job_country,
    interest: interest || "",
    postedAt: j.job_posted_at_datetime_utc,
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
