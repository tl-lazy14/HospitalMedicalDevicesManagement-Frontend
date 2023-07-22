import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage/LoginPage';
import Homepage from './pages/Homepage'
import './App.css';
import { UserProvider } from "./components/userContext";
import ListDevicePage from "./pages/ListDevicePage/ListDevicePage";
import DetailDevicePage from "./pages/DetailDevicePage/DetailDevicePage";
import ListRequestUsagePage from "./pages/ListRequestUsagePage/ListRequestUsagePage";
import ListInfoUsage from "./pages/ListInfoUsagePage/ListInfoUsage";
import FaultRepairPage from "./pages/FaultRepairPage/FaultRepairPage";
import ListInfoMaintenance from "./pages/MaintenancePage/MaintenancePage";
import PurchaseRequestPage from "./pages/PurchaseRequestPage/PurchaseRequestPage";
import ListOperator from "./pages/ListOperator/ListOperator";
import RequestUsageOperatorPage from "./pages/RequestUsageOperator/RequestUsageOperator";
import FaultReportOperatorPage from "./pages/FaultReportOperator/FaultReportOperator";
import RequestPurchaseOperatorPage from "./pages/PurchaseRequestOperator/PurchaseRequestOperator";
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage";

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
                  <Route path="list-operator" element={<ListOperator />} />
                  <Route path="list-device" element={<ListDevicePage />} />
                  <Route path="device-info/:id" element={<DetailDevicePage />}  />
                  <Route path="list-usage-request" element={<ListRequestUsagePage />}  />
                  <Route path="usage-info" element={<ListInfoUsage />}  />
                  <Route path="fault-repair" element={<FaultRepairPage />}  />
                  <Route path="maintenance" element={<ListInfoMaintenance />}  />
                  <Route path="list-purchase-request" element={<PurchaseRequestPage />}  />
                  <Route path="operator/usage-request" element={<RequestUsageOperatorPage />}  />
                  <Route path="operator/fault-report" element={<FaultReportOperatorPage />}  />
                  <Route path="operator/purchase-request" element={<RequestPurchaseOperatorPage />}  />
                  <Route path="operator/change-password" element={<ChangePasswordPage />}  />
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </div>
    </>
  );
}

export default App;
