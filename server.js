require('dotenv').config();
const SecretCode = require('./models/secretCode');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // JWT 토큰 발급

const port = process.env.PORT || 3019;
const app = express();

app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('몽고디비 연결완료');
      return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
      const collectionNames = collections.map(col => col.name);
      console.log('연결된 컬렉션들:', collectionNames.join(', '));
  })
  .catch(err => console.error('몽고디비 연결 실패:', err));

// 시크릿 코드 검증 및 토큰 발급
app.post('/register', async (req, res) => {
  const { secretCode } = req.body;

  try {
      const existingCode = await SecretCode.findOne({ secret: secretCode });
      if (!existingCode) {
          return res.status(404).json({ success: false, message: '상품 비밀 코드를 잘못 입력하셨거나, 존재하지 않는 비밀 코드예요.' });
      }

      if (existingCode.userid) {
          return res.status(400).json({ success: false, message: '이미 등록된 비밀 코드입니다. 코드를 다시 한번 확인해 주세요!' });
      }

      // 사용자에게 토큰 발급 (토큰에는 secretCode 포함)
      const token = jwt.sign({ secretCode }, process.env.JWT_SECRET, { expiresIn: '1h' });
      existingCode.userid = "테스트"; // 디스코드 ID 저장
      await existingCode.save();

      res.status(200).json({ success: true, message: '비밀 코드 등록 완료', token });
  } catch (error) {
      console.error('서버 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 파일 다운로드를 위한 인증된 경로
app.get('/download', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: '접근 권한이 없습니다. 비밀 코드를 입력해주세요.' });
    }

    try {
        // 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 검증이 완료되면 파일 제공
        const filePath = path.join(__dirname, 'project', 'verified_access_for_download_shmpyo_exclusive_goods', 'SP-XVTAN.html');
        res.sendFile(filePath);
    } catch (error) {
        console.error('토큰 검증 실패:', error);
        res.status(403).json({ message: '잘못된 인증입니다.' });
    }
});


app.listen(process.env.PORT || port);
