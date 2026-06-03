const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/patients/profile
// @desc    Get patient profile
// @access  Private/Patient
router.get('/profile', protect, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id })
      .populate('user', 'name email phone avatar age gender');
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }
    
    res.status(200).json({
      success: true,
      patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/patients/profile
// @desc    Update patient profile
// @access  Private/Patient
router.put('/profile', protect, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }
    
    const { bloodGroup, allergies, chronicDiseases, emergencyContact, address, insurance } = req.body;
    
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (allergies) patient.allergies = allergies;
    if (chronicDiseases) patient.chronicDiseases = chronicDiseases;
    if (emergencyContact) patient.emergencyContact = emergencyContact;
    if (address) patient.address = address;
    if (insurance) patient.insurance = insurance;
    
    await patient.save();
    
    res.status(200).json({
      success: true,
      patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/patients/medical-history
// @desc    Add medical history
// @access  Private/Patient
router.post('/medical-history', protect, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }
    
    const { condition, diagnosedDate, status } = req.body;
    
    patient.medicalHistory.push({ condition, diagnosedDate, status });
    await patient.save();
    
    res.status(200).json({
      success: true,
      patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID (Doctor/Admin)
// @access  Private/Doctor/Admin
router.get('/:id', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'name email phone avatar age gender');
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.status(200).json({
      success: true,
      patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
