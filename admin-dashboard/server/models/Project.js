import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    client: { type: String, trim: true },
    status: { type: String, enum: ['Planning', 'In Progress', 'Completed'], default: 'Planning' },
    completion: { type: Number, min: 0, max: 100, default: 0 },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;