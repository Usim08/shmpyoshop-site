require('dotenv').config();
const SecretCode = require('./models/secretCode');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

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

// 비밀 코드 등록 처리
app.post('/register', async (req, res) => {
    const { secretCode } = req.body;
  
    try {
        const existingCode = await SecretCode.findOne({ secret: secretCode });
        if (!existingCode) {
            return res.status(404).json({ success: false, message: '상품 비밀 코드를 잘못 입력하셨거나, 존재하지 않는 비밀 코드예요.' });
        }
  
        if (existingCode.userid) {
            return res.status(400).json({ success: false, message: '이미 등록된 비밀 코드입니다. 코드를 다시 한번 확인해주세요!' });
        }
  
        existingCode.userid = "테스트"; // 나중에 실제 유저 ID로 설정
        await existingCode.save();
  
        // 성공 응답과 함께 3초 후 이동할 페이지 경로를 전달
        res.status(200).json({
            success: true,
            message: '비밀 코드 등록 완료',
            redirectUrl: `/project/verified_access_for_download_shmpyo_exclusive_goods/${secretCode}`
        });
    } catch (error) {
        console.error('서버 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});
  

// 비밀 코드 기반으로 다운로드 페이지 접근
app.get('/project/verified_access_for_download_shmpyo_exclusive_goods/:secretCode', async (req, res) => {
    const { secretCode } = req.params;

    try {
        const existingCode = await SecretCode.findOne({ secret: secretCode });
        if (!existingCode) {
            return res.status(404).send('존재하지 않는 비밀 코드입니다.');
        }

        // 비밀 코드가 유효하면 다운로드 페이지로 이동
        res.sendFile(path.join(__dirname, 'project', 'verified_access_for_download_shmpyo_exclusive_goods', 'SP_XVTAN.html'));
    } catch (error) {
        console.error('서버 오류:', error);
        res.status(500).send('서버 오류');
    }
});

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/project/add/goods-code', (req, res) => {
    res.sendFile(path.join(__dirname, 'project', 'add', 'goods-code.html'));
});

app.get('/project/service-terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'project', 'service-terms.html'));
});

app.get('/project/shmpyo-goods', (req, res) => {
    res.sendFile(path.join(__dirname, 'project', 'shmpyo-goods.html'));
});

app.listen(process.env.PORT || port);
