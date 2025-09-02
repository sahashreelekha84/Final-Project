const mongoose= require("mongoose");
const Schema=mongoose.Schema
const packageSchema = new Schema({
  workplace: String,
  name: String,
  price: Number,
  currency: String,
  billingCycle: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'yearly'] },
  features: [String],
  services: [
    {
      icon: { type: String, required: true },   // e.g. "images/icon_4.png"
      title: { type: String, required: true },  // e.g. "Yoga Classes"
      text: { type: String, required: true },   // e.g. "Improve flexibility..."
    }
  ],
  active: { type: Boolean, default: true }
}, { timestamps: true });

const subscriptionSchema = new Schema({
  clientId: Schema.Types.ObjectId,
  packageId: Schema.Types.ObjectId,
  status: { type: String, enum: ['active', 'past_due', 'canceled', 'expired'] },
  start: Date,
  end: Date,
  renewal: Date,
  gateway: String,
  lastInvoiceId: Schema.Types.ObjectId
}, { timestamps: true });

const paymentSchema = new Schema({
  subscriptionId: Schema.Types.ObjectId,
  amount: Number,
  status: String,
  gateway: String,
  externalRef: String
}, { timestamps: true });

module.exports = {
  Package:mongoose.model('Package', packageSchema),
  Subscription: mongoose.model('Subscription', subscriptionSchema),
  Payment: mongoose.model('Payment', paymentSchema)
};
