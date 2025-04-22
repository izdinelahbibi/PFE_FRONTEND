import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import  Login  from './pages/Login'; 
import   Dashboard   from "./pages/InterfaceAdmin/Dashboard"; 
import   EmployeDashboard   from "./pages/InterfaceEmploye/EmployeDashboard"; 
import   ValidateurDashboard   from "./pages/InterfaceValidateur/ValidateurDashboard"; 
import   Validateur2Dashboard   from "./pages/InterfaceValidateur2/Validateur2Dashboard"; 




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/EmployeDashboard" element={<EmployeDashboard />} />
          <Route path="/ValidateurDashboard" element={<ValidateurDashboard />} />
          <Route path="/Validateur2Dashboard" element={<Validateur2Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
