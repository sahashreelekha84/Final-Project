import React, { useState } from "react";
import { Container, Row, Col, ListGroup, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../../Api/axiosInstance/axiosInstance";

const CoachProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["coachProfile"],
    queryFn: async () => {
      const res = await axiosInstance.get("http://localhost:3005/api/coach/getprofile");
      console.log(res);
      return res.data?.coach;
      
      
    },
    retry: 1,
  });

  if (isLoading) return <p style={{ color: "#fff" }}>Loading profile...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <Container fluid className="p-5 mt-5" style={{ minHeight: "100vh", paddingTop: "60px" }}>
      <Row className="h-100 m-0">
        {/* Sidebar */}
        <Col xs={12} md={3} lg={2} className="bg-dark text-white p-0 vh-100">
          <ListGroup variant="flush">
            <ListGroup.Item
              action
              active={activeTab === "home"}
              onClick={() => setActiveTab("home")}
              className="bg-dark text-white border-0"
            >
              <Link to="/coach/dashboard" className="text-white text-decoration-none">Dashboard</Link>
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeTab === "onboarding"}
              onClick={() => setActiveTab("onboarding")}
              className="bg-dark text-white border-0"
            >
              <Link to="/coach/onboarding" className="text-white text-decoration-none">Onboarding</Link>
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeTab === "addclient"}
              onClick={() => setActiveTab("addclient")}
              className="bg-dark text-white border-0"
            >
              <Link to="/coach/client/onboarding" className="text-white text-decoration-none">Add Client</Link>
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              className="bg-dark text-white border-0"
            >
              Profile
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col xs={12} md={9} lg={10} className="p-4 d-flex justify-content-center" style={{ backgroundColor: "#f5f5f5" }}>
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              backgroundColor: "#2c2c2c",
              padding: "24px",
              borderRadius: "8px",
              color: "#fff",
            }}
          >
            <h2 style={{ color: "#FFD700", marginBottom: "16px" }}>Coach Profile</h2>
            <p><strong style={{ color: "#fff" }}>Full Name:</strong> <span style={{ color: "#FFD700" }}>{data.name}</span></p>
            <p><strong style={{ color: "#fff" }}>Email:</strong> <span style={{ color: "#FFD700" }}>{data.email}</span></p>
           
            <p><strong style={{ color: "#fff" }}>Coach Type:</strong> <span style={{ color: "#FFD700" }}>{data.coachType}</span></p>
            <p><strong style={{ color: "#fff" }}>Workplace:</strong> <span style={{ color: "#FFD700" }}>{data.workplace}</span></p>
            <p><strong style={{ color: "#fff" }}>Team Size:</strong> <span style={{ color: "#FFD700" }}>{data.clientCount}</span></p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CoachProfile;
