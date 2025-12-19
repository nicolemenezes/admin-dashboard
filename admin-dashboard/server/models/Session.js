import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  activity: String,
  deviceType: String,
  location: String
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
