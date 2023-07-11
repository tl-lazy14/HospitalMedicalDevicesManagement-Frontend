import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage/LoginPage';
import Homepage from './pages/Homepage'
import './App.css';
import { UserProvider } from "./components/userContext";
import ListDevicePage from "./pages/ListDevicePage/ListDevicePage";

const Dashboard = () => {
  return (
    <>
      <div style={{textAlign: "right", color: "black", width: "100%"}}><h1>Dashboard Page</h1></div>
    </>
  );
}

function App() {

  return (
    <>
      <div className="app">
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Homepage />} >
                  <Route index path="dashboard" element={<Dashboard />} />
                  <Route index path="list-device" element={<ListDevicePage />} />
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </div>
    </>
  );
}

export default App;
