import "./Header.css"
import { NavLink } from "react-router-dom"

const Header=()=>{
    return(<>
    <header>
        <div id="brand-name"><h1>Farmer Logistics Connector for Truck Sharing </h1></div>
        <div className="components">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
        </div>
    </header>
     
    </>)
}
export default Header