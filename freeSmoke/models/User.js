const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    displayName:     { type: String, default: '' },
    cigarsPerDay:    { type: Number, default: 10 },
    packPrice:       { type: Number, default: 10 },
    smokeYears:      { type: Number, default: 1  },
    dependencyScore: { type: Number, default: 0  },
    dependencyLevel: { type: String, default: '' },
    quitStyle:       { type: String, default: 'gradual' },
    motivation:      { type: String, default: '' },
  },
  quitPlan: {
    startDate:         { type: Date },
    targetQuitDate:    { type: Date },
    weeklyReduction:   { type: Number, default: 1  },
    currentDailyLimit: { type: Number, default: 10 },
    dependencyScore:   { type: Number, default: 0  },
    dependencyLevel:   { type: String, default: '' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);