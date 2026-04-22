import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import Login from './Pages/Login/Login.jsx'
import DasboardCeiba from './Pages/DashBoard/Ceiba/DasboardCeiba.jsx'
import DasboardPragma from './Pages/DashBoard/Pragma/DashboardPragma.jsx'
import CeibaForm from './Pages/Forms/CeibaFroms/CeibaSaludColetiva/CeibaForm.jsx'
import EnregaCeiba from './Pages/Deliveries/CeibaEntregas/EntregaCeiba.jsx'  
import { AuthProvider } from './Context/authContext.jsx'
import PrivateRoute from './Context/PrivateLayouts.jsx'
import PrivateFormRoute from './Context/PrivateFormRoute.jsx'
import CeibaFormV from './Pages/Forms/CeibaFroms/CeibaSaludVida/CeibaFormV.jsx';
import Notfound from './Pages/Notfound/Notfound.jsx'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
            <Route 
            path="/finForm" 
            element={
              <PrivateFormRoute requiredState="flow">
                <EnregaCeiba />
              </PrivateFormRoute>
            } 
          />

          <Route path="/dashboardCba" element={
            <PrivateRoute>
              <DasboardCeiba />
            </PrivateRoute>
          } />
          <Route path="/dashboardPra" element={
            <PrivateRoute>
              <DasboardPragma />
            </PrivateRoute>
          } />
          <Route path="/dashboardCba/saludColectiva" element={
            <PrivateRoute>
              <CeibaForm />
            </PrivateRoute>
          } />
          <Route path='/dashboardCba/saludVida' element={
            <PrivateRoute>
              <CeibaFormV />
            </PrivateRoute>
          } />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App
