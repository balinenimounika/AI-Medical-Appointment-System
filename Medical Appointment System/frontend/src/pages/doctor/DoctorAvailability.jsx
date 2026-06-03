import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, Clock, Plus, Trash2, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState([
    { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: false },
    { day: 'Sunday', startTime: '10:00', endTime: '14:00', isAvailable: false },
  ])

  const [unavailableDates, setUnavailableDates] = useState([])
  const [newUnavailableDate, setNewUnavailableDate] = useState({ date: '', reason: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      const response = await axios.get('/api/doctors/profile')
      if (response.data.doctor) {
        const doctor = response.data.doctor
        if (doctor.availability && doctor.availability.length > 0) {
          setAvailability(doctor.availability)
        }
        if (doctor.unavailableDates) {
          setUnavailableDates(doctor.unavailableDates.map(d => ({
            date: new Date(d).toISOString().split('T')[0],
            reason: 'Unavailable'
          })))
        }
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    }
  }

  const updateAvailability = (index, field, value) => {
    const newAvailability = [...availability]
    newAvailability[index][field] = value
    setAvailability(newAvailability)
  }

  const toggleAvailability = (index) => {
    const newAvailability = [...availability]
    newAvailability[index].isAvailable = !newAvailability[index].isAvailable
    setAvailability(newAvailability)
  }

  const addUnavailableDate = () => {
    if (newUnavailableDate.date) {
      setUnavailableDates([
        ...unavailableDates,
        { id: Date.now(), ...newUnavailableDate }
      ])
      setNewUnavailableDate({ date: '', reason: '' })
    }
  }

  const removeUnavailableDate = (id) => {
    setUnavailableDates(unavailableDates.filter(date => date.id !== id))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const unavailableDatesArray = unavailableDates.map(d => new Date(d.date))
      await axios.put('/api/doctors/availability', {
        availability,
        unavailableDates: unavailableDatesArray
      })
      toast.success('Availability updated successfully')
    } catch (error) {
      toast.error('Failed to update availability')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
        <p className="text-gray-600 mt-1">Set your working hours and manage unavailable dates</p>
      </div>

      {/* Weekly Schedule */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Weekly Schedule
          </h3>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-4">
          {availability.map((item, index) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                item.isAvailable
                  ? 'bg-white border-gray-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 w-28">{item.day}</span>
                  <button
                    onClick={() => toggleAvailability(index)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      item.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </div>
              </div>

              {item.isAvailable && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={item.startTime}
                      onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={item.endTime}
                      onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Unavailable Dates */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" />
          Unavailable Dates
        </h3>

        {/* Add New Unavailable Date */}
        <div className="p-4 bg-gray-50 rounded-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newUnavailableDate.date}
                onChange={(e) => setNewUnavailableDate({ ...newUnavailableDate, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
              <input
                type="text"
                value={newUnavailableDate.reason}
                onChange={(e) => setNewUnavailableDate({ ...newUnavailableDate, reason: e.target.value })}
                placeholder="e.g., Personal leave, Conference"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={addUnavailableDate}
            className="mt-4 btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Unavailable Date
          </button>
        </div>

        {/* List of Unavailable Dates */}
        {unavailableDates.length > 0 && (
          <div className="space-y-3">
            {unavailableDates.map((date, index) => (
              <motion.div
                key={date.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200"
              >
                <div>
                  <p className="font-semibold text-gray-900">{date.date}</p>
                  {date.reason && <p className="text-sm text-gray-600">{date.reason}</p>}
                </div>
                <button
                  onClick={() => removeUnavailableDate(date.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAvailability
