const Patient = require('../models/Patient');
const User = require('../models/User');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Doctor/Admin
const getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    const patients = await Patient.find(query)
      .populate('userId', 'name email phone avatar age gender')
      .sort({ createdAt: -1 });

    // Filter by search if provided
    let filteredPatients = patients;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = patients.filter(pat => 
        pat.userId.name.toLowerCase().includes(searchLower) ||
        pat.contact.toLowerCase().includes(searchLower)
      );
    }

    res.json(filteredPatients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'name email phone avatar age gender');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && patient.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create patient profile
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  try {
    const { age, gender, bloodGroup, contact, emergencyContact, address, medicalHistory, allergies, currentMedications, chronicConditions } = req.body;

    // Check if patient profile already exists
    const existingPatient = await Patient.findOne({ userId: req.user._id });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient profile already exists' });
    }

    const patient = await Patient.create({
      userId: req.user._id,
      age,
      gender,
      bloodGroup,
      contact,
      emergencyContact,
      address,
      medicalHistory,
      allergies,
      currentMedications,
      chronicConditions,
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && patient.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { bloodGroup, contact, emergencyContact, address, medicalHistory, allergies, currentMedications, chronicConditions } = req.body;

    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (contact) patient.contact = contact;
    if (emergencyContact) patient.emergencyContact = emergencyContact;
    if (address) patient.address = address;
    if (medicalHistory) patient.medicalHistory = medicalHistory;
    if (allergies) patient.allergies = allergies;
    if (currentMedications) patient.currentMedications = currentMedications;
    if (chronicConditions) patient.chronicConditions = chronicConditions;

    await patient.save();
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await patient.deleteOne();
    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient medical history
// @route   GET /api/patients/:id/history
// @access  Private
const getPatientHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && patient.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
      currentMedications: patient.currentMedications,
      chronicConditions: patient.chronicConditions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientHistory,
};
