const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};

    // Filter by user role
    if (req.user.role === 'patient') {
      query.userId = req.user._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) query.doctorId = doctor._id;
    }

    if (status) query.status = status;
    if (date) query.date = new Date(date);

    const appointments = await Appointment.find(query)
      .populate('patientId')
      .populate('doctorId')
      .sort({ date: -1, time: -1 });

    res.json(appointments);
  } catch (essrror) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, symptoms, priority, enableVideo } = req.body;

// Find logged-in patient
const patient = await Patient.findOne({ userId: req.user._id });

if (!patient) {
  return res.status(404).json({
    message: 'Patient profile not found'
  });
}

// Temporary doctor object for demo doctors
const doctor = {
  _id: doctorId,
  department: 'General Medicine',
  consultationFee: 500
};

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      userId: req.user._id,
      date,
      time,
      symptoms,
      priority: priority || 'medium',
      department: doctor.department,
      consultationFee: doctor.consultationFee,
      videoConsultation: {
        enabled: enableVideo || false,
        roomId: enableVideo ? `room-${Date.now()}` : null,
      },
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { date, time, status } = req.body;

    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (status) appointment.status = status;

    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats
// @access  Private
const getAppointmentStats = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) query.doctorId = doctor._id;
    }

    const total = await Appointment.countDocuments(query);
    const pending = await Appointment.countDocuments({ ...query, status: 'pending' });
    const confirmed = await Appointment.countDocuments({ ...query, status: 'confirmed' });
    const completed = await Appointment.countDocuments({ ...query, status: 'completed' });
    const cancelled = await Appointment.countDocuments({ ...query, status: 'cancelled' });

    res.json({ total, pending, confirmed, completed, cancelled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentStats,
};
