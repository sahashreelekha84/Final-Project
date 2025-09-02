import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../Api/axiosInstance/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    coachType: '',
    workplace: '',
    clientCount: '',
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => axiosInstance.post("http://localhost:3005/api/coach/onboarding", data),
    onSuccess: () => {
      alert("Coach onboarding completed!");
      setFormData({ coachType: '', workplace: '', clientCount: '' });
    },
    onError: (error) => {
      console.error(error);
      alert("Error submitting data!");
    },
  });

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      mutation.mutate(formData);
      navigate('/coach/dashboard');
    }
  };

  return (
    <Container fluid className="p-5 mt-5" style={{ minHeight: '100vh', paddingTop: '60px' }}>
      <Row className="h-100 m-0">
        {/* Sidebar */}
        <Col xs={12} md={3} lg={2} className="bg-dark text-white p-0 vh-100">
          <ListGroup variant="flush">
            <ListGroup.Item className="bg-dark text-white border-0">
              <Link to="/coach/dashboard" className="text-white text-decoration-none">Dashboard</Link>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <Link to="/coach/onboarding" className="text-white text-decoration-none">Onboarding</Link>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <Link to="/coach/client/onboarding" className="text-white text-decoration-none">Add Client</Link>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col xs={12} md={9} lg={10} className="d-flex justify-content-center align-items-start" style={{ backgroundColor: '#f5f5f5', paddingTop: '20px' }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '24px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
            <h2 style={{ color: '#FFD700', marginBottom: '16px' }}>Onboarding Step {step}</h2>

            {step === 1 && (
              <select
                value={formData.coachType}
                onChange={(e) => handleSelect('coachType', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#000', color: '#fff', border: '1px solid #555' }}
              >
                <option value="" disabled>Select Coach Type</option>
                <option value="Personal">Personal Coach</option>
                <option value="GymManager">Gym Manager</option>
              </select>
            )}

            {step === 2 && (
              <select
                value={formData.workplace}
                onChange={(e) => handleSelect('workplace', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#000', color: '#fff', border: '1px solid #555' }}
              >
                <option value="" disabled>Select Workplace</option>
                <option value="Gym">Gym</option>
                <option value="Home-based">Home-based</option>
                <option value="CorporateTraining">Corporate Training</option>
              </select>
            )}

            {step === 3 && (
              <select
                value={formData.clientCount}
                onChange={(e) => handleSelect('clientCount', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#000', color: '#fff', border: '1px solid #555' }}
              >
                <option value="" disabled>Select Team Size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="50+">50+</option>
              </select>
            )}

            {/* Progress Bar */}
            <div style={{ marginTop: '24px', height: '12px', backgroundColor: '#1A1A1A', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${step * 33}%`, backgroundColor: '#FFD700', height: '100%' }} />
            </div>

            <button
              onClick={handleNext}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: '#FFD700',
                border: 'none',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {step < 3 ? 'Next' : 'Submit'}
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
