const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && prescription.patientId.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private/Doctor
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medications, diagnosis, notes, followUpDate } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const prescription = await Prescription.create({
      appointmentId,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      medications,
      diagnosis,
      notes,
      followUpDate,
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate PDF prescription
// @route   POST /api/prescriptions/:id/generate-pdf
// @access  Private/Doctor
const generatePDF = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads/prescriptions');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `prescription-${prescription._id}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    // Create PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('Medical Prescription', { align: 'center' });
    doc.moveDown();

    // Patient Info
    doc.fontSize(14).text('Patient Information:');
    doc.fontSize(12).text(`Name: ${prescription.patientId.userId?.name || 'N/A'}`);
    doc.text(`Age: ${prescription.patientId.age || 'N/A'}`);
    doc.text(`Gender: ${prescription.patientId.gender || 'N/A'}`);
    doc.moveDown();

    // Doctor Info
    doc.fontSize(14).text('Doctor Information:');
    doc.fontSize(12).text(`Name: ${prescription.doctorId.userId?.name || 'N/A'}`);
    doc.text(`Specialization: ${prescription.doctorId.specialization || 'N/A'}`);
    doc.moveDown();

    // Diagnosis
    doc.fontSize(14).text('Diagnosis:');
    doc.fontSize(12).text(prescription.diagnosis || 'N/A');
    doc.moveDown();

    // Medications
    doc.fontSize(14).text('Medications:');
    prescription.medications.forEach((med, index) => {
      doc.fontSize(12).text(`${index + 1}. ${med.name}`);
      doc.text(`   Dosage: ${med.dosage}`);
      doc.text(`   Frequency: ${med.frequency}`);
      doc.text(`   Duration: ${med.duration}`);
      if (med.instructions) {
        doc.text(`   Instructions: ${med.instructions}`);
      }
      doc.moveDown();
    });

    // Notes
    if (prescription.notes) {
      doc.fontSize(14).text('Notes:');
      doc.fontSize(12).text(prescription.notes);
      doc.moveDown();
    }

    // Follow-up
    if (prescription.followUpDate) {
      doc.fontSize(14).text('Follow-up Date:');
      doc.fontSize(12).text(new Date(prescription.followUpDate).toLocaleDateString());
    }

    doc.end();

    stream.on('finish', async () => {
      const pdfUrl = `/uploads/prescriptions/${fileName}`;
      prescription.pdfUrl = pdfUrl;
      prescription.isGenerated = true;
      await prescription.save();
      res.json({ pdfUrl });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  generatePDF,
};
