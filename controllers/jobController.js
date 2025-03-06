import asyncHandler from 'express-async-handler';
import Job from '../models/jobModel.js';

//Create a new job

export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({
    ...req.body,
    employer: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: 'Job created successfully',
    job,
  });
});

//Get all jobs

export const getJobs = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { company: { $regex: req.query.keyword, $options: 'i' } },
          { skills: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const jobs = await Job.find({ ...keyword, status: 'open' })
    .populate('employer', 'name company')
    .sort('-createdAt')
    .lean();

  return res.json({
    success: true,
    message: 'Jobs fetched successfully',
    jobs,
  });
});

//Get job by ID

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('employer', 'name company');

  if (job) {
    return res.json({
      success: true,
      message: 'Job fetched successfully',
      job,
    });
  } else {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
});

//Update job

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

  return res.json({
    success: true,
    message: 'Job updated successfully',
    updatedJob,
  });
});

//Delete job

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
  }

  await job.deleteOne();
  return res.json({ success: true, message: 'Job removed successfully' });
});

//Apply for job

export const applyForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  const alreadyApplied = job.applications.some(
    (app) => app.student.toString() === req.user._id.toString()
  );

  if (alreadyApplied) {
    return res.status(400).json({ success: false, message: 'Already applied to this job' });
  }

  job.applications.push({ student: req.user._id, status: 'pending' });
  await job.save();

  return res.status(201).json({ success: true, message: 'Successfully applied to job' });
});

//  Update application status

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to update application status' });
  }

  const application = job.applications.id(req.params.applicationId);

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  application.status = status;
  await job.save();

  return res.json({ success: true, message: 'Application status updated' });
});
