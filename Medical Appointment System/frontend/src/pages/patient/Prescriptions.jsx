import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Calendar, 
  User,
  Stethoscope,
  Pill
} from 'lucide-react'
import toast from 'react-hot-toast'

const Prescriptions = () => {
 const [prescriptions] = useState([
  {
    _id: 1,
    diagnosis: "Common Cold",
    advice: "Drink plenty of water and take rest.",
    createdAt: "2026-06-01",
    followUpDate: "2026-06-10",
    doctor: {
      user: {
        name: "Sarah Johnson"
      },
      specialization: "General Medicine"
    },
    medicines: [
      {
        name: "Paracetamol 500mg",
        dosage: "1 Tablet",
        frequency: "Twice Daily",
        duration: "5 Days",
        instructions: "After Food"
      }
    ],
    tests: ["CBC Test"]
  },
  {
    _id: 2,
    diagnosis: "Migraine",
    advice: "Avoid stress and sleep properly.",
    createdAt: "2026-06-03",
    followUpDate: "2026-06-15",
    doctor: {
      user: {
        name: "Michael Smith"
      },
      specialization: "Neurology"
    },
    medicines: [
      {
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "Once Daily",
        duration: "7 Days",
        instructions: "Take during headache"
      }
    ],
    tests: ["MRI Brain"]
  },
  {
    _id: 3,
    diagnosis: "Diabetes Type 2",
    advice: "Follow diabetic diet and walk daily.",
    createdAt: "2026-06-05",
    followUpDate: "2026-06-20",
    doctor: {
      user: {
        name: "Emily Brown"
      },
      specialization: "Endocrinology"
    },
    medicines: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice Daily",
        duration: "30 Days",
        instructions: "After meals"
      }
    ],
    tests: ["HbA1c", "Blood Sugar Test"]
  }
])

const [loading, setLoading] = useState(false)


  const handleDownloadPDF =  (prescriptionId) => {
    toast.success(`Prescription ${prescriptionId} downloaded`)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="text-gray-600 mt-1">View and download your prescriptions</p>
      </div>

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
                  {/* Doctor Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Dr. {prescription.doctor?.user?.name || 'Doctor'}
                      </h3>
                      <p className="text-primary-600 text-sm">{prescription.doctor?.specialization}</p>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Diagnosis</div>
                    <div className="text-gray-900">{prescription.diagnosis}</div>
                  </div>

                  {/* Medicines */}
                  {prescription.medicines && prescription.medicines.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Pill className="w-5 h-5 text-primary-600" />
                        <div className="font-semibold text-gray-900">Medicines</div>
                      </div>
                      <div className="space-y-2">
                        {prescription.medicines.map((med, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <div className="font-medium text-gray-900">{med.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {med.dosage} - {med.frequency} for {med.duration}
                            </div>
                            {med.instructions && (
                              <div className="text-sm text-gray-500 mt-1">
                                Instructions: {med.instructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tests */}
                  {prescription.tests && prescription.tests.length > 0 && (
                    <div>
                      <div className="font-semibold text-gray-900 mb-2">Recommended Tests</div>
                      <div className="flex flex-wrap gap-2">
                        {prescription.tests.map((test, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advice */}
                  {prescription.advice && (
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="font-semibold text-gray-900 mb-2">Doctor's Advice</div>
                      <div className="text-gray-700">{prescription.advice}</div>
                    </div>
                  )}

                  {/* Follow-up Date */}
                  {prescription.followUpDate && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Follow-up: {new Date(prescription.followUpDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <div className="flex lg:flex-col items-start lg:items-end space-x-4 lg:space-x-0 lg:space-y-3">
                  <button
                    onClick={() => handleDownloadPDF(prescription._id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <div className="text-sm text-gray-500">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Prescriptions Found</h3>
          <p className="text-gray-600">You don't have any prescriptions yet</p>
        </div>
      )}
    </div>
  )
}

export default Prescriptions
