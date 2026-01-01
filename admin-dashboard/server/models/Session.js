import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // Remove 'index: true' if you have userSchema.index({ user: 1 }) below
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true, // This creates an index automatically
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Remove 'index: true' if you have schema.index({ expiresAt: 1 }) below
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Remove duplicate index definitions - keep only ONE of each:
// Delete these if the fields above already have 'index: true' or 'unique: true'
// sessionSchema.index({ user: 1 });
// sessionSchema.index({ refreshToken: 1 });
// sessionSchema.index({ expiresAt: 1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
