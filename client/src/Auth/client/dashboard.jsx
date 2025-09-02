import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../Api/axiosInstance/axiosInstance";

// Fetch dashboard info
const fetchDashboard = async () => {
  const res = await axiosInstance.get("http://localhost:3005/api/dashboard");
  return res.data;
};

// Fetch profile info
const fetchProfile = async () => {
  const res = await axiosInstance.get("http://localhost:3005/api/profile");
  return res?.data?.data?.clientData || {};
};

// Fetch schedule from API
const fetchSchedule = async (clientId) => {
  console.log('schedule', clientId);

  const res = await axiosInstance.get(`http://localhost:3005/api/programs/${clientId}`);
  console.log(res?.data?.program);

  return res?.data?.program || []; // extract program object 
};

// Fetch meal plan from API
const fetchMealPlan = async (clientId) => {
  const res = await axiosInstance.get(`http://localhost:3005/api/meals/mealslist/${clientId}`);
  console.log(res?.data?.meal);

  return res?.data?.meal || []; // fallback to empty array
};

const UserDashboard = () => {
  const clientId = localStorage.getItem('userId')
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  console.log(clientId);
  const { data: program } = useQuery({
    queryKey: ["schedule", clientId],
    queryFn: () => fetchSchedule(clientId),   // ✅ wrap it in function
    enabled: !!clientId,
  });



const { data: mealPlan } = useQuery({
  queryKey: ["mealPlan", clientId],
  queryFn: () => fetchMealPlan(clientId), // 👈 wrap in arrow function
  enabled: !!clientId,
});


  console.log(data, profile, mealPlan);


  const [activeSection, setActiveSection] = useState("subscription");

  if (isLoading) return <div className="text-center mt-5">Loading...</div>;
  if (isError) return <div className="text-center mt-5">{error.message}</div>;

  return (

    <> <div className="d-flex" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #000000, #333333)", color: "#fff" }}>

      <div style={{ width: "220px", backgroundColor: "#111", paddingTop: "80px", position: "fixed", top: 0, left: 0, height: "100%" }}>
        <h4 className="text-center text-warning">Dashboard</h4>
        <ul className="nav flex-column mt-4">
          {["subscription", "profile", "schedule", "meal"].map((section) => (
            <li key={section} className="nav-item">
              <button className="btn btn-link text-white w-100" onClick={() => setActiveSection(section)}>
                {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, " $1")}
              </button>
            </li>
          ))}
        </ul>
      </div>


      <div className="container" style={{ marginLeft: "220px", paddingTop: "100px" }}>
        <h1 className="text-center mb-4 text-warning">Welcome, {data?.name}</h1>

        {activeSection === "subscription" && (
          <div className="card mb-3" style={{ backgroundColor: "#1a1a1a", boxShadow: "0 0 20px #FFD700", color: "#fff" }}>
            <div className="card-body">
              <h5 className="card-title text-warning">Subscription Details</h5>
              <p className="card-text">
                <strong className="text-warning">Plan: </strong> <span className="text-white">{data?.subscriptionPlan}</span> <br />
                <strong className="text-warning">Status:</strong> <span className="text-white">{data?.status}</span> <br />
                <strong className="text-warning">Coach:</strong> <span className="text-white">{data?.coach?.name || "Not Assigned"}</span>
              </p>
            </div>
          </div>
        )}

        {activeSection === "profile" && (
          <div className="card mb-3" style={{ backgroundColor: "#1a1a1a", boxShadow: "0 0 20px #FFD700", color: "#fff" }}>
            <div className="card-body">
              <h5 className="card-title text-warning">Profile Information</h5>
              <p className="card-text">
                <strong className="text-warning">Name:</strong> <span className="text-white">{profile.name}</span> <br />
                <strong className="text-warning">Email:</strong> <span className="text-white">{profile.email}</span> <br />
                <strong className="text-warning">Subscription Plan:</strong> <span className="text-white">{profile.subscriptionPlan?.join(", ") || "N/A"}</span> <br />
                <strong className="text-warning">Status:</strong> <span className="text-white">{profile.status || "N/A"}</span> <br />
                <strong className="text-warning">Fitness Interests:</strong> <span className="text-white">{profile.fitnessInterests?.join(", ") || "N/A"}</span>
              </p>
            </div>
          </div>
        )}

        {activeSection === "schedule" && (
          <div style={{ background: "#1a1a1a", color: "#fff", padding: "20px", borderRadius: "8px" }}>
            <h3 className="text-warning ">{program?.name}</h3>
            <p><strong className="text-white">Goal: {" "} {" "}  {" "}</strong><span className="text-white">{program?.goal}</span> </p>
            <p><strong className="text-white">Visibility: </strong><span className="text-white">{program?.visibility}</span> </p>
            <p><strong className="text-white">Created At: </strong> <span className="text-white">{new Date(program?.createdAt).toLocaleString()}</span></p>

            <h3 className="text-warning">Schedule</h3>
            {program?.schedule?.map((day) => (
              <div key={day._id} style={{ marginBottom: "16px", padding: "10px", background: "#2a2a2a", borderRadius: "6px" }}>
                <h4 className="text-warning">Day {day.day}</h4>
                <ul>
                  {day.items.map((exercise) => (
                    <li key={exercise._id} style={{ marginBottom: "8px" }}>
                      <strong>Sets:</strong> {exercise.sets},{" "}
                      <strong>Reps:</strong> {exercise.reps},{" "}
                      <strong>Duration:</strong> {exercise.durationSec}s
                      <br />
                      <em>Notes: {exercise.notes}</em>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}



        {activeSection === "meal" && (
          <div style={{ background: "#1a1a1a", color: "#fff", padding: "20px", borderRadius: "8px" }}>
            <h3 className="text-warning">{mealPlan?.name}</h3>

            <p>
              <strong className="text-white">Target Calories: </strong>
              <span className="text-white">{mealPlan?.targetCalories
              }</span>
            </p>

            <p>
              <strong className="text-white">Rules: </strong>
              <span className="text-white">
                {mealPlan?.rules?.noSugarAfter6PM ? "No Sugar After 6PM, " : ""}
                {mealPlan?.rules?.maxCheatMeals
                  ? `Max Cheat Meals: ${mealPlan.rules.maxCheatMeals}`
                  : ""}
              </span>
            </p>

            <h3 className="text-warning">Meals</h3>
            {mealPlan?.meals?.map((meal) => (
              <div
                key={meal._id}
                style={{
                  marginBottom: "16px",
                  padding: "10px",
                  background: "#2a2a2a",
                  borderRadius: "6px",
                }}
              >
                <h4 className="text-info">Time: {meal.time}</h4>
                <ul>
                  <li>
                    <strong>Protein:</strong> {meal.overrides?.protein},{" "}
                    <strong>Carbs:</strong> {meal.overrides?.carbs},{" "}
                    <strong>Fat:</strong> {meal.overrides?.fat}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>
    </div></>
  );
};

export default UserDashboard;
