// PostList.js (수정된 부분)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 게시글 목록을 불러오는 API 호출
    axios.get('https://www.shmpyoshop.com/posts') // API 주소는 배포된 주소로 사용
      .then(response => {
        setPosts(response.data); // 받아온 게시글 목록을 상태에 저장
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <div>
      <h1>게시글 목록</h1>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            {/* HTML 콘텐츠 렌더링 */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;