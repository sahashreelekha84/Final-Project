import React from 'react';
import axiosInstance from '../Api/axiosInstance/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const fetchBlogs = async () => {
  const res = await axiosInstance.get("/blog/list"); 
  return res.data.blogs || []; 
};

const Blog = () => {
  const { data: blogPosts = [], isLoading, isError } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });
console.log(blogPosts);

  if (isLoading) return <p className="text-center mt-5">Loading blogs...</p>;
  if (isError) return <p className="text-center mt-5 text-danger">Error loading blogs</p>;

  return (
    <div
      style={{
        backgroundImage: "url('/images/blog.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        padding: "60px 0",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 1,
        }}
      ></div>

      {/* Blog Content */}
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="text-center mb-5">
          <h5 style={{ color: "#f1c40f", textTransform: "uppercase" }}>
            Welcome to Sportfit
          </h5>
          <h2 style={{ fontWeight: "bold", fontSize: "36px", color: "#fff" }}>The Blog</h2>
        </div>

        <div className="row">
          {blogPosts.map((post) => (
            <div className="col-lg-4 col-md-6 mb-4" key={post._id}>
              <div
                className="blog-card"
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.4)";
                }}
              >
                {/* Blog Image */}
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <img
                    src={`http://localhost:3005/${post.image}`}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>

                {/* Blog Content */}
                <div style={{ padding: "20px", color: "#333" }}>
                  <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    <Link to={`/blog/${post._id}`} style={{ color: "#2c3e50", textDecoration: "none" }}>
                      {post.title}
                    </Link>
                  </h4>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    {new Date(post.createdAt).toDateString()}
                  </p>
                  <p style={{ marginTop: "10px" }}>
                    {post.description?.substring(0, 100)}...
                  </p>
                  <Link
                    to={`/blog/${post._id}`}
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      padding: "8px 15px",
                      backgroundColor: "#f39c12",
                      color: "#fff",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      textDecoration: "none",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e67e22")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f39c12")}
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
