import './App.css'
import {Routes,Route,useLocation} from "react-router-dom"
import Header from './Components/Header'
import Home from './Components/Home'
import Register from './Components/Register'
import Login from './Components/Login'
import UserLogin from './Components/UserLogin'
import AdminLogin from './Components/AdminLogin'
import User from './Components/User'
import Admin from './Components/Admin'
function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/woner", ];
  return (<>
      {!hideHeaderRoutes.includes(location.pathname) && <Header/>}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<Admin/> }/>
      <Route path="/user" element={ <User/>}/>
    </Routes> 
  </>
  )
}

export default App
