import { useState } from "react";
import axios from "axios";

const AddTruckForm = ({ username, onSuccess }) => {
  const [form, setForm] = useState({
    market_date: "",
    truck_number: "",
    route_from: "",
    route_to: "",
    available_space: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/add-truck/", {
        username,
        ...form
      });
      alert("Truck added successfully!");
      setForm({ market_date: "", truck_number: "", route_from: "", route_to: "", available_space: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Error adding truck: " + (err.response?.data?.error || "Please check backend server"));
    }
  };

  return (
    <div className="user-box">
      <h2>Add Truck Details</h2>
      <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <input 
          type="date" 
          name="market_date" 
          value={form.market_date} 
          onChange={handleChange}
          required 
        />
        <input 
          type="text" 
          name="truck_number" 
          placeholder="Truck Number (optional)" 
          value={form.truck_number} 
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="route_from" 
          placeholder="Route From" 
          value={form.route_from} 
          onChange={handleChange}
          required 
        />
        <input 
          type="text" 
          name="route_to" 
          placeholder="Route To" 
          value={form.route_to} 
          onChange={handleChange}
          required 
        />
        <input 
          type="number" 
          name="available_space" 
          placeholder="Available Space (Quintals)" 
          value={form.available_space} 
          onChange={handleChange}
          min="0" step="0.01"
          required 
        />
        <button type="submit" className="submit-btn">Add Truck</button>
      </form>
    </div>
  );
};

export default AddTruckForm;
