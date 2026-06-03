import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sun, Moon } from 'lucide-react'
import { 
  Stethoscope, 
  Calendar, 
  Video, 
  FileText, 
  BrainCircuit,
  Heart,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const LandingPage = () => {
const { isDarkMode, toggleTheme } = useAuth()
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white transition-all duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-white">MediCare AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-white hover:text-primary-600 transition">About</a>
              <a href="#services" className="text-white hover:text-primary-600 transition">Services</a>
              <a href="#contact" className="text-white hover:text-primary-600 transition">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-gray-800" /> : <Moon className="w-5 h-5 text-gray-800" />}
              </button>

              <Link to="/login" className="text-white hover:text-primary-600 font-medium transition">
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900 dark:via-slate-900 dark:to-secondary-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                AI-Powered Healthcare
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  {' '}Made Simple
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Book appointments, consult doctors, and get AI-powered health recommendations - all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-primary text-center">
                  Get Started Free
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </Link>
                <Link to="/login" className="btn-secondary text-center">
                  Sign In
                </Link>
              </div>
              <div className="mt-12 flex items-center space-x-8">
  <div>
    <div className="text-3xl font-bold text-white">10K+</div>
    <div className="text-white">Patients</div>
  </div>

  <div>
    <div className="text-3xl font-bold text-white">500+</div>
    <div className="text-white">Doctors</div>
  </div>

  <div>
    <div className="text-3xl font-bold text-white">98%</div>
    <div className="text-white">Satisfaction</div>
  </div>
</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="glass-card p-8 rounded-3xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-100 rounded-2xl p-6">
                    <Stethoscope className="w-12 h-12 text-primary-600 mb-4" />
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-gray-600">Support</div>
                  </div>
                  <div className="bg-secondary-100 rounded-2xl p-6">
                    <BrainCircuit className="w-12 h-12 text-secondary-600 mb-4" />
                    <div className="text-2xl font-bold text-gray-900">AI</div>
                    <div className="text-gray-600">Assistant</div>
                  </div>
                  <div className="bg-blue-100 rounded-2xl p-6">
                    <Calendar className="w-12 h-12 text-blue-600 mb-4" />
                    <div className="text-2xl font-bold text-gray-900">Easy</div>
                    <div className="text-gray-600">Booking</div>
                  </div>
                  <div className="bg-purple-100 rounded-2xl p-6">
                    <Video className="w-12 h-12 text-purple-600 mb-4" />
                    <div className="text-2xl font-bold text-gray-900">Video</div>
                    <div className="text-gray-600">Consult</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with compassionate healthcare to provide you with the best medical experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BrainCircuit className="w-12 h-12 text-primary-600" />,
                title: 'AI-Powered Diagnosis',
                description: 'Our AI assistant helps you understand symptoms and find the right specialist.'
              },
              {
                icon: <Shield className="w-12 h-12 text-secondary-600" />,
                title: 'Secure & Private',
                description: 'Your health data is encrypted and protected with enterprise-grade security.'
              },
              {
                icon: <Clock className="w-12 h-12 text-blue-600" />,
                title: 'Instant Appointments',
                description: 'Book appointments in seconds with real-time availability tracking.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 hover:shadow-2xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions tailored to your needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Calendar className="w-8 h-8" />,
                title: 'Appointment Booking',
                description: 'Book appointments with top specialists instantly'
              },
              {
                icon: <Video className="w-8 h-8" />,
                title: 'Video Consultations',
                description: 'Connect with doctors from anywhere'
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: 'Digital Prescriptions',
                description: 'Access prescriptions anytime, anywhere'
              },
              {
                icon: <BrainCircuit className="w-8 h-8" />,
                title: 'AI Health Assistant',
                description: 'Get instant health guidance from AI'
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-xl text-gray-600 mb-8">
                Have questions? We're here to help you 24/7.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">support@medicare.ai</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-600">123 Healthcare Ave, Medical City</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="How can we help?"
                  ></textarea>
                </div>
                <button type="submit" className="w-full btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-8 h-8 text-primary-400" />
                <span className="text-xl font-bold">MediCare AI</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing healthcare with AI-powered solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Services</a></li>
                <li><a href="#" className="hover:text-white transition">Doctors</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Appointments</a></li>
                <li><a href="#" className="hover:text-white transition">Video Consult</a></li>
                <li><a href="#" className="hover:text-white transition">AI Assistant</a></li>
                <li><a href="#" className="hover:text-white transition">Prescriptions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MediCare AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
