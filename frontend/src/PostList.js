import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("https://www.shmpyoshop.com/posts").then((res) => {
      setPosts(res.data);
    });
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h1>게시글 목록</h1>
      {posts.map((post) => (
        <div key={post._id} style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
          <h2>
            <Link to={`/post/${post._id}`} style={{ textDecoration: "none", color: "blue" }}>
              {post.title}
            </Link>
          </h2>
        </div>
      ))}
    </div>
  );
};

export default PostList;
