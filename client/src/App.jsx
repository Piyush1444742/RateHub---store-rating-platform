import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "./css/App.css";
import Register from "./pages/Register";

import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}/>
                <Route path="/user" element={<UserDashboard />}/>
                <Route path="/" element={<Navigate to="/login" replace />}/>
                <Route path="/owner" element={<OwnerDashboard />}/>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;