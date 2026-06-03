const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { specialization, department, search } = req.query;
    let query = {};

    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (department) query.department = new RegExp(department, 'i');

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email phone avatar')
      .sort({ ratings: -1 });

    // Filter by search if provided
    let filteredDoctors = doctors;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDoctors = doctors.filter(doc => 
        doc.userId.name.toLowerCase().includes(searchLower) ||
        doc.specialization.toLowerCase().includes(searchLower) ||
        doc.department.toLowerCase().includes(searchLower)
      );
    }

    res.json(filteredDoctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone avatar');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
  try {
    const { userId, specialization, department, experience, qualification, consultationFee, licenseNumber, bio } = req.body;

    const doctor = await Doctor.create({
      userId,
      specialization,
      department,
      experience,
      qualification,
      consultationFee,
      licenseNumber,
      bio,
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check authorization
    if (req.user.role === 'doctor' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { specialization, department, experience, qualification, consultationFee, bio, availability } = req.body;

    if (specialization) doctor.specialization = specialization;
    if (department) doctor.department = department;
    if (experience) doctor.experience = experience;
    if (qualification) doctor.qualification = qualification;
    if (consultationFee) doctor.consultationFee = consultationFee;
    if (bio) doctor.bio = bio;
    if (availability) doctor.availability = availability;

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.deleteOne();
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor availability
// @route   GET /api/doctors/:id/availability
// @access  Public
const getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private
const updateDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check authorization
    if (req.user.role === 'doctor' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { availability } = req.body;
    doctor.availability = availability;
    await doctor.save();

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get departments list
// @route   GET /api/doctors/departments/list
// @access  Public
const getDepartments = async (req, res) => {
  try {
    const departments = await Doctor.distinct('department');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAvailability,
  updateDoctorAvailability,
  getDepartments,
};
