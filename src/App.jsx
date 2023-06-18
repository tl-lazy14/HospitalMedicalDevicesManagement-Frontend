import {BrowserRouter as Router, Routes, Route, useLocation, useNavigate} from "react-router-dom";
import { useEffect } from "react";
import LoginPage from './pages/LoginPage/LoginPage';
import './App.css';

const DefaultRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === '/') navigate('/login');
  }, [location, navigate]);
}

function App() {
  return (
    <>
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<DefaultRedirect />} />
            <Route path="/login" element={<LoginPage />} /> 
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
