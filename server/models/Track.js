const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  type: { type: String, enum: ['video', 'article', 'course', 'book', 'tool'], default: 'video' }
});

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  step: { type: Number, default: 0 },
  icon: { type: String, default: '🎯' }
});

const trackSchema = new mongoose.Schema({
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true
  },
  name: { type: String, required: true },
  icon: { type: String, default: '🎯' },
  color: { type: String, default: 'from-blue-500 to-purple-600' },
  description: { type: String, default: '' },
  longDescription: { type: String, default: '' },
  overview: { type: String, default: '' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all-levels'], default: 'all-levels' },
  duration: { type: String, default: '' },
  totalSteps: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  roadmap: [
    {
      step: { type: Number, required: true },
      title: { type: String, required: true },
      description: { type: String, default: '' },
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
      skills: [{ type: String }],
      technologies: [{ type: String }],
      resources: [resourceSchema],
      projects: [{ title: String, description: String }],
      duration: { type: String, default: '' },
      prerequisites: [{ type: String }],
      status: { type: String, enum: ['required', 'optional', 'bonus'], default: 'required' },
      icon: { type: String, default: '📖' }
    }
  ],
  technologies: [{ type: String }],
  prerequisites: [{ type: String }],
  milestones: [milestoneSchema],
  careerRoles: [{ type: String }],
  averageSalary: { type: String, default: '' },
  jobDemand: { type: String, enum: ['low', 'medium', 'high', 'very-high'], default: 'high' },
  projects: [{
    title: String,
    description: String,
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    technologies: [{ type: String }]
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);
