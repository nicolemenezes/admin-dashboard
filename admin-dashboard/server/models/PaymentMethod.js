import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cardBrand: { type: String, enum: ['Visa', 'Mastercard', 'Amex', 'Discover'], required: true },
    last4: { type: String, required: true },
    expiryDate: { type: String, required: true }, // MM/YY
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('PaymentMethod', paymentMethodSchema);