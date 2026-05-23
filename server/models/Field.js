const mongoose = require('mongoose');

const subFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: '📘' },
  description: { type: String, default: '' },
  color: { type: String, default: 'from-blue-400 to-blue-600' },
  order: { type: Number, default: 0 },
  skills: [{ type: String }],
  technologies: [{ type: String }],
  duration: { type: String, default: '' }
}, { _id: true });

const roadmapStepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  skills: [{ type: String }],
  technologies: [{ type: String }],
  resources: [{ title: String, url: String, type: { type: String, enum: ['video', 'article', 'course', 'book'], default: 'video' } }],
  projects: [{ title: String, description: String }],
  duration: { type: String, default: '' },
  prerequisites: [{ type: String }]
});

const careerPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  roles: [{ type: String }],
  salary: { type: String, default: '' },
  demand: { type: String, enum: ['low', 'medium', 'high', 'very-high'], default: 'high' },
  growth: { type: String, default: '' }
});

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '📚' },
  color: { type: String, default: 'from-blue-500 to-blue-700' },
  description: { type: String, default: '' },
  longDescription: { type: String, default: '' },
  bannerColor: { type: String, default: 'bg-gradient-to-br from-blue-600 to-purple-700' },
  overview: { type: String, default: '' },
  totalSubFields: { type: Number, default: 0 },
  totalDuration: { type: String, default: '' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all-levels'], default: 'all-levels' },
  subFields: [subFieldSchema],
  roadmap: [roadmapStepSchema],
  careerPaths: [careerPathSchema],
  technologies: [{ type: String }],
  prerequisites: [{ type: String }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Field', fieldSchema);
