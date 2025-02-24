// PostList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 게시글 목록을 불러오는 API 호출
    axios.get('https://www.shmpyoshop.com/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <div>
      <h1>게시글 목록</h1>
      <ul>
        {posts.length > 0 ? posts.map(post => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </li>
        )) : <li>게시글이 없습니다.</li>}
      </ul>
    </div>
  );
};

export default PostList;
