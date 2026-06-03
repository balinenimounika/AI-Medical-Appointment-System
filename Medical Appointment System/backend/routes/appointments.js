const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/appointments
// @desc    Get all appointments (filtered by role)
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
    
    const { status, date } = req.query;
    
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient')
      .populate('doctor')
      .populate('prescription')
      .sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private

   // @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('prescription');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check access
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      if (appointment.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }
    }

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      if (appointment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }
    }

    res.status(200).json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}); 

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private/Patient
router.post('/', protect, authorize('patient'), async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const patient = await Patient.findOne({ user: req.user.id });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const doctorId = req.body.doctorId;

    const doctor = {
      _id: doctorId,
      consultationFee: 500,
      unavailableDates: []
    };

    const appointmentDate = new Date(req.body.date);

    const unavailableDates = doctor.unavailableDates.map(d =>
      new Date(d).toISOString().split('T')[0]
    );

    const dateStr = appointmentDate.toISOString().split('T')[0];

    if (unavailableDates.includes(dateStr)) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available on this date'
      });
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      date: req.body.date,
      timeSlot: req.body.time,
      symptoms: req.body.symptoms || [],
      consultationType: 'in-person',
      fee: doctor.consultationFee
    });

    res.status(201).json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private/Doctor
router.put('/:id/status', protect, authorize('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const { status } = req.body;
    appointment.status = status;
    
    if (status === 'confirmed') {
      appointment.paymentStatus = 'paid';
      doctor.totalRevenue += appointment.fee;
      await doctor.save();
    }
    
    await appointment.save();
    
    // Create notification for patient
    const patient = await Patient.findById(appointment.patient);
    await Notification.create({
      user: patient.user,
      title: 'Appointment Status Updated',
      message: `Your appointment has been ${status}`,
      type: 'appointment',
      relatedId: appointment._id
    });
    
    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    const { diagnosis, notes, meetingLink } = req.body;
    
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (notes) appointment.notes = notes;
    if (meetingLink) appointment.meetingLink = meetingLink;
    
    await appointment.save();
    
    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
