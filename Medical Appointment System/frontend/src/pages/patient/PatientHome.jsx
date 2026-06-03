import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  FileText, 
  Activity, 
  Clock,
  TrendingUp,
  Bell,
  Plus,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const PatientHome = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: 9,
    totalAppointments: 34,
    prescriptions: 9,
    reports: 10
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState([
  {
    _id: '1',
    doctor: { user: { name: 'John Smith' } },
    date: '2026-06-10',
    timeSlot: '10:00 AM',
    status: 'confirmed'
  },
  {
    _id: '2',
    doctor: { user: { name: 'Sarah Wilson' } },
    date: '2026-06-12',
    timeSlot: '02:30 PM',
    status: 'confirmed'
  },
  {
    _id: '3',
    doctor: { user: { name: 'Michael Brown' } },
    date: '2026-06-15',
    timeSlot: '11:00 AM',
    status: 'pending'
  },
  {
    _id: '4',
    doctor: { user: { name: 'Emily Davis' } },
    date: '2026-06-18',
    timeSlot: '09:30 AM',
    status: 'confirmed'
  },
  {
    _id: '5',
    doctor: { user: { name: 'Robert Taylor' } },
    date: '2026-06-20',
    timeSlot: '04:00 PM',
    status: 'confirmed'
  },
  {
    _id: '6',
    doctor: { user: { name: 'Jessica Clark' } },
    date: '2026-06-22',
    timeSlot: '01:15 PM',
    status: 'confirmed'
  },
  {
    _id: '7',
    doctor: { user: { name: 'Daniel White' } },
    date: '2026-06-24',
    timeSlot: '03:00 PM',
    status: 'confirmed'
  },
  {
    _id: '8',
    doctor: { user: { name: 'Sophia Martin' } },
    date: '2026-06-26',
    timeSlot: '10:45 AM',
    status: 'confirmed'
  },
  {
    _id: '9',
    doctor: { user: { name: 'William Lee' } },
    date: '2026-06-28',
    timeSlot: '05:00 PM',
    status: 'pending'
  }
])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  //useEffect(() => {
  //  //fetchDashboardData()
  //}, [])

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, notificationsRes] = await Promise.all([
        axios.get('/api/appointments'),
        axios.get('/api/notifications')
      ])

      const appointments = appointmentsRes.data.appointments
      const upcoming = appointments.filter(
        apt => apt.status === 'confirmed' && new Date(apt.date) >= new Date()
      )

      setStats({
        upcomingAppointments: upcoming.length,
        totalAppointments: appointments.length,
        prescriptions: appointments.filter(apt => apt.prescription).length,
        reports: 0 // Will be updated when reports API is called
      })

      setUpcomingAppointments(upcoming.slice(0, 9))
      setNotifications(notificationsRes.data.notifications.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: Calendar,
      label: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Activity,
      label: 'Total Appointments',
      value: stats.totalAppointments,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: FileText,
      label: 'Prescriptions',
      value: stats.prescriptions,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      label: 'Medical Reports',
      value: stats.reports,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
<div className="h-72 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex flex-col items-center justify-center mb-8">
  <h1 className="text-5xl font-bold text-white">
    Welcome Back 👋
  </h1>

  <p className="text-white text-lg mt-4">
    Your Complete Healthcare Dashboard
  </p>
</div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="
            bg-gradient-to-r    
          from-blue-600
          to-cyan-500
          rounded-3xl
          p-8
          text-white
          shadow-xl
          hover:scale-105
          transition-all
          cursor-pointer"
          >
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <stat.icon className="w-7 h-7 text-white" />
            </div>
            <div className="text-5xl font-bold">
              {stat.value}
            </div>

            <div className="text-white/90 text-sm mt-2">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

    

      {/* Upcoming Appointments */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
          <Link to="/patient/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Dr. {appointment.doctor?.user?.name || 'Doctor'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No upcoming appointments</p>
            <Link to="/patient/book-appointment" className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
              Book your first appointment
            </Link>
          </div>
        )}
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-xl ${notification.isRead ? 'bg-gray-50' : 'bg-primary-50'}`}
              >
                <div className="font-semibold text-gray-900">{notification.title}</div>
                <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientHome
