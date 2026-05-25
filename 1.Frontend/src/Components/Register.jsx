
import "./Register.css";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const [form, setForm] = useState({
  username: "",  
  email: "",
  password: "",
  confirm_password: "",
  mobile: "",
  address: "",
});


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://127.0.0.1:8000/api/register/", form);

    if (res.data.error) {
      setMsgType("error");
      setMessage(res.data.error);
    } else {
      setMsgType("success");
      setMessage(res.data.success);
    }
  };

  return (
    <>
    <main>
        <div className="register-container">

          <div className="register-header">
            <h1>Create Your Account</h1>
            <p>Welcome! Please fill in the details.</p>
          </div>

          {message && <p className={`msg ${msgType}`}>{message}</p>}

          <form onSubmit={handleSubmit}>
            
            <div className="row">
              <label>Full Name:</label>
              <input 
                type="text"
                name="username"
                placeholder="Enter full name"
                autoFocus
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <label>Email Address:</label>
              <input 
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <label>Password:</label>
              <input 
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <label>Confirm Password:</label>
              <input 
                type="password"
                name="confirm_password"
                placeholder="Re-enter password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <label>Mobile Number:</label>
              <input 
                type="tel"
                name="mobile"
                inputMode="numeric" 
                  maxLength="10"
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits"
                placeholder="Enter mobile number"
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <label>Address:</label>
              <input 
                type="text"
                name="address"
                placeholder="Enter full address"
                onChange={handleChange}
                required
              />
            </div>

          

            <button type="submit" className="register-btn">Register</button>
          </form>
        </div>
      
      </main>
      <footer>
             <h4>&copy; 2026 All Rights Reserved SAK Informatics</h4>
        </footer>
    </>
  );
};

export default Register;
