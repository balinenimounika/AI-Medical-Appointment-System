import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  User, 
  Check,
  X,
  Video,
  FileText,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([
  {
    _id: '1',
    patient: {
      user: {
        name: 'Rahul Sharma'
      }
    },
    date: '2026-06-03',
    timeSlot: '09:00 AM',
    status: 'pending',
    consultationType: 'video',
    symptoms: ['Fever', 'Headache']
  },
  {
    _id: '2',
    patient: {
      user: {
        name: 'Priya Reddy'
      }
    },
    date: '2026-06-04',
    timeSlot: '10:30 AM',
    status: 'confirmed',
    consultationType: 'video',
    symptoms: ['Cough', 'Cold']
  },
  {
    _id: '3',
    patient: {
      user: {
        name: 'Amit Kumar'
      }
    },
    date: '2026-05-03',
    timeSlot: '11:00 AM',
    status: 'completed',
    consultationType: 'in-person',
    symptoms: ['Back Pain']
  },
  {
    _id: '4',
    patient: {
      user: {
        name: 'Sneha Patel'
      }
    },
    date: '2026-06-02',
    timeSlot: '12:00 PM',
    status: 'cancelled',
    consultationType: 'video',
    symptoms: ['Skin Allergy']
  },
  {
    _id: '5',
    patient: {
      user: {
        name: 'Arjun Verma'
      }
    },
    date: '2026-06-06',
    timeSlot: '02:00 PM',
    status: 'pending',
    consultationType: 'in-person',
    symptoms: ['Stomach Pain']
  },
  {
    _id: '6',
    patient: {
      user: {
        name: 'Meera Nair'
      }
    },
    date: '2026-06-09',
    timeSlot: '03:30 PM',
    status: 'confirmed',
    consultationType: 'video',
    symptoms: ['Migraine']
  },
  {
    _id: '7',
    patient: {
      user: {
        name: 'Karthik Rao'
      }
    },
    date: '2026-06-12',
    timeSlot: '04:30 PM',
    status: 'completed',
    consultationType: 'in-person',
    symptoms: ['Diabetes Checkup'],
    prescription: 'prescription123'
  },
  {
    _id: '8',
    patient: {
      user: {
        name: 'Ananya Singh'
      }
    },
    date: '2026-06-14',
    timeSlot: '05:00 PM',
    status: 'cancelled',
    consultationType: 'video',
    symptoms: ['Eye Irritation']
  }
])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  //useEffect(() => {
    //fetchAppointments()
  //}, [])

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredAppointments(appointments)
    } else {
      setFilteredAppointments(appointments.filter(apt => apt.status === statusFilter))
    }
  }, [statusFilter, appointments])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/appointments')
      setAppointments(response.data.appointments)
      setFilteredAppointments(response.data.appointments)
    } catch (error) {
      toast.error('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, { status })
      toast.success(`Appointment ${status} successfully`)
      fetchAppointments()
    } catch (error) {
      toast.error('Failed to update appointment status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'rescheduled':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your appointment requests</p>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {appointment.patient?.user?.name || 'Patient'}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.timeSlot}</span>
                      </div>
                    </div>
                    {appointment.symptoms && appointment.symptoms.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Symptoms:</span>{' '}
                        {appointment.symptoms.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'confirmed')}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                        title="Accept"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  {appointment.status === 'confirmed' && appointment.consultationType === 'video' && (
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                      <Video className="w-5 h-5" />
                    </button>
                  )}
                  
                  {appointment.prescription && (
                    <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition">
                      <FileText className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
          <p className="text-gray-600">
            {statusFilter === 'all' 
              ? "You don't have any appointments yet" 
              : `No appointments with status "${statusFilter}"`}
          </p>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments
