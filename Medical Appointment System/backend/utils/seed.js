const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-medical-system');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Cleared existing data');

    // Create Users
    const users = [
      {
        name: 'John Patient',
        email: 'patient@demo.com',
        password: await bcrypt.hash('demo123', 10),
        role: 'patient',
        phone: '+1234567890',
        age: 35,
        gender: 'male',
      },
      {
        name: 'Dr. Sarah Smith',
        email: 'doctor@demo.com',
        password: await bcrypt.hash('demo123', 10),
        role: 'doctor',
        phone: '+1234567891',
        age: 42,
        gender: 'female',
      },
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        password: await bcrypt.hash('demo123', 10),
        role: 'admin',
        phone: '+1234567892',
        age: 38,
        gender: 'male',
      },
      {
        name: 'Jane Doe',
        email: 'jane@demo.com',
        password: await bcrypt.hash('demo123', 10),
        role: 'patient',
        phone: '+1234567893',
        age: 28,
        gender: 'female',
      },
      {
        name: 'Dr. Michael Johnson',
        email: 'michael@demo.com',
        password: await bcrypt.hash('demo123', 10),
        role: 'doctor',
        phone: '+1234567894',
        age: 45,
        gender: 'male',
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created users');

    // Create Patients
    const patients = [
      {
        userId: createdUsers[0]._id,
        age: 35,
        gender: 'male',
        bloodGroup: 'A+',
        contact: '+1234567890',
        emergencyContact: {
          name: 'Mary Patient',
          phone: '+1234567899',
          relation: 'Spouse',
        },
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        },
        medicalHistory: [
          {
            condition: 'Hypertension',
            diagnosisDate: new Date('2020-01-15'),
            treatment: 'Medication',
            doctor: 'Dr. Smith',
          },
        ],
        allergies: ['Penicillin'],
        currentMedications: ['Lisinopril'],
        chronicConditions: ['Hypertension'],
      },
      {
        userId: createdUsers[3]._id,
        age: 28,
        gender: 'female',
        bloodGroup: 'B+',
        contact: '+1234567893',
        emergencyContact: {
          name: 'Robert Doe',
          phone: '+1234567898',
          relation: 'Brother',
        },
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
        },
        medicalHistory: [],
        allergies: [],
        currentMedications: [],
        chronicConditions: [],
      },
    ];

    const createdPatients = await Patient.insertMany(patients);
    console.log('Created patients');

    // Create Doctors
    const doctors = [
      {
        userId: createdUsers[1]._id,
        specialization: 'Cardiologist',
        department: 'Cardiology',
        experience: 15,
        qualification: 'MD, FACC',
        consultationFee: 150,
        ratings: 4.8,
        totalReviews: 120,
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        ],
        bio: 'Board-certified cardiologist with over 15 years of experience in treating heart conditions.',
        languages: ['English', 'Spanish'],
        hospitalAffiliation: 'City General Hospital',
        licenseNumber: 'MD12345',
        isVerified: true,
      },
      {
        userId: createdUsers[4]._id,
        specialization: 'Neurologist',
        department: 'Neurology',
        experience: 12,
        qualification: 'MD, PhD',
        consultationFee: 175,
        ratings: 4.9,
        totalReviews: 95,
        availability: [
          { day: 'Monday', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Wednesday', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Friday', startTime: '08:00', endTime: '16:00', isAvailable: true },
        ],
        bio: 'Specialized in neurological disorders with research focus on stroke prevention.',
        languages: ['English', 'French'],
        hospitalAffiliation: 'University Medical Center',
        licenseNumber: 'MD67890',
        isVerified: true,
      },
    ];

    const createdDoctors = await Doctor.insertMany(doctors);
    console.log('Created doctors');

    // Create Appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = [
      {
        patientId: createdPatients[0]._id,
        doctorId: createdDoctors[0]._id,
        userId: createdUsers[0]._id,
        date: tomorrow,
        time: '10:30',
        symptoms: 'Chest pain and shortness of breath',
        priority: 'high',
        department: 'Cardiology',
        consultationFee: 150,
        status: 'confirmed',
        aiRecommended: true,
        aiAnalysis: {
          recommendedDoctor: 'Dr. Sarah Smith',
          priority: 'high',
          suggestedAction: 'Immediate consultation recommended',
          confidence: 85,
        },
      },
      {
        patientId: createdPatients[1]._id,
        doctorId: createdDoctors[1]._id,
        userId: createdUsers[3]._id,
        date: tomorrow,
        time: '14:00',
        symptoms: 'Frequent headaches and dizziness',
        priority: 'medium',
        department: 'Neurology',
        consultationFee: 175,
        status: 'pending',
        aiRecommended: false,
      },
      {
        patientId: createdPatients[0]._id,
        doctorId: createdDoctors[0]._id,
        userId: createdUsers[0]._id,
        date: today,
        time: '09:00',
        symptoms: 'Annual checkup',
        priority: 'low',
        department: 'Cardiology',
        consultationFee: 150,
        status: 'completed',
        diagnosis: 'Normal blood pressure, overall good health',
        aiRecommended: false,
      },
    ];

    await Appointment.insertMany(appointments);
    console.log('Created appointments');

    console.log('✅ Seed data completed successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('Patient: patient@demo.com / demo123');
    console.log('Doctor: doctor@demo.com / demo123');
    console.log('Admin: admin@demo.com / demo123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
