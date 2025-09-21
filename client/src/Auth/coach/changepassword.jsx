import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const CoachSetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const setPasswordMutation = useMutation({
    mutationFn: (data) =>
      axios.post(
        "http://localhost:3005/api/set-password",
        data,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      ),
    onSuccess: () => {
      alert("Password updated successfully!");
      navigate("/coach/dashboard");
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || error.message);
    },
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword) {
      setMessage("Password cannot be empty");
      return;
    }
    setPasswordMutation.mutate({ password: newPassword });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #000000, #333333)", color: "#fff" }}
    >
      <div
        className="p-4 rounded mx-auto"
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#1a1a1a",
          boxShadow: "0 0 20px #FFD700",
          color: "#fff",
          marginTop: "3rem",
        }}
      >
        <h2 className="text-center mb-4">Set New Password</h2>
        {message && <div className="alert alert-warning text-center">{message}</div>}

        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-lg"
              style={{ backgroundColor: "#FFD700", color: "#000" }}
              disabled={setPasswordMutation.isLoading}
            >
              {setPasswordMutation.isLoading ? "Updating..." : "Set Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoachSetPassword;
