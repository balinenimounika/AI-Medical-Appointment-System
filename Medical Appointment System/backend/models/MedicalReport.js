const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  title: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    enum: ['lab', 'radiology', 'pathology', 'cardiology', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isSharedWithDoctor: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('MedicalReport', medicalReportSchema);
