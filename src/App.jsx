import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ChatBot from './pages/ChatBot';
import Map from './pages/Map';
import PitchGenerator from './pages/PitchGenerator';

function App() {
  return (
    <Router>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/map" element={<Map />} />
            <Route path="/pitch" element={<PitchGenerator />} />
          </Routes>
    </Router>
  )
}

export default App
