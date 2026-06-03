import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Lightbulb, AlertTriangle, TrendingUp, Activity, Sparkles } from 'lucide-react'

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('diagnosis')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setResult({
        diagnosis: 'Based on symptoms and patient history, the most likely diagnosis is Migraine with aura. Consider differential diagnosis of tension headache and cluster headache.',
        treatment: [
          'Prescribe acute migraine medication (triptans)',
          'Recommend lifestyle modifications',
          'Consider preventive therapy if frequency > 4 attacks/month',
          'Advise keeping headache diary'
        ],
        riskFactors: [
          'Family history of migraines',
          'Stress levels',
          'Sleep patterns',
          'Dietary triggers'
        ],
        confidence: 87
      })
      setAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">AI Assistant</h1>
        <p className="text-slate-400">Get AI-powered diagnosis suggestions and treatment recommendations</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 border-b border-slate-700"
      >
        {[
          { id: 'diagnosis', label: 'Diagnosis Suggestion', icon: Brain },
          { id: 'treatment', label: 'Treatment Recommendations', icon: Lightbulb },
          { id: 'risk', label: 'Risk Detection', icon: AlertTriangle }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Diagnosis Suggestion */}
      {activeTab === 'diagnosis' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Diagnosis Suggestion
            </h3>
            
            {!result ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Patient Symptoms</label>
                  <textarea
                    rows="4"
                    placeholder="Enter patient symptoms..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Patient History</label>
                  <textarea
                    rows="3"
                    placeholder="Enter relevant medical history..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full py-3 px-4 gradient-primary rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <Activity className="w-5 h-5 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get AI Diagnosis
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">AI Confidence Score</p>
                    <p className="text-2xl font-bold text-white">{result.confidence}%</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">Suggested Diagnosis</h4>
                  <p className="text-slate-300">{result.diagnosis}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Recommended Treatment</h4>
                  <ul className="space-y-2">
                    {result.treatment.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Risk Factors</h4>
                  <ul className="space-y-2">
                    {result.riskFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="w-full py-3 px-4 bg-slate-800/50 border border-slate-700 rounded-lg font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  New Analysis
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Treatment Recommendations */}
      {activeTab === 'treatment' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Treatment Recommendations
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Diagnosis</label>
              <textarea
                rows="3"
                placeholder="Enter confirmed diagnosis..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Patient Details</label>
              <textarea
                rows="3"
                placeholder="Enter patient age, gender, allergies..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400"
              />
            </div>
            <button className="w-full py-3 px-4 gradient-primary rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Get Treatment Recommendations
            </button>
          </div>
        </motion.div>
      )}

      {/* Risk Detection */}
      {activeTab === 'risk' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Risk Detection
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Patient Symptoms & History</label>
              <textarea
                rows="4"
                placeholder="Enter comprehensive patient information..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400"
              />
            </div>
            <button className="w-full py-3 px-4 gradient-primary rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analyze Risks
            </button>
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="glass rounded-2xl p-6 border-l-4 border-yellow-500">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white mb-1">AI Disclaimer</h3>
            <p className="text-sm text-slate-400">
              This AI assistant provides suggestions based on medical knowledge but should not replace professional clinical judgment. 
              Always verify AI recommendations with your expertise and consider individual patient factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
