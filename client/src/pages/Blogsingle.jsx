import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../Api/axiosInstance/axiosInstance";

// Fetch single blog
const fetchSingleBlog = async (id) => {
  const res = await axiosInstance.get(`/blog/${id}`);
  return res.data.blog;
};

// Fetch comments
const fetchComments = async (id) => {
  const res = await axiosInstance.get(`/blog/${id}/comments`);
  return res.data.comments;
};

// Post comment
const addComment = async ({ id, comment }) => {
  const res = await axiosInstance.post(`/blog/${id}/comment`, { comment });
  return res.data;
};

const BlogSingle = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
const username=localStorage.getItem('username')
console.log(username);

  // Blog query
  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchSingleBlog(id),
    enabled: !!id,
  });

  // Comments query
  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id),
    enabled: !!id,
  });

  // Comment mutation
  const mutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", id]);
      setNewComment("");
    },
  });

  if (isLoading) return <p className="text-center mt-5">Loading blog...</p>;
  if (isError) return <p className="text-center mt-5 text-danger">Error loading blog</p>;

  return (
    <div className="container my-5">
      <Link to="/blogs" className="btn btn-outline-dark mb-4">
        ⬅ Back to Blogs
      </Link>

      <div className="row g-4">
        {/* Comments Section - LEFT */}
        <div className="col-lg-4 order-lg-1 order-2">
          <div className="p-3 bg-white rounded shadow-sm border">
            <h4 className="mb-3">💬 Comments</h4>

            {/* Comment Form */}
            <div className="mb-4">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                className="btn btn-dark mt-2 w-100"
                onClick={() => mutation.mutate({ id, comment: newComment })}
                disabled={mutation.isLoading || !newComment.trim()}
              >
                {mutation.isLoading ? "Posting..." : "Post Comment"}
              </button>
            </div>

            {/* Comment List */}
            <div className="list-group">
              {comments.length === 0 && (
                <p className="text-muted">No comments yet. Be the first!</p>
              )}

              {comments.map((c, index) => {
                // If backend returns object comments
                if (typeof c === "object" && c.comment) {
                  return (
                    <div key={c._id || index} className="list-group-item border-0 border-bottom">
                      <strong>{c.user?.username || "Anonymous"}:</strong>
                      <p className="mb-1">{c.comment}</p>
                      <small className="text-muted">
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                      </small>
                    </div>
                  );
                }

                // If backend returns only string comments
                return (
                  <div key={index} className="list-group-item border-0 border-bottom">
                    <strong>Anonymous Comment</strong>
                    <p className="mb-1">{c}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Blog Section - RIGHT */}
        <div className="col-lg-8 order-lg-2 order-1">
          <div className="card shadow-sm border-0">
            <img
              src={`http://localhost:3005/${blog.image}`}
              alt={blog.title}
              className="card-img-top"
              style={{ maxHeight: "450px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h2 className="card-title">{blog.title}</h2>
              <p className="text-muted mb-3">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="card-text fs-5">{blog.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSingle;
