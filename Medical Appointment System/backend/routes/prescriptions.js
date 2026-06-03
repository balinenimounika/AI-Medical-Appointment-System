const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/prescriptions
// @desc    Get all prescriptions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      query.patient = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      query.doctor = doctor._id;
    }
    
    const prescriptions = await Prescription.find(query)
      .populate('patient')
      .populate('doctor')
      .populate('appointment')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/prescriptions/:id
// @desc    Get single prescription
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('appointment');
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    
    res.status(200).json({
      success: true,
      prescription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/prescriptions
// @desc    Create new prescription
// @access  Private/Doctor
router.post('/', protect, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    let patientId = null;
    let appointment = null;

    if (req.body.appointment) {
      appointment = await Appointment.findById(req.body.appointment);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      patientId = appointment.patient;
    }

    const prescription = await Prescription.create({
      appointment: appointment?._id || null,
      patient: patientId,
      doctor: doctor._id,
      diagnosis: req.body.diagnosis,
      medicines: req.body.medicines,
      tests: req.body.tests || [],
      advice: req.body.advice || '',
      followUpDate: req.body.followUpDate
    });

    if (appointment) {
      appointment.prescription = prescription._id;
      await appointment.save();

      const patient = await Patient.findById(appointment.patient);

      if (patient) {
        await Notification.create({
          user: patient.user,
          title: 'New Prescription',
          message: 'Your doctor has added a new prescription',
          type: 'prescription',
          relatedId: prescription._id
        });
      }
    }

    res.status(201).json({
      success: true,
      prescription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/prescriptions/:id/pdf
// @desc    Generate PDF for prescription
// @access  Private
router.get('/:id/pdf', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient')
      .populate('doctor');
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    
    const doc = new PDFDocument();
    const fileName = `prescription-${prescription._id}.pdf`;
    const filePath = path.join(__dirname, '../uploads', fileName);
    
    doc.pipe(fs.createWriteStream(filePath));
    
    // Add content to PDF
    doc.fontSize(20).text('Medical Prescription', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Doctor: ${prescription.doctor.user?.name || 'N/A'}`);
    doc.text(`Specialization: ${prescription.doctor.specialization}`);
    doc.text(`Patient: ${prescription.patient.user?.name || 'N/A'}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.fontSize(14).text('Diagnosis:', { underline: true });
    doc.fontSize(12).text(prescription.diagnosis);
    doc.moveDown();
    
    if (prescription.medicines.length > 0) {
      doc.fontSize(14).text('Medicines:', { underline: true });
      doc.fontSize(12);
      prescription.medicines.forEach((med, index) => {
        doc.text(`${index + 1}. ${med.name} - ${med.dosage}, ${med.frequency} for ${med.duration}`);
        if (med.instructions) {
          doc.text(`   Instructions: ${med.instructions}`);
        }
      });
      doc.moveDown();
    }
    
    if (prescription.tests.length > 0) {
      doc.fontSize(14).text('Recommended Tests:', { underline: true });
      doc.fontSize(12);
      prescription.tests.forEach((test, index) => {
        doc.text(`${index + 1}. ${test}`);
      });
      doc.moveDown();
    }
    
    if (prescription.advice) {
      doc.fontSize(14).text('Advice:', { underline: true });
      doc.fontSize(12).text(prescription.advice);
    }
    
    doc.end();
    
    // Update prescription with PDF URL
    prescription.pdfUrl = `/uploads/${fileName}`;
    await prescription.save();
    
    res.status(200).json({
      success: true,
      pdfUrl: prescription.pdfUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
