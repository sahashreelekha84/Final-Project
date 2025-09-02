import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useUserStore from '../../store/useUserStore'
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: (data) => axios.post("http://localhost:3005/api/login", data),
    onSuccess: (res) => {
      console.log(res.data.user);

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      // Redirect to dashboard or home page
      const username = res?.data?.user?.name;
      const role = res?.data?.user?.role;
      const userId = res?.data?._id;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res?.data?.user?.name);
      localStorage.setItem("userId", res?.data?.user?._id);
      useUserStore.getState().setUser({
        username,
        role,
        userId
      });
      navigate("/");
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || error.message);
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    mutation.mutate(formData);
  };

  return (
    <div
      className=" d-flex justify-content-center align-items-center vh-100"
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
        <h2 className="text-center mb-4">Login</h2>

        {message && <div className="alert alert-warning text-center">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-lg"
              style={{ backgroundColor: "#FFD700", color: "#000" }}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <small>
            Don't have an account? <a href="/signup" style={{ color: "#FFD700" }}>Sign Up</a>
          </small>

        </div>
        <div className="text-center mt-3">
          <small>
            If u are a coach then<a href="/coach/login" style={{ color: "#FFD700" }}>Login</a>
          </small>
        </div>
        <div className="text-right mt-3">
          <small>
            <a href="/client/forgetpassword" style={{ color: "#FFD700" }}>ForgetPassword</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
