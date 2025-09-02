import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Spinner,
  Form,
  Button,
  Alert,
  Table,
} from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../Api/axiosInstance/axiosInstance";
import { Link } from "react-router-dom";

// Fetch dashboard data
const fetchDashboard = async () => {
  const res = await axiosInstance.get("/coach/dashboard");
  return res.data.data;
};

// Save Program (Schedule) with FormData
const saveProgram = async (formData) => {
  const res = await axiosInstance.post("/programs/create", formData);
  return res.data;
};

const fetchBlogs = async () => {
  const res = await axiosInstance.get("http://localhost:3005/api/blog/list");
  console.log(res.data);
  
  return res?.data?.blogs;
};
const saveBlog = async (formData) => {
  const res = await axiosInstance.post("http://localhost:3005/api/create/blog", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
const updateBlog = async ({ id, formData }) => {
  const res = await axiosInstance.post(`http://localhost:3005/api/updateblog/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
const CoachDashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("home");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
 const [blogView, setBlogView] = useState("list"); // "list" | "form"
  const [blog, setBlog] = useState({ title: "", description: "", image: null });
  const [blogId, setBlogId] = useState(null);
  


  const [schedule, setSchedule] = useState({
    email: "",
    name: "",
    goal: "",
    visibility: "",
    days: [
      { day: 1, items: [{ exercise: "", sets: "", reps: "", durationSec: "", notes: "" }] },
    ],
  });

  // Meal plan form state stays the same
  const [mealPlan, setMealPlan] = useState({
    email: "",
    name: "",
    targetCalories: "",
    meals: [
      {
        time: "",
        overrides: { protein: "", carbs: "", fat: "" },
      },
    ],
    rules: {
      noSugarAfter6PM: false,
      maxCheatMeals: 0,
    },
  });

  // Queries
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
  const { data: blogs, isLoading: blogLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });
  // Mutations
  const programMutation = useMutation({
    mutationFn: saveProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setSuccessMsg("Program saved successfully!");
      setErrorMsg("");
      setSchedule({
        email: "",
        name: "",
        goal: "",
        visibility: "",
        days: [
          { day: 1, items: [{ exercise: "", sets: "", reps: "", durationSec: "", notes: "" }] },
        ],
      });
    },
    onError: () => {
      setErrorMsg("Failed to save program.");
      setSuccessMsg("");
    },
  });

  const mealPlanMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post("/meals/create", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setSuccessMsg("Meal Plan saved successfully!");
      setErrorMsg("");
      setMealPlan({ name: "", targetCalories: "", meals: [{ time: "", overrides: {} }] });
    },
    onError: () => {
      setErrorMsg("Failed to save meal plan.");
      setSuccessMsg("");
    },
  });

  /** Schedule handlers */
  const handleScheduleMetaChange = (e) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };

  const handleScheduleChange = (e, dayIndex, itemIndex, field) => {
    const updated = { ...schedule };
    updated.days[dayIndex].items[itemIndex][field] = e.target.value;
    setSchedule(updated);
  };

  const addDay = () => {
    const updated = { ...schedule };
    if (updated.days.length >= 5) return;
    updated.days.push({
      day: updated.days.length + 1,
      items: [{ exercise: "", sets: "", reps: "", durationSec: "", notes: "" }],
    });
    setSchedule(updated);
  };
  const removeDay = (dayIndex) => {
    const updated = { ...schedule };
    updated.days.splice(dayIndex, 1);

    // Optional: re-number remaining days
    updated.days = updated.days.map((d, index) => ({ ...d, day: index + 1 }));

    setSchedule(updated);
  };

  const addExercise = (dayIndex) => {
    const updated = { ...schedule };
    updated.days[dayIndex].items.push({
      exercise: "",
      sets: "",
      reps: "",
      durationSec: "",
      notes: "",
    });
    setSchedule(updated);
  };
  const removeExercise = (dayIndex, exerciseIndex) => {
    const updated = { ...schedule };
    updated.days[dayIndex].items.splice(exerciseIndex, 1); // remove the exercise at index
    setSchedule(updated);
  };
  const submitSchedule = (e) => {
    e.preventDefault();
    const payload = {
      email: schedule.email,
      name: schedule.name,
      goal: schedule.goal,
      visibility: schedule.visibility,
      schedule: schedule.days, // keep as array
    };
    programMutation.mutate(payload);
  };

  /** Meal Plan handlers (unchanged) */
  const handleMealChange = (e, index, field, subfield) => {
    const newMeals = [...mealPlan.meals];

    if (field === "overrides") {
      newMeals[index].overrides[subfield] = e.target.value;
    } else {
      newMeals[index][field] = e.target.value;
    }

    setMealPlan({ ...mealPlan, meals: newMeals });
  };

  // Add new meal
  const addMeal = () => {
    setMealPlan({
      ...mealPlan,
      meals: [
        ...mealPlan.meals,
        { time: "", overrides: { protein: "", carbs: "", fat: "" } },
      ],
    });
  };

  const submitMealPlan = (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = {
      email: mealPlan.email,
      name: mealPlan.name,
      targetCalories: mealPlan.targetCalories,
      meals: mealPlan.meals,
      rules: mealPlan.rules,
    };

    mealPlanMutation.mutate(payload);

    // Reset form safely
    setMealPlan({
      name: "",
      targetCalories: "",
      meals: [
        { time: "", overrides: { protein: "", carbs: "", fat: "" } },
      ],
      rules: {
        noSugarAfter6PM: false,
        maxCheatMeals: 0,
      },
    });
  };
  // const blogMutation = useMutation({
  //   mutationFn: async (formData) => {

  //     const res = await axiosInstance.post('http://localhost:3005/api/create/blog', formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     return res.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  //     setSuccessMsg("Blog saved successfully!");
  //     setErrorMsg("");
  //     setBlog({ title: "", description: "", image: null });
  //     setBlogId(null);
  //   },
  //   onError: () => {
  //     setErrorMsg("Failed to save blog.");
  //     setSuccessMsg("");
  //   },
  // });
  // const handleBlogChange = (e) => {
  //   const { name, value } = e.target;
  //   setBlog({ ...blog, [name]: value });
  // };

  // const handleBlogFileChange = (e) => {
  //   setBlog({ ...blog, image: e.target.files[0] });
  // };

  // const submitBlog = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("title", blog.title);
  //   formData.append("description", blog.description);
  //   if (blog.image) formData.append("image", blog.image);
  //   blogMutation.mutate(formData);
  // };

  const blogCreateMutation = useMutation({
    mutationFn: saveBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      resetBlogForm();
      setSuccessMsg("Blog created successfully!");
    },
    onError: () => {
      setErrorMsg("Failed to save blog.");
    },
  });
const blogUpdateMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      resetBlogForm();
      setSuccessMsg("Blog updated successfully!");
    },
    onError: () => {
      setErrorMsg("Failed to update blog.");
    },
  });
 

  /** ---------------- Blog Handlers ---------------- */
  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };
  const handleBlogFileChange = (e) => {
    setBlog({ ...blog, image: e.target.files[0] });
  };
  const submitBlog = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("description", blog.description);
    if (blog.image) formData.append("image", blog.image);

    if (blogId) {
      blogUpdateMutation.mutate({ id: blogId, formData });
    } else {
      blogCreateMutation.mutate(formData);
    }
  };
  const editBlog = (item) => {
    setBlogId(item._id);
    setBlog({ title: item.title, description: item.description, image: null });
    setBlogView("form");
  };
  const resetBlogForm = () => {
    setBlogId(null);
    setBlog({ title: "", description: "", image: null });
    setBlogView("list");
  };


  /** Render sections */
  const renderHome = () => (
    <Row>
      {dashboard && Object.entries(dashboard).map(([stat, value]) => (
        <Col xs={12} md={6} className="mb-3" key={stat}>
          <Card className="p-3 h-100 bg-dark text-white shadow-sm">
            <strong className="text-warning">{stat}</strong>
            <p className="mb-0 text-white">{value}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );
const renderBlogList = () => (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between">
        <h5>All Blogs</h5>
        <Button variant="success" onClick={() => setBlogView("form")}>
          + Add Blog
        </Button>
      </Card.Header>
      <Card.Body>
        {blogLoading ? (
          <Spinner animation="border" />
        ) : blogs?.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>
                    <img
                      src={`http://localhost:3005/${item.image}`}
                      alt="blog"
                      height="80"
                    />
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => editBlog(item)}
                    >
                      Edit
                    </Button>
                  
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No blogs found</p>
        )}
      </Card.Body>
    </Card>
  );

  const renderBlogForm = () => (
    <Card className="p-3 bg-dark text-white shadow-sm">
      <h4 className="text-warning mb-3">{blogId ? "Edit Blog" : "Create Blog"}</h4>
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={submitBlog}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={blog.title}
            onChange={handleBlogChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={blog.description}
            onChange={handleBlogChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" onChange={handleBlogFileChange} />
        </Form.Group>

        <Button type="submit" variant="success">
          {blogId ? "Update Blog" : "Save Blog"}
        </Button>
        <Button variant="secondary" className="ms-2" onClick={resetBlogForm}>
          Cancel
        </Button>
      </Form>
    </Card>
  );

  // const renderBlogList = () => (
  //   <Card>
  //     <Card.Header>All Blogs</Card.Header>
  //     <Card.Body>
  //       <Table striped bordered hover>
  //         <thead>
  //           <tr>
  //             <th>Title</th>
  //             <th>Description</th>
  //             <th>Image</th>
  //             <th>Actions</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {blogs?.map((item) => (
  //             <tr key={item._id}>
  //               <td>{item.title}</td>
  //               <td>{item.description}</td>
  //               <td>
  //                 <img
  //                   src={`http://localhost:3005/${item.image}`}
  //                   alt="blog"
  //                   height="80"
  //                 />
  //               </td>
  //               <td>
  //                 <Button
  //                   variant="warning"
  //                   size="sm"
  //                   className="me-2"
  //                   onClick={() => editBlog(item)}
  //                 >
  //                   Edit
  //                 </Button>

  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </Table>
  //     </Card.Body>
  //   </Card>
  // )
  const renderScheduleForm = () => (
    <Card className="p-3 bg-dark text-white shadow-sm">
      <h4 className="text-warning mb-3">Create Workout Schedule</h4>
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={submitSchedule}>
        {/* Meta fields */}
        <Form.Group className="mb-3">
          <Form.Label>ClientEmail</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={schedule.email}
            onChange={handleScheduleMetaChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={schedule.name}
            onChange={handleScheduleMetaChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Goal</Form.Label>
          <Form.Control
            type="text"
            name="goal"
            value={schedule.goal}
            onChange={handleScheduleMetaChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Visibility</Form.Label>
          <Form.Control
            type="text"
            name="visibility"
            value={schedule.visibility}
            onChange={handleScheduleMetaChange}
            required
          />
        </Form.Group>

        {/* Days */}
        {schedule.days.map((day, dayIndex) => (
          <div key={dayIndex} className="border rounded p-3 mb-3">
            <h5 className="text-info">Day {day.day}</h5>
            {day.items.map((item, itemIndex) => (
              <div key={itemIndex} className="mb-2 p-2 border rounded">

                <Form.Group>
                  <Form.Label>Exercise</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.exercise}
                    onChange={(e) =>
                      handleScheduleChange(e, dayIndex, itemIndex, "exercise")
                    }
                  />
                  <Form.Label>Sets</Form.Label>
                  <Form.Control
                    type="number"
                    value={item.sets}
                    onChange={(e) =>
                      handleScheduleChange(e, dayIndex, itemIndex, "sets")
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Reps</Form.Label>
                  <Form.Control
                    type="number"
                    value={item.reps}
                    onChange={(e) =>
                      handleScheduleChange(e, dayIndex, itemIndex, "reps")
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Duration (sec)</Form.Label>
                  <Form.Control
                    type="number"
                    value={item.durationSec}
                    onChange={(e) =>
                      handleScheduleChange(e, dayIndex, itemIndex, "durationSec")
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.notes}
                    onChange={(e) =>
                      handleScheduleChange(e, dayIndex, itemIndex, "notes")
                    }
                  />
                </Form.Group>
              </div>
            ))}
            <div>
              <Button
                variant="warning"
                onClick={() => addExercise(dayIndex)}
                className="m-2"
              >
                + Add Exercise
              </Button>
              <Button
                variant="warning"
                onClick={() => removeExercise(dayIndex)}
                className="m-2"
              >
                - Remove Exercise
              </Button>
            </div>

          </div>
        ))}
        <div>
          <Button variant="info" onClick={addDay} className="m-2">
            + Add Day
          </Button>
          <Button variant="info" onClick={removeDay} className="m-2">
            - Remove Day
          </Button>
        </div>

        <div>
          <Button type="submit" variant="success" className="m-2">
            Save Schedule
          </Button>
        </div>

      </Form>
    </Card>
  );

  const renderMealForm = () => (
    <Card className="p-3 bg-dark text-white shadow-sm">
      <h4 className="text-warning mb-3">Create Meal Plan</h4>
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Form onSubmit={submitMealPlan}>
        <Form.Group>
          <Form.Label>Client Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={mealPlan.email || ''}
            onChange={(e) => setMealPlan({ ...mealPlan, email: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={mealPlan.name || ''}
            onChange={(e) => setMealPlan({ ...mealPlan, name: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Target Calories</Form.Label>
          <Form.Control
            type="number"
            name="targetCalories||0"
            value={mealPlan.targetCalories}
            onChange={(e) => setMealPlan({ ...mealPlan, targetCalories: e.target.value })}
            required
          />
        </Form.Group>

        <h5 className="mt-3 text-warning">Meals</h5>
        {mealPlan.meals.map((meal, index) => (
          <div key={index} className="border p-2 rounded mb-2">
            <Form.Group>
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={meal.time}
                onChange={(e) => handleMealChange(e, index, "time")}
              />
            </Form.Group>

            <h6 className="mt-2">Overrides</h6>
            <Form.Group>
              <Form.Label>Protein</Form.Label>
              <Form.Control
                type="text"
                value={meal.overrides.protein}
                onChange={(e) => handleMealChange(e, index, "overrides", "protein")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Carbs</Form.Label>
              <Form.Control
                type="text"
                value={meal.overrides.carbs}
                onChange={(e) => handleMealChange(e, index, "overrides", "carbs")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fat</Form.Label>
              <Form.Control
                type="text"
                value={meal.overrides.fat}
                onChange={(e) => handleMealChange(e, index, "overrides", "fat")}
              />
            </Form.Group>
          </div>
        ))}
        <Button variant="warning" onClick={addMeal} className="mb-3">
          + Add Meal
        </Button>

        <h5 className="mt-3 text-warning">Rules</h5>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="No Sugar After 6PM"
            checked={mealPlan.rules?.noSugarAfter6PM || false}
            onChange={(e) =>
              setMealPlan({
                ...mealPlan,
                rules: { ...mealPlan.rules, noSugarAfter6PM: e.target.checked },
              })
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Max Cheat Meals</Form.Label>
          <Form.Control
            type="number"
            value={mealPlan.rules?.maxCheatMeals}
            onChange={(e) =>
              setMealPlan({
                ...mealPlan,
                rules: { ...mealPlan.rules, maxCheatMeals: e.target.value },
              })
            }
          />
        </Form.Group>

        <Button type="submit" variant="success" className="mt-3">
          Save Meal Plan
        </Button>
      </Form>
    </Card>
  );


  const renderContent = () => {
    if (isLoading) return <Spinner animation="border" className="mt-3" />;
    switch (activeTab) {
      case "home":
        return renderHome();
      case "schedule":
        return renderScheduleForm();
      case "meal":
        return renderMealForm();
     case "blog":
        return blogView === "list" ? renderBlogList() : renderBlogForm();



      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-5 mt-5" style={{ minHeight: "100vh", paddingTop: "60px" }}>
      <Row className="h-100 m-0">
        <Col xs={12} md={3} lg={2} className="bg-dark text-white p-0 vh-100">
          <ListGroup variant="flush">
            <ListGroup.Item action active={activeTab === "home"} onClick={() => setActiveTab("home")} className="bg-dark text-white border-0"><Link to='/'>Home</Link></ListGroup.Item>
            <ListGroup.Item action active={activeTab === "schedule"} onClick={() => setActiveTab("schedule")} className="bg-dark text-white border-0">Schedule</ListGroup.Item>
            <ListGroup.Item action active={activeTab === "meal"} onClick={() => setActiveTab("meal")} className="bg-dark text-white border-0">Meal Plan</ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <Link to="/coach/onboarding" className="text-white text-decoration-none">On_Boarding</Link>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <Link to="/coach/clients" className="text-white text-decoration-none">Client Details</Link>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-0">
              <Link to="/coach/client/onboarding" className="text-white text-decoration-none">Add Client</Link>
            </ListGroup.Item>
           <ListGroup.Item
              action
              active={activeTab === "blog"}
              onClick={() => {
                setActiveTab("blog");
                setBlogView("list");
              }}
              className="bg-dark text-white border-0"
            >
              Blog
            </ListGroup.Item>
         
          </ListGroup>
        </Col>

        <Col xs={12} md={9} lg={10} className="p-4 d-flex flex-column" style={{ backgroundColor: "#f5f5f5" }}>
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default CoachDashboard;
