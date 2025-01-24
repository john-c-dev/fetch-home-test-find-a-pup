import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SearchPage from './components/SearchPage'
import './App.css'

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/search" element={<SearchPage/>} />
      </Routes>
    </Router>
  )
}
