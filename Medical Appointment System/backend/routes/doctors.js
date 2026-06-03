const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialization, available } = req.query;
    
    let query = {};
    if (specialization) {
      query.specialization = specialization;
    }
    
    const doctors = await Doctor.find(query)
      .populate('user', 'name email phone avatar')
      .sort({ rating: -1 });
    
    // Filter by availability if requested
    let filteredDoctors = doctors;
    if (available === 'true') {
      const today = new Date().toISOString().split('T')[0];
      filteredDoctors = doctors.filter(doctor => {
        const unavailableDates = doctor.unavailableDates.map(d => 
          new Date(d).toISOString().split('T')[0]
        );
        return !unavailableDates.includes(today);
      });
    }
    
    res.status(200).json({
      success: true,
      count: filteredDoctors.length,
      doctors: filteredDoctors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get single doctor
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone avatar');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/doctors/profile
// @desc    Update doctor profile
// @access  Private/Doctor
router.put('/profile', protect, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }
    
    const { specialization, qualification, experience, consultationFee, 
            availability, bio, hospital } = req.body;
    
    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience) doctor.experience = experience;
    if (consultationFee) doctor.consultationFee = consultationFee;
    if (availability) doctor.availability = availability;
    if (bio) doctor.bio = bio;
    if (hospital) doctor.hospital = hospital;
    
    await doctor.save();
    
    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/doctors/availability
// @desc    Update doctor availability
// @access  Private/Doctor
router.put('/availability', protect, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }
    
    const { unavailableDates } = req.body;
    
    if (unavailableDates) {
      doctor.unavailableDates = unavailableDates;
    }
    
    await doctor.save();
    
    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/doctors
// @desc    Add new doctor (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { userId, ...doctorData } = req.body;
    
    const doctor = await Doctor.create({
      user: userId,
      ...doctorData
    });
    
    res.status(201).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    await doctor.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
