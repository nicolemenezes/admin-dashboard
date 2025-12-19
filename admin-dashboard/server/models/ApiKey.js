import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  name: String,
  prefix: String,
  hashedKey: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  permissions: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: Date,
  lastUsed: Date,
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;   // ✅ THIS LINE IS REQUIRED
