import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  updateApplicationStatus,
} from '../controllers/jobController.js';
import { protect, employer, student } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs); //http://localhost:3000/api/jobs/
router.post('/', protect, employer, createJob); // http://localhost:3000/api/jobs/
router.get('/:id', getJobById); // http://localhost:3000/api/jobs/:id
router.put('/:id', protect, employer, updateJob); // http://localhost:3000/api/jobs/:id
router.delete('/:id', protect, employer, deleteJob); // http://localhost:3000/api/jobs/:id

/* APPLICATION ROUTES -  */
router.post('/:id/apply', protect, student, applyForJob); // http://localhost:3000/api/jobs/:id/apply
router.put('/:id/applications/:applicationId', protect, employer, updateApplicationStatus); // http://localhost:3000/api/jobs/:id/applications/:applicationId

export default router;
