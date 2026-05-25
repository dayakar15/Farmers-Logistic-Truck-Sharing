import "./Login.css";
import axios from "axios";
import { useState} from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
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

      if (res.data.role === "user") {
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", "user");
        navigate("/user");
        return;
      }

      setMsgType("error");
      setMessage("Invalid Credentials");

    } catch (err) {
      setMsgType("error");
      setMessage("Invalid username or password");
    }
  };

  return (
    <>
      <main>
        <h2 id="log-h2">Login</h2>
        <div className="error-msg">
          {message && (
            <p className={`msg ${msgType}`} style={{textAlign:"center"}}>
              {message}
            </p>
          )}
        </div>
       
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label>Full Name:</label>
            <input 
              type="text"
              name="username"
              placeholder="Enter full name"
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
            Submit
          </button>
        </form>
      </main>

      <footer>
        <h4>&copy; 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default Login;
