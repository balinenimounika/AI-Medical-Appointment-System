const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const MedicalReport = require('../models/MedicalReport');
const ChatHistory = require('../models/ChatHistory');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'admin') {
      stats = {
        totalUsers: await User.countDocuments(),
        totalDoctors: await Doctor.countDocuments(),
        totalPatients: await Patient.countDocuments(),
        totalAppointments: await Appointment.countDocuments(),
        totalPrescriptions: await Prescription.countDocuments(),
        totalReports: await MedicalReport.countDocuments(),
        activeChats: await ChatHistory.countDocuments({ updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      };
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) {
        stats = {
          totalPatients: await Appointment.distinct('patientId', { doctorId: doctor._id }).length,
          todayAppointments: await Appointment.countDocuments({
            doctorId: doctor._id,
            date: new Date().toISOString().split('T')[0],
          }),
          pendingAppointments: await Appointment.countDocuments({
            doctorId: doctor._id,
            status: 'pending',
          }),
          completedAppointments: await Appointment.countDocuments({
            doctorId: doctor._id,
            status: 'completed',
          }),
          totalPrescriptions: await Prescription.countDocuments({ doctorId: doctor._id }),
          ratings: doctor.ratings,
          totalReviews: doctor.totalReviews,
        };
      }
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) {
        stats = {
          totalAppointments: await Appointment.countDocuments({ patientId: patient._id }),
          upcomingAppointments: await Appointment.countDocuments({
            patientId: patient._id,
            date: { $gte: new Date() },
            status: { $in: ['pending', 'confirmed'] },
          }),
          completedAppointments: await Appointment.countDocuments({
            patientId: patient._id,
            status: 'completed',
          }),
          totalPrescriptions: await Prescription.countDocuments({ patientId: patient._id }),
          totalReports: await MedicalReport.countDocuments({ patientId: patient._id }),
        };
      }
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get weekly appointments data
// @route   GET /api/dashboard/weekly-appointments
// @access  Private
const getWeeklyAppointments = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    let query = { date: { $gte: weekAgo, $lte: today } };

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) query.doctorId = doctor._id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) query.patientId = patient._id;
    }

    const appointments = await Appointment.find(query).sort({ date: 1 });

    // Group by day
    const weeklyData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      weeklyData[dateStr] = 0;
    }

    appointments.forEach(apt => {
      const dateStr = apt.date.toISOString().split('T')[0];
      if (weeklyData.hasOwnProperty(dateStr)) {
        weeklyData[dateStr]++;
      }
    });

    res.json(weeklyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get department statistics
// @route   GET /api/dashboard/department-stats
// @access  Private/Admin
const getDepartmentStats = async (req, res) => {
  try {
    const departments = await Doctor.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgRating: { $avg: '$ratings' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly growth data
// @route   GET /api/dashboard/monthly-growth
// @access  Private/Admin
const getMonthlyGrowth = async (req, res) => {
  try {
    const monthlyData = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/recent-activities
// @access  Private
const getRecentActivities = async (req, res) => {
  try {
    let activities = [];

    if (req.user.role === 'admin') {
      const recentAppointments = await Appointment.find()
        .populate('patientId')
        .populate('doctorId')
        .sort({ createdAt: -1 })
        .limit(5);

      activities = recentAppointments.map(apt => ({
        type: 'appointment',
        message: `New appointment booked`,
        data: apt,
        timestamp: apt.createdAt,
      }));
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) {
        const recentAppointments = await Appointment.find({ doctorId: doctor._id })
          .populate('patientId')
          .sort({ createdAt: -1 })
          .limit(5);

        activities = recentAppointments.map(apt => ({
          type: 'appointment',
          message: `Appointment ${apt.status}`,
          data: apt,
          timestamp: apt.createdAt,
        }));
      }
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) {
        const recentAppointments = await Appointment.find({ patientId: patient._id })
          .populate('doctorId')
          .sort({ createdAt: -1 })
          .limit(5);

        activities = recentAppointments.map(apt => ({
          type: 'appointment',
          message: `Appointment ${apt.status}`,
          data: apt,
          timestamp: apt.createdAt,
        }));
      }
    }

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getWeeklyAppointments,
  getDepartmentStats,
  getMonthlyGrowth,
  getRecentActivities,
};
