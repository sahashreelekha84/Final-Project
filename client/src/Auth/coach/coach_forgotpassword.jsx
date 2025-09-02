import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CoachForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
const navigate=useNavigate()

  const forgetPasswordMutation = useMutation({
    mutationFn: (data) =>
      axios.post("http://localhost:3005/api/coach/forgotpassword", data),
    onSuccess: (res) => {
      setMessage(
        res.data.message || "Password reset link sent to your email. Please check your inbox."
      );
       navigate(`/resetpassword/${res.data.token}`);
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || "Something went wrong.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    forgetPasswordMutation.mutate({ email });
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
        <h2 className="text-center mb-4">Forgot Password</h2>

        {message && (
          <div className="alert alert-info text-center">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Enter your email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-lg"
              style={{ backgroundColor: "#FFD700", color: "#000" }}
              disabled={forgetPasswordMutation.isLoading}
            >
              {forgetPasswordMutation.isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoachForgetPassword;
