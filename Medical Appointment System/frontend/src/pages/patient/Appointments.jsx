import { useState, useEffect } from 'react'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope,
  X,
  Video,
  FileText,
  Filter
} from 'lucide-react'


const Appointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      date: "2026-06-05",
      time: "09:00 AM",
      status: "confirmed"
    },
    {
      id: 2,
      doctor: "Dr. Michael Smith",
      department: "Dermatology",
      date: "2026-06-09",
      time: "10:00 AM",
      status: "pending"
    },
    {
      id: 3,
      doctor: "Dr. Emily Brown",
      department: "Neurology",
      date: "2026-05-11",
      time: "11:00 AM",
      status: "completed"
    },
    {
      id: 4,
      doctor: "Dr. Robert Wilson",
      department: "Orthopedics",
      date: "2026-05-14",
      time: "12:00 PM",
      status: "cancelled"
    },
    {
      id: 5,
      doctor: "Dr. Lisa Davis",
      department: "Pediatrics",
      date: "2026-06-08",
      time: "01:00 PM",
      status: "rescheduled"
    },
    {
      id: 6,
      doctor: "Dr. James Miller",
      department: "ENT",
      date: "2026-06-19",
      time: "02:00 PM",
      status: "confirmed"
    },
    {
      id: 7,
      doctor: "Dr. Jennifer Taylor",
      department: "Gynecology",
      date: "2026-06-15",
      time: "03:00 PM",
      status: "pending"
    },
    {
      id: 8,
      doctor: "Dr. David Anderson",
      department: "Oncology",
      date: "2026-04-12",
      time: "04:00 PM",
      status: "completed"
    },
    {
      id: 9,
      doctor: "Dr. Sophia Thomas",
      department: "Psychiatry",
      date: "2026-06-23",
      time: "05:00 PM",
      status: "confirmed"
    },
    {
      id: 10,
      doctor: "Dr. Daniel White",
      department: "General Medicine",
      date: "2026-06-25",
      time: "06:00 PM",
      status: "rescheduled"
    }
  ])

  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredAppointments(appointments)
    } else {
      setFilteredAppointments(
        appointments.filter(
          (appointment) => appointment.status === statusFilter
        )
      )
    }
  }, [statusFilter, appointments])


  const handleCancelAppointment = (appointmentId) => {
  if (!window.confirm('Are you sure you want to cancel this appointment?')) {
    return
  }

  setAppointments(
    appointments.map((appointment) =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'cancelled' }
        : appointment
    )
  )
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
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">View and manage your appointments</p>
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
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Dr. {appointment.doctor}
  
                    </h3>
                    <p className="text-primary-600 text-sm">{appointment.department }</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
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
                  
                  {(appointment.status === 'pending') && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {appointment.diagnosis && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Diagnosis:</span>{' '}
                    <span className="text-gray-600">{appointment.diagnosis}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
          <p className="text-gray-600 mb-6">
            {statusFilter === 'all' 
              ? "You haven't booked any appointments yet" 
              : `No appointments with status "${statusFilter}"`}
          </p>
          <button
            onClick={() => window.location.href = '/patient/book-appointment'}
            className="btn-primary"
          >
            Book an Appointment
          </button>
        </div>
      )}
    </div>
  )
}

export default Appointments
