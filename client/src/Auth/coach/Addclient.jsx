import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner, ListGroup } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../Api/axiosInstance/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

const OnboardingClientPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    subscriptionPlan: "monthly",
    fitnessInterests: [],
  });
  const navigate = useNavigate();

  // Mutation to submit onboarding data
  const mutation = useMutation({
    mutationFn: (data) => axiosInstance.post("http://localhost:3005/api/coach/onboard-client", data),
    onSuccess: () => {
      alert("Client onboarding completed!");
      setFormData({
        name: "",
        location: "",
        email: "",
        phone: "",
        subscriptionPlan: "monthly",
        fitnessInterests: [],
      });
    },
    onError: (error) => {
      console.error(error);
      alert("Error submitting data!");
    },
  });

  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (options) {
      // For multiple select (fitnessInterests)
      const selected = Array.from(options).filter((o) => o.selected).map((o) => o.value);
      setFormData({ ...formData, [name]: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fetch client data if email exists
  const handleEmailBlur = async () => {
    if (!formData.email) return;
    try {
      const res = await axiosInstance.get(
        `http://localhost:3005/api/coach/client?email=${formData.email}`
      );
      if (res.data && res.data.client) {
        const { name, location, phone, subscriptionPlan, fitnessInterests } = res.data.client;
        setFormData({
          ...formData,
          name,
          location,
          phone,
          subscriptionPlan,
          fitnessInterests: fitnessInterests || [],
        });
      }
    } catch (err) {
      console.log("Client not found, creating new",err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
    navigate("/coach/dashboard");
  };

  return (
    <Container fluid className="p-5 mt-5" style={{ minHeight: "100vh", paddingTop: "60px" }}>
      <Row className="h-100 m-0">
        {/* Sidebar */}
        <Col xs={12} md={3} lg={2} className="bg-dark text-white p-0 vh-100">
          <ListGroup variant="flush">
            <ListGroup.Item className="bg-dark text-white border-0">
              <Link to="/coach/dashboard" className="text-white text-decoration-none">
                Dashboard
              </Link>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <Link to="/coach/onboarding" className="text-white text-decoration-none">
                Onboarding
              </Link>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <Link to="/coach/client/onboarding" className="text-white text-decoration-none">
                Add Client
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col
          xs={12}
          md={9}
          lg={10}
          className="d-flex justify-content-center align-items-start"
          style={{ backgroundColor: "#f5f5f5", paddingTop: "20px" }}
        >
          <div className="p-4 rounded w-100" style={{ maxWidth: "600px", backgroundColor: "#2c2c2c" }}>
            <h2 className="mb-4 text-white text-center">Client Onboarding</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label className="text-white">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="location">
                <Form.Label className="text-white">Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="text-white">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur} // <-- fetch existing client
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="phone">
                <Form.Label className="text-white">Phone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="subscriptionPlan">
                <Form.Label className="text-white">Subscription Plan</Form.Label>
                <Form.Select
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={handleChange}
                  required
                  className="bg-dark text-white border-secondary"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </Form.Select>
              </Form.Group>

              <div className="mb-3">
                <label className="form-label text-white">Fitness Interests</label>
                <select
                  name="fitnessInterests"
                  className="form-select"
                  multiple
                  value={formData.fitnessInterests}
                  onChange={handleChange}
                  required
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="endurance">Endurance</option>
                </select>
                <small className="text-muted">
                  Hold Ctrl (Windows) or Cmd (Mac) to select multiple
                </small>
              </div>

              <Button variant="primary" type="submit" className="w-100" disabled={mutation.isLoading}>
                {mutation.isLoading ? <Spinner animation="border" size="sm" /> : "Complete Onboarding"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OnboardingClientPage;
