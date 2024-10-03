require('dotenv').config();
const SecretCode = require('./models/secretCode'); // 모델 import
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // CORS 패키지 추가

const port = process.env.PORT || 3019; // 환경 변수에서 포트 가져오기
const app = express();

// 미들웨어 설정
app.use(cors()); // CORS 미들웨어 사용
app.use(express.static(__dirname)); // 정적 파일 제공
app.use(express.json()); // JSON 요청을 처리하기 위한 미들웨어

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('몽고디비 연결완료');
      return mongoose.connection.db.listCollections().toArray(); // 컬렉션 목록 조회
  })
  .then(collections => {
      const collectionNames = collections.map(col => col.name);
      console.log('연결된 컬렉션들:', collectionNames.join(', '));
  })
  .catch(err => console.error('몽고디비 연결 실패:', err));

// POST 요청을 처리하는 /register 경로
app.post('/register', async (req, res) => {
  const { secretCode } = req.body;


  try {
      // secret 필드를 사용하여 시크릿 코드 검색
      const existingCode = await SecretCode.findOne({ secret: secretCode });
      if (!existingCode) {
          return res.status(404).json({ success: false, message: '시크릿 코드가 존재하지 않습니다.' });
      }

      existingCode.ID = "테스트"; // ID 필드에 "테스트" 저장
      await existingCode.save();
      res.status(200).json({ success: true, message: '시크릿 코드 등록 완료' });
  } catch (error) {
      console.error('서버 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 홈 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// 서버 시작
app.listen(process.env.PORT||port)