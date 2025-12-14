import {Routes,Route,Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminForm from './pages/AdminForm';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App(){
    const {token}=useContext(AuthContext);
    return(
        <Routes>
            <Route path="/" element={token?<Navigate to="/dashboard"/>:<Login/>}/>
            <Route path="/register" element={token?<Navigate to="/dashboard"/>:<Register/>}/>
            <Route path="/dashboard" element={token?<Dashboard/>:<Navigate to="/"/>}/>
            
            <Route path="/admin/add" element={token?<AdminForm/>:<Navigate to="/"/>}/>
            <Route path="/admin/edit/:id" element={token?<AdminForm/>:<Navigate to="/"/>}/>
        </Routes>
    );
}

export default App;