import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Video
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import { Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const DoctorHome = () => {
  const [stats, setStats] = useState({
  totalPatients: 250,
  todayAppointments: 35,
  pendingAppointments: 12,
  revenue: 450000
})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes] = await Promise.all([
        axios.get('/api/appointments')
      ])

      const appointments = appointmentsRes.data.appointments

setStats({
  totalPatients: 250,
  todayAppointments: 35,
  pendingAppointments: 12,
  revenue: 450000
});
    

      // setTodayAppointments(todayApts)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Patients',
      value: stats.totalPatients,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Clock,
      label: 'Pending Requests',
      value: stats.pendingAppointments,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]

const weeklyPatientsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Patients',
      data: [22, 28, 25, 35, 40, 38, 30],
      borderColor: '#3B82F6',
      backgroundColor: '#93C5FD',
      tension: 0.4
    }
  ]
}


const appointmentPieData = {
  labels: ['Completed', 'Pending', 'Cancelled'],
  datasets: [
    {
      data: [45, 20, 10],
      backgroundColor: [
        '#10B981',
        '#F59E0B',
        '#EF4444'
      ]
    }
  ]
}
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 hover:shadow-xl transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
      {/* Charts */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  <div className="glass-card p-6">
    <h2 className="text-xl font-bold mb-4">
      Patients Last 7 Days
    </h2>

    <Line data={weeklyPatientsData} />
  </div>

  <div className="glass-card p-6">
  <h2 className="text-xl font-bold mb-4">
    Appointment Status
  </h2>

  <div className="h-64 w-64 mx-auto">
    <Pie
      data={appointmentPieData}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }}
    />
  </div>
</div>
  </div>
</div>
)
}


export default DoctorHome
