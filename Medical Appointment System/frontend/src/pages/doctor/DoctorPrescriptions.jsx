import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Plus, 
  Download, 
  Calendar,
  User,
  Pill
} from 'lucide-react'
import toast from 'react-hot-toast'

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState('')
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    tests: [],
    advice: '',
    followUpDate: ''
  })
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
  setLoading(true)
  try {
    const [prescriptionsRes, appointmentsRes] = await Promise.all([
      axios.get('/api/prescriptions'),
      axios.get('/api/appointments')
    ])

    setPrescriptions(prescriptionsRes.data.prescriptions)

    const allAppointments = appointmentsRes.data.appointments || []

    console.log('Appointments:', allAppointments)

    setAppointments(allAppointments)

} catch (error) {
  toast.error('Failed to fetch data')
} finally {
  setLoading(false)
}
}

const handleAddMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    })
  }

  const handleRemoveMedicine = (index) => {
    const newMedicines = prescriptionData.medicines.filter((_, i) => i !== index)
    setPrescriptionData({ ...prescriptionData, medicines: newMedicines })
  }

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...prescriptionData.medicines]
    newMedicines[index][field] = value
    setPrescriptionData({ ...prescriptionData, medicines: newMedicines })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post('/api/prescriptions', {
  ...(selectedAppointment && { appointment: selectedAppointment }),
  ...prescriptionData
})
     
      toast.success('Prescription created successfully')
      setModalOpen(false)
      setPrescriptionData({
        diagnosis: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
        tests: [],
        advice: '',
        followUpDate: ''
      })
      fetchData()
    } catch (error) {
      toast.error('Failed to create prescription')
    }
  }

  const handleDownloadPDF = async (prescriptionId) => {
    try {
      const response = await axios.get(`/api/prescriptions/${prescriptionId}/pdf`)
      if (response.data.pdfUrl) {
        window.open(`http://localhost:5000${response.data.pdfUrl}`, '_blank')
      }
    } catch (error) {
      toast.error('Failed to download PDF')
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
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-1">Create and manage prescriptions</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Prescription</span>
        </button>
      </div>

      {/* Prescriptions List */}
      {prescriptions.length > 0 ? (
        <div className="space-y-4">
          {prescriptions.map((prescription, index) => (
            <motion.div
              key={prescription._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {prescription.patient?.user?.name || 'Patient'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Diagnosis</div>
                    <div className="text-gray-900">{prescription.diagnosis}</div>
                  </div>

                  {prescription.medicines && prescription.medicines.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Pill className="w-5 h-5 text-primary-600" />
                        <div className="font-semibold text-gray-900">Medicines</div>
                      </div>
                      <div className="space-y-2">
                        {prescription.medicines.map((med, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 text-sm">
                            <div className="font-medium">{med.name}</div>
                            <div className="text-gray-600">{med.dosage} - {med.frequency} for {med.duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDownloadPDF(prescription._id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Prescriptions Found</h3>
          <p className="text-gray-600 mb-6">Create your first prescription</p>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary"
          >
            Create Prescription
          </button>
        </div>
      )}

      {/* New Prescription Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl my-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Prescription</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Select Appointment (optional)
  </label>

  {appointments.length === 0 && (
    <p className="text-red-500 text-sm mb-2">
      No appointments found.
    </p>
  )}

  <select
    value={selectedAppointment || ''}
    onChange={(e) => setSelectedAppointment(e.target.value)}
    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  >
    <option value="">Select an appointment</option>

    {appointments.map((apt) => (
      <option key={apt._id} value={apt._id}>
        {apt.patient?.user?.name || 'Patient'} - {' '}
        {new Date(apt.date).toLocaleDateString()} {' '}
        {apt.timeSlot}
      </option>
    ))}
  </select>
</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis *
                </label>
                <textarea
                  value={prescriptionData.diagnosis}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Medicines
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Medicine
                  </button>
                </div>
                {prescriptionData.medicines.map((med, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 mb-3">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                       type="text"
                        placeholder="Dosage (e.g., 500mg)"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Frequency (e.g., Twice daily)"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 7 days)"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Instructions (optional)"
                      value={med.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
                    />
                    {prescriptionData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advice
                </label>
                <textarea
                  value={prescriptionData.advice}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, advice: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="General advice for the patient"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={prescriptionData.followUpDate}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, followUpDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create Prescription
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default DoctorPrescriptions
