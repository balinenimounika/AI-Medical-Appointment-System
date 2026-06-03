const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
  type: String,
  default: ''
},

qualification: {
  type: String,
  default: ''
},

experience: {
  type: Number,
  default: 0
},

licenseNumber: {
  type: String,
  default: ''
},

consultationFee: {
  type: Number,
  default: 0
},
  
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  unavailableDates: [{
    type: Date
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    default: ''
  },
  hospital: {
    type: String,
    default: ''
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
