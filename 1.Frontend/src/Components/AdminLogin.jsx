import "./AdminLogin.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        data
      );

      if (res.data.error?.includes("not approved")) {
        setMsgType("error");
        setMessage("Awaiting Admin approval");
        return;
      }

      if (res.data.role === "admin") {
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", "admin");
        navigate("/admin");
        return;
      }

      setMsgType("error");
      setMessage("User credentials detected. Please use User Login.");

    } catch (err) {
      setMsgType("error");
      setMessage("Invalid username or password");
    }
  };

  return (
    <>
      <main>
        <h2 id="log-h2">Admin Login</h2>
        <div className="error-msg">
          {message && (
            <p className={`msg ${msgType}`} style={{textAlign:"center"}}>
              {message}
            </p>
          )}
        </div>
       
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label>Username:</label>
            <input 
              type="text"
              name="username"
              placeholder="Enter admin username"
              autoFocus
              onChange={(e) =>
                setData({ ...data, username: e.target.value })
              }
              required
            />
          </div>

          <div className="row">
            <label>Password:</label>
            <input 
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" id="log-btn">
            Admin Login
          </button>
          <p style={{textAlign: 'center', marginTop: '10px'}}>
            User? <a href="/user-login">User Login</a>
          </p>
        </form>
      </main>

      <footer>
        <h4>&copy; 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default AdminLogin;

