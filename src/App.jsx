import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage/LoginPage';
import Homepage from './pages/Homepage/Homepage'
import './App.css';
import { UserProvider } from "./components/userContext";

function App() {

  return (
    <>
      <div className="app">
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Router>
        </UserProvider>
      </div>
    </>
  );
}

export default App;
