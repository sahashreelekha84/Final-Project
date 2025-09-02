import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const ClientSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    fitnessInterests: [],
    subscriptionPlan: "",
    captureCode: "",
  });

  const [step, setStep] = useState("signup");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [captcha, setCaptcha] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const mutation = useMutation({
    mutationFn: (newClient) =>
      axios.post("http://localhost:3005/api/register", newClient),
    onSuccess: () => setStep("verify"),
    onError: (error) => setMessage(error.response?.data?.message || error.message),
  });

  const handleChange = (e) => {
    const { name, value, options, type } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(options).filter((opt) => opt.selected).map((opt) => opt.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.fitnessInterests.length === 0) newErrors.fitnessInterests = "Select at least one interest";
    if (!formData.subscriptionPlan) newErrors.subscriptionPlan = "Select a subscription plan";
    if (!formData.captureCode.trim()) newErrors.captureCode = "CAPTCHA code is required";
    else if (formData.captureCode.trim().toUpperCase() !== captcha) newErrors.captureCode = "CAPTCHA does not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(formData);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setMessage("Enter OTP code");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3005/api/verifyemail", { email: formData.email, otp });
      setMessage(res.data.message);
      setLoading(false);
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const res = await axios.post("http://localhost:3005/api/resendotp", { email: formData.email });
      setMessage(res.data.message);
      setResendLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setResendLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 p-3" style={{ background: "linear-gradient(135deg, #000000, #333333)", color: "#fff" }}>
        <div className="p-4 rounded w-100" style={{ maxWidth: "400px", backgroundColor: "#1a1a1a", boxShadow: "0 0 20px #FFD700" }}>
          <h2 className="text-center mb-4">Verify Your Email</h2>
          <p className="text-center mb-3">We sent an OTP to <strong>{formData.email}</strong></p>
          <form onSubmit={handleVerify}>
            <div className="mb-3">
              <label className="form-label">Enter OTP</label>
              <input type="text" className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            {message && <div className="mb-3 text-center">{message}</div>}
            <div className="d-grid mb-2">
              <button type="submit" className="btn btn-lg" style={{ backgroundColor: "#FFD700", color: "#000" }} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
            <button className="btn btn-outline-warning btn-sm" onClick={handleResend} disabled={resendLoading}>
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: "linear-gradient(135deg, #000000, #333333)", color: "#fff", padding: "1rem" }}>
      <div className="p-4 rounded w-100" style={{ maxWidth: "500px", backgroundColor: "#1a1a1a", boxShadow: "0 0 20px #FFD700" }}>
        <h2 className="text-center mb-4">Client Sign-Up</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className={`form-control ${errors.name ? "is-invalid" : ""}`} value={formData.name} onChange={handleChange} />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} value={formData.email} onChange={handleChange} />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} value={formData.password} onChange={handleChange} />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Fitness Interests</label>
            <select name="fitnessInterests" className={`form-select ${errors.fitnessInterests ? "is-invalid" : ""}`} multiple value={formData.fitnessInterests} onChange={handleChange}>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="endurance">Endurance</option>
            </select>
            {errors.fitnessInterests && <div className="invalid-feedback">{errors.fitnessInterests}</div>}
            <small className="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
          </div>

          <div className="mb-3">
            <label className="form-label">Subscription Plan</label>
            <select name="subscriptionPlan" className={`form-select ${errors.subscriptionPlan ? "is-invalid" : ""}`} value={formData.subscriptionPlan} onChange={handleChange}>
              <option value="">Select a plan</option>
              <option value="monthly">Monthly - $50</option>
              <option value="quarterly">Quarterly - $140</option>
              <option value="yearly">Yearly - $500</option>
            </select>
            {errors.subscriptionPlan && <div className="invalid-feedback">{errors.subscriptionPlan}</div>}
          </div>

          {/* CAPTCHA */}
          <div className="mb-3">
            <label className="form-label">CAPTCHA</label>
            <div className="d-flex align-items-center mb-2 flex-wrap gap-2">
              <span style={{ fontWeight: "bold", backgroundColor: "#ddd", padding: "8px 12px", letterSpacing: "3px", fontSize: "18px", userSelect: "none" }}>{captcha}</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={generateCaptcha}>Refresh</button>
            </div>
            <input type="text" name="captureCode" className={`form-control ${errors.captureCode ? "is-invalid" : ""}`} value={formData.captureCode} onChange={handleChange} required />
            {errors.captureCode && <div className="invalid-feedback">{errors.captureCode}</div>}
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-lg" style={{ backgroundColor: "#FFD700", color: "#000" }}>
              {mutation.isLoading ? "Processing..." : "Register"}
            </button>
          </div>

          <div className="text-center mt-3">
            <small>Already have an account? <a href="/login" style={{ color: "#FFD700" }}>Login</a></small>
          </div>

          {message && <div className="mt-3 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ClientSignUp;
