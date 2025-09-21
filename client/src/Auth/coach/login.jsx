// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import useUserStore from "../../store/useUserStore";

// const CoachLogin = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const [isSettingPassword, setIsSettingPassword] = useState(false);
//   const [newPassword, setNewPassword] = useState("");

//   // Login mutation
//   const loginMutation = useMutation({
//     mutationFn: (data) => axios.post("http://localhost:3005/api/admin/login", data),
//     onSuccess: (res) => {
//       console.log(res);
//       const firstLogin = res?.data?.firstLogin
//       const user = res?.data?.user;
//       const role = user?.roleName;

//       // Save token and info
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("username", user?.email);
//       localStorage.setItem("coachId", user?._id);

//       // Update Zustand store
//       useUserStore.getState().setUser({
//         username: user?.email,
//         userId: user?._id,
//         role,
//       });

//       // If first login, show set-password form
//       if (firstLogin) {
//         setIsSettingPassword(true);
//       } else {
//         navigate("/coach/dashboard");
//       }
//     },
//     onError: (error) => {
//       setMessage(error.response?.data?.message || error.message);
//     },
//   });

//   // Set Password mutation
//   const setPasswordMutation = useMutation({
//     mutationFn: (data) =>
//       axios.post(
//         "http://localhost:3005/api/set-password",
//         data,
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       ),
//     onSuccess: () => {
//       alert("Password updated successfully!");
//       navigate("/coach/dashboard");
//     },
//     onError: (error) => {
//       setMessage(error.response?.data?.message || error.message);
//     },
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     setMessage("");
//     loginMutation.mutate(formData);
//   };

//   const handlePasswordSubmit = (e) => {
//     e.preventDefault();
//     if (!newPassword) {
//       setMessage("Password cannot be empty");
//       return;
//     }
//     setPasswordMutation.mutate({ password: newPassword });
//   };

//   return (
//     <>
//       <div
//         className="d-flex justify-content-center align-items-center vh-100"
//         style={{ background: "linear-gradient(135deg, #000000, #333333)", color: "#fff" }}
//       >
//         <div
//           className="p-4 rounded mx-auto"
//           style={{
//             maxWidth: "500px",
//             width: "100%",
//             backgroundColor: "#1a1a1a",
//             boxShadow: "0 0 20px #FFD700",
//             color: "#fff",
//             marginTop: "3rem",
//           }}
//         >
//           {!isSettingPassword ? (
//             <>
//               <h2 className="text-center mb-4">Coach Login</h2>
//               {message && <div className="alert alert-warning text-center">{message}</div>}

//               <form onSubmit={handleLoginSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label">Email Address</label>
//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     className="form-control"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="d-grid">
//                   <button
//                     type="submit"
//                     className="btn btn-lg"
//                     style={{ backgroundColor: "#FFD700", color: "#000" }}
//                     disabled={loginMutation.isLoading}
//                   >
//                     {loginMutation.isLoading ? "Logging in..." : "Login"}
//                   </button>
//                 </div>

//                 <div className="text-right mt-3">
                  
//                     <a href="/coach/forgetpassword" style={{ color: "#FFD700" }}>Forget Password</a>
                  
//                 </div>
//               </form>
//             </>
//           ) : (
//             <>
//               <h2 className="text-center mb-4">Set New Password</h2>
//               {message && <div className="alert alert-warning text-center">{message}</div>}

//               <form onSubmit={handlePasswordSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label">New Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="d-grid">
//                   <button
//                     type="submit"
//                     className="btn btn-lg"
//                     style={{ backgroundColor: "#FFD700", color: "#000" }}
//                     disabled={setPasswordMutation.isLoading}
//                   >
//                     {setPasswordMutation.isLoading ? "Updating..." : "Set Password"}
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}

//         </div>


//       </div>
//     </>

//   );
// };

// export default CoachLogin;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useUserStore from "../../store/useUserStore";

const CoachLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const loginMutation = useMutation({
    mutationFn: (data) => axios.post("http://localhost:3005/api/admin/login", data),
    onSuccess: (res) => {
    
      const user = res?.data?.user;
      const role = user?.roleName;

      // Save token and info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", user?.email);
      localStorage.setItem("coachId", user?._id);

      // Update Zustand store
      useUserStore.getState().setUser({
        username: user?.email,
        userId: user?._id,
        role,
      });

      // Navigate depending on login type
    
        navigate("/coach/dashboard");
     
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || error.message);
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    loginMutation.mutate(formData);
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
        <h2 className="text-center mb-4">Coach Login</h2>
        {message && <div className="alert alert-warning text-center">{message}</div>}

        <form onSubmit={handleLoginSubmit}>
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
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="text-right mt-3">
            <a href="/coach/forgetpassword" style={{ color: "#FFD700" }}>
              Forget Password
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoachLogin;
