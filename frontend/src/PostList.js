import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3019/posts").then((res) => {
      setPosts(res.data);
    });
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>게시글 목록</h1>
      {posts.map((post) => (
        <div key={post._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
          <Link to={`/post/${post._id}`} style={{ textDecoration: "none", color: "black" }}>
            <h3>{post.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostList;
