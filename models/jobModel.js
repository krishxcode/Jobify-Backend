import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
    },
    requirements: {
      type: [String],
      required: [true, 'Please provide job requirements'],
    },
    salary: {
      type: String,
      required: [true, 'Please provide salary range'],
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      required: [true, 'Please provide job type'],
    },
    experience: {
      type: String,
      required: [true, 'Please provide required experience'],
    },
    skills: {
      type: [String],
      required: [true, 'Please provide required skills'],
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applications: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['pending', 'reviewing', 'accepted', 'rejected'],
          default: 'pending',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
