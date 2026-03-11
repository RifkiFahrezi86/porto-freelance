import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Certificates from './components/Certificates'
import Services from './components/Services'
import Projects from './components/Projects'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-dark text-slate-200">
      <Navbar />
      <Hero />
      <Experience />
      <Services />
      <Certificates />
      <Projects />
      <Footer />
    </div>
  )
}

export default App
