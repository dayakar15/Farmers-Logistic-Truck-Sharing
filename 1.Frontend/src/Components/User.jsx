import "./User.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AddTruckForm from "./AddTruckForm";

const User = () => {
  const username = localStorage.getItem("username");

  const [user, setUser] = useState(null);
  const [section, setSection] = useState("profile");

  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestedItems, setRequestedItems] = useState([]);

 
  const [marketDate, setMarketDate] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [availableSpace, setAvailableSpace] = useState("");

  
  const loadUser = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/userdetails/?username=${username}`
    );
    setUser(res.data.user);
  };

  const loadItems = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/trucks/?username=${username}`
    );
    setItems(res.data.items || []);
  };

  const loadMyItems = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/my-trucks/?username=${username}`
    );
    setMyItems(res.data.items || []);
  };

  const loadRequests = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/truck-requests/?username=${username}`
    );
    setRequests(res.data.requests || []);
  };

  const loadRequestedItems = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/my-transport-requests/?username=${username}`
    );
    setRequestedItems(res.data.items || []);
  };

  
  const addItem = async () => {
    if (!marketDate || !routeFrom || !routeTo || !availableSpace) {
      alert("All fields required");
      return;
    }

    await axios.post("http://127.0.0.1:8000/api/add-truck/", {
      username,
      market_date: marketDate,
      truck_number: truckNumber,
      route_from: routeFrom,
      route_to: routeTo,
      available_space: availableSpace,
    });

    alert("Truck details added");

    setMarketDate("");
    setTruckNumber("");
    setRouteFrom("");
    setRouteTo("");
    setAvailableSpace("");

    loadItems();
    loadMyItems();
  };

  
  const requestItem = async (truckId) => {
    await axios.post("http://127.0.0.1:8000/api/request-truck/", {
      username,
      truck_id: truckId,
    });
    alert("Request sent");
    loadRequestedItems();
  };

  const hasRequested = (truckId) =>
    requestedItems.some((r) => r.truck_id === truckId);

  
  const updateRequest = async (id, status) => {
    await axios.post("http://127.0.0.1:8000/api/update-truck-request/", {
      request_id: id,
      status,
    });
    loadRequests();
  };

  useEffect(() => {
    loadUser();
    loadItems();
    loadMyItems();
    loadRequests();
    loadRequestedItems();
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
        <div className="user-layout">
          <aside className="user-sidebar">
            <button className={section === "profile" ? "active" : ""} onClick={() => setSection("profile")}>My Profile</button>
            <button className={section === "add" ? "active" : ""} onClick={() => setSection("add")}>Add Truck</button>
            <button className={section === "items" ? "active" : ""} onClick={() => setSection("items")}>Browse Trucks</button>
            <button className={section === "myitems" ? "active" : ""} onClick={() => setSection("myitems")}>My Trucks</button>
            <button className={section === "requested" ? "active" : ""} onClick={() => setSection("requested")}>My Requests</button>
          </aside>

          <section className="user-content">

            
            {section === "profile" && user && (
              <div className="user-box">
                <h2>My Profile</h2>
                <table className="user-table">
                  <tbody>
                    <tr><th>Username</th><td>{user.username}</td></tr>
                    <tr><th>Email</th><td>{user.email}</td></tr>
                    <tr><th>Mobile</th><td>{user.mobile}</td></tr>
                    <tr><th>Address</th><td>{user.address}</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            
{section === "add" && (
              <AddTruckForm username={username} />
            )}

            
            {section === "items" && (
              <div className="user-box">
                <h2>Available Trucks</h2>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Route</th>
                      <th>Space</th>
                      <th>Owner</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((i, idx) => (
                      <tr key={idx}>
                        <td>{i.market_date}</td>
                        <td>{i.route_from} → {i.route_to}</td>
                        <td>{i.available_space} Qt</td>
                        <td>{i.username}</td>
                        <td>
                          <button
                            className="submit-btn"
                            disabled={hasRequested(i.id)}
                            onClick={() => requestItem(i.id)}
                          >
                            {hasRequested(i.id) ? "Requested" : "Request"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            
            {section === "requested" && (
              <div className="user-box">
                <h2>My Requests</h2>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestedItems.map((r, i) => (
                      <tr key={i}>
                        <td>{r.market_date}</td>
                        <td>{r.owner}</td>
                        <td>{r.status}</td>
                        <td>
                          {r.status === "approved"
                            ? <>📞 {r.owner_mobile}<br />📍 {r.owner_address}</>
                            : "Not Available"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            
            {section === "myitems" && (
              <div className="user-box">
                <h2>Transport Requests</h2>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Requester</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r, i) => (
                      <tr key={i}>
                        <td>{r.requester}</td>
                        <td>{r.status}</td>
                        <td>
                          {r.status === "pending" && (
                            <>
                              <button onClick={() => updateRequest(r.request_id, "approved")}>Approve</button>
                              <button onClick={() => updateRequest(r.request_id, "rejected")}>Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </section>
        </div>
      </main>

      <footer>
        <h4>&copy; 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default User;
