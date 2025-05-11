const express = require("express");
const router = express.Router();
const Job = require("../models/job");

// GET /jobs - list all jobs with optional type filter and populated applicants
router.get("/jobs", async (req, res) => {
  try {
    const jobType = req.query.type;
    let filter = {};
    if (jobType && jobType !== "all") {
      filter.type = jobType;
    }
    const jobs = await Job.find(filter).populate(
      "applicants",
      "name username email"
    );
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).send("Something Went Wrong");
  }
});

// POST /jobs - create a new job
router.post("/jobs", async (req, res) => {
  try {
    const { title, description, company, type } = req.body;
    const job = new Job({ title, description, company, type });
    await job.save();
    res.json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).send("Something Went Wrong");
  }
});

// POST /jobs/:jobId/apply - apply for a job
router.post("/jobs/:jobId/apply", async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (!job.applicants.includes(userId)) {
      job.applicants.push(userId);
      await job.save();
    }

    res.json({ success: true, job });
  } catch (err) {
    console.error("Error applying for job:", err);
    res.status(500).send("Something Went Wrong");
  }
});

// DELETE /jobs/:jobId - delete a job
router.delete("/jobs/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    await Job.findByIdAndDelete(jobId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).send("Something Went Wrong");
  }
});

module.exports = router;
