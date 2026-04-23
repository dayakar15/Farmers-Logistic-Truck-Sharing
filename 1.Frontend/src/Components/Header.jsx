import "./Header.css"
import { NavLink, useNavigate } from "react-router-dom"

const Header=()=>{
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/");
    };

    return(<>
    <header>
        <div id="brand-name"><h1>Farmer Logistics Connector for Truck Sharing </h1></div>
        <div className="components">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/register">Register</NavLink>
            {role ? (
                <>
                    {role === "user" && <NavLink to="/user">Dashboard ({username})</NavLink>}
                    {role === "admin" && <NavLink to="/admin">Admin Panel ({username})</NavLink>}
                    <button onClick={handleLogout} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline'}}>Logout</button>
                </>
            ) : (
                <>
                    <NavLink to="/user-login">User Login</NavLink>
                    <NavLink to="/admin-login">Admin Login</NavLink>
                </>
            )}
        </div>
    </header>
    </>)
}
export default Header
