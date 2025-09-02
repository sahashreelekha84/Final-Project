import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const Coach_ResetPassword = () => {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const resetPasswordMutation = useMutation({
    mutationFn: (data) =>
      axios.post(`http://localhost:3005/api/coach/resendpassword/${token}`, data),
    onSuccess: () => {
      alert("Password reset successful! Please login.");
      navigate("/coach/login");
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || "Something went wrong.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!newPassword) {
      setMessage("Password cannot be empty");
      return;
    }

    // Only send password in body; token is in URL
    resetPasswordMutation.mutate({ password: newPassword });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #000000, #333333)",
        color: "#fff",
      }}
    >
      <div
        className="p-4 rounded"
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#1a1a1a",
          boxShadow: "0 0 20px #FFD700",
        }}
      >
        <h2 className="text-center mb-4">Reset Password</h2>
        {message && <div className="alert alert-warning text-center">{message}</div>}

        <form onSubmit={handleSubmit}>
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
              disabled={resetPasswordMutation.isLoading}
            >
              {resetPasswordMutation.isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Coach_ResetPassword;
