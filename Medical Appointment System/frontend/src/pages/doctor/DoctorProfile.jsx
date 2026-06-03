import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, GraduationCap, Award, Briefcase, Camera, Save, Lock } from 'lucide-react'

const DoctorProfile = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const profileData = {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+1 234 567 8900',
    specialization: 'Cardiology',
    experience: '15 years',
    education: 'MD - Harvard Medical School',
    license: 'MD-123456',
    hospital: 'City Medical Center',
    address: '123 Medical Center Dr, New York, NY',
    bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in interventional cardiology and has published numerous research papers in leading medical journals.',
    languages: ['English', 'Spanish'],
    consultationFee: '$150'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-slate-400">Manage your professional profile and preferences</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 border-b border-slate-700"
      >
        {['profile', 'professional', 'security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Profile Picture */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full gradient-secondary flex items-center justify-center text-3xl font-bold text-white">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{profileData.name}</h3>
                <p className="text-slate-400">{profileData.specialization}</p>
                <p className="text-sm text-purple-400 mt-1">Doctor ID: #DOC-2024-001</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Personal Information</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.name}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={profileData.email}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={profileData.phone}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.address}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 gradient-primary rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Professional Tab */}
      {activeTab === 'professional' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Professional Information</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Specialization
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.specialization}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Experience
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.experience}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.education}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">License Number</label>
                  <input
                    type="text"
                    defaultValue={profileData.license}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Hospital/Clinic</label>
                  <input
                    type="text"
                    defaultValue={profileData.hospital}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                <textarea
                  rows="4"
                  defaultValue={profileData.bio}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Languages</label>
                  <input
                    type="text"
                    defaultValue={profileData.languages.join(', ')}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Consultation Fee</label>
                  <input
                    type="text"
                    defaultValue={profileData.consultationFee}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 gradient-primary rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 gradient-primary rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  )
}

export default DoctorProfile
