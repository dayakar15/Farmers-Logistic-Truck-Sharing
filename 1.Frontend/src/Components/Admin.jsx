import "./Admin.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  
  const loadUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("User load error", err);
    }
  };

  
  const approveUser = async (username) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/approve/", { username });
      alert("User approved successfully");
      loadUsers();
    } catch (err) {
      console.error("Approve error", err);
    }
  };

  
  const loadAllRequests = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/all-requests/"
      );
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Requests load error", err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadAllRequests();
  }, []);

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Farmer Logistics Connector for Truck Sharing</h1>
        </div>
        <div className="components">
          <NavLink to="/">Home</NavLink>
          <button onClick={() => {
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            window.location.href = "/";
          }} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline'}}>Logout</button>
        </div>
      </header>

      <main>
        <div className="adminPage-layout">

          
          <aside className="adminPage-sidebar">
            <button
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </button>

            <button
              className={activeSection === "users" ? "active" : ""}
              onClick={() => setActiveSection("users")}
            >
              Approve Users
            </button>

            <button
              className={activeSection === "requests" ? "active" : ""}
              onClick={() => setActiveSection("requests")}
            >
              View All Requests
            </button>
          </aside>

          
          <section className="adminPage-content">

            
            {activeSection === "dashboard" && (
              <>
                <h2>Admin Dashboard</h2>
                <div className="adminPage-cards">
                  <div className="adminPage-card">
                    <h3>Total Users</h3>
                    <p>{users.length}</p>
                  </div>

                  <div className="adminPage-card">
                    <h3>Total Requests</h3>
                    <p>{requests.length}</p>
                  </div>
                </div>
              </>
            )}

           
            {activeSection === "users" && (
              <>
                <h2>User Approvals</h2>

                <table className="adminPage-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Approved</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.mobile}</td>
                        <td>{u.approved === 1 ? "Approved" : "Pending"}</td>
                        <td>
                          {u.approved === 0 ? (
                            <button
                              className="adminPage-approveBtn"
                              onClick={() => approveUser(u.username)}
                            >
                              Approve
                            </button>
                          ) : (
                            "Approved"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

           
            {activeSection === "requests" && (
              <>
                <h2>All User Requests</h2>

                <table className="adminPage-table">
                  <thead>
                    <tr>
                      <th>Requester</th>
                      <th>Truck Owner</th>
                      <th>Route</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map((r, i) => (
                      <tr key={i}>
                        <td>{r.requester}</td>
                        <td>{r.owner}</td>
                        <td>{r.route_from} → {r.route_to}</td>
                        <td>{r.market_date}</td>
                        <td>{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

          </section>
        </div>
      </main>

      <footer>
        <h4>© 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default Admin;
