const MedicalReport = require('../models/MedicalReport');
const Patient = require('../models/Patient');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/reports');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and documents are allowed'));
    }
  }
});

// @desc    Get all medical reports
// @route   GET /api/reports
// @access  Private
const getMedicalReports = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) query.patientId = patient._id;
    }

    const reports = await MedicalReport.find(query)
      .populate('patientId')
      .populate('doctorId')
      .sort({ uploadDate: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single medical report
// @route   GET /api/reports/:id
// @access  Private
const getMedicalReportById = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && report.patientId.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload medical report
// @route   POST /api/reports
// @access  Private
const uploadMedicalReport = async (req, res) => {
  try {
    const { title, description, reportType } = req.body;

    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const report = await MedicalReport.create({
      patientId: patient._id,
      title,
      description,
      reportType: reportType || 'other',
      fileUrl: `/uploads/reports/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete medical report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteMedicalReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && report.patientId.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', report.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await report.deleteOne();
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Share medical report
// @route   PUT /api/reports/:id/share
// @access  Private
const shareMedicalReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && report.patientId.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    report.isShared = !report.isShared;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMedicalReports,
  getMedicalReportById,
  uploadMedicalReport,
  deleteMedicalReport,
  shareMedicalReport,
  upload,
};
