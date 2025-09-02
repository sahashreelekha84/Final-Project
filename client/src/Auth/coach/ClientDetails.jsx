import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient,  } from "@tanstack/react-query";
import { Spinner, Container, Row, Col, ListGroup, Button, Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axiosInstance from "../../Api/axiosInstance/axiosInstance";

const ClientDetails = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
   const queryClient = useQueryClient();

  // Fetch clients
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["clientDetails"],
    queryFn: async () => {
      const res = await axiosInstance.get("http://localhost:3005/api/coach/clients");
       
      return res.data;
    },
    retry: 1,
   
  });

  // Toggle Active/Inactive mutation
  // const toggleStatus = useMutation({
  //   mutationFn: async ({ currentStatus }) => {
  //     const newStatus = currentStatus === "active" ? "inactive" : "active";
  //     const res = await axiosInstance.patch(
  //       `http://localhost:3005/api/coach/clients/${newStatus}`,
  //       { status: newStatus }
  //     );
  //     return res.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["clientDetails"]);
  //   },
  // });
  const toggleStatus = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.patch(`http://localhost:3005/api/coach/client/${id}/toggle-status`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["clients"]);
    },
  });
  return (
    <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
      <Row className="m-0">
        {/* Sidebar */}
        <Col
          xs={sidebarCollapsed ? 2 : 3}
          md={sidebarCollapsed ? 2 : 3}
          lg={sidebarCollapsed ? 2 : 2}
          className="bg-dark text-white vh-100 p-0 d-flex flex-column"
          style={{ position: "sticky", top: 0 }}
        >
          <div className="p-2 border-bottom text-center">
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? ">" : "<"}
            </Button>
          </div>

          <ListGroup variant="flush" className="flex-grow-1">
            <ListGroup.Item className="bg-dark text-white border-0">
              <NavLink
                to="/coach/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-warning text-decoration-none" : "text-white text-decoration-none"
                }
              >
                Dashboard
              </NavLink>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <NavLink
                to="/coach/clients"
                className={({ isActive }) =>
                  isActive ? "text-warning text-decoration-none" : "text-white text-decoration-none"
                }
              >
                Client Details
              </NavLink>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <NavLink
                to="/coach/onboarding"
                className={({ isActive }) =>
                  isActive ? "text-warning text-decoration-none" : "text-white text-decoration-none"
                }
              >
                Onboarding
              </NavLink>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <NavLink
                to="/coach/client/onboarding"
                className={({ isActive }) =>
                  isActive ? "text-warning text-decoration-none" : "text-white text-decoration-none"
                }
              >
                Add Client
              </NavLink>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col
          xs={sidebarCollapsed ? 10 : 9}
          md={sidebarCollapsed ? 10 : 9}
          lg={sidebarCollapsed ? 10 : 10}
          className="p-4 mt-5"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <h2 className="mb-4 text-warning">Client Details</h2>
          {isLoading ? (
            <Spinner animation="border" />
          ) : isError ? (
            <p style={{ color: "red" }}>Error: {error.message}</p>
          ) : data && data.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Fitness Interests</th>
                  <th>Subscription</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.filter(client => client).map((client, index) => (
                  <tr key={client._id}>
                    <td>{index + 1}</td>
                    <td>{client?.name}</td>
                    <td>{client?.email}</td>
                    <td>{client?.fitnessInterests}</td>
                    <td>{client?.subscriptionPlan}</td>
                    <td>
                      <span
                        className={`badge ${
                          client?.status === "active" ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {client?.status}
                      </span>
                    </td>
                    {/* <td>
                      <Button
                        variant={client.status === "active" ? "danger" : "success"}
                        size="sm"
                        disabled={toggleStatus.isLoading}
                        onClick={() =>
                          toggleStatus.mutate({
                            clientId: client._id,
                            currentStatus: client.status,
                          })
                        }
                      >
                        {client.status === "active" ? "Set Inactive" : "Set Active"}
                      </Button>
                    </td> */}
                     <td>
              <Button
               variant={client?.status === "offline" ? "danger" : "success"}
                        size="sm"
                onClick={() => toggleStatus.mutate(client._id)}
                disabled={toggleStatus.isLoading}
              >
                {toggleStatus.isLoading ? "Updating..." : "Toggle Status"}
              </Button>
            </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p style={{ color: "#000" }}>No clients found.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ClientDetails;
