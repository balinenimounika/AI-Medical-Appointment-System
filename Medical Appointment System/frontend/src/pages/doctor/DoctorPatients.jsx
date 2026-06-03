import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  User, 
  Calendar, 
  FileText, 
  Search,
  Activity
} from 'lucide-react'

const DoctorPatients = () => {
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/appointments')
      const appointments = response.data.appointments
      
      // Get unique patients with their latest appointment
      const patientMap = new Map()
      appointments.forEach(apt => {
        if (!patientMap.has(apt.patient._id)) {
          patientMap.set(apt.patient._id, {
            ...apt.patient,
            lastAppointment: apt.date,
            totalVisits: 1
          })
        } else {
          const patient = patientMap.get(apt.patient._id)
          patient.totalVisits += 1
          if (new Date(apt.date) > new Date(patient.lastAppointment)) {
            patient.lastAppointment = apt.date
          }
        }
      })
      
      setPatients(Array.from(patientMap.values()))
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
        <p className="text-gray-600 mt-1">View and manage patient records</p>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">
                    {patient.user?.name || 'Patient'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {patient.user?.age} years • {patient.user?.gender}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Visits</span>
                  <span className="font-semibold text-gray-900">{patient.totalVisits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Visit</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(patient.lastAppointment).toLocaleDateString()}
                  </span>
                </div>
                {patient.bloodGroup && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Blood Group</span>
                    <span className="font-semibold text-gray-900">{patient.bloodGroup}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                <button className="flex-1 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition text-sm font-medium">
                  View History
                </button>
                <button className="flex-1 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition text-sm font-medium">
                  Add Prescription
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Patients Found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'No patients match your search' : "You haven't treated any patients yet"}
          </p>
        </div>
      )}
    </div>
  )
}

export default DoctorPatients
