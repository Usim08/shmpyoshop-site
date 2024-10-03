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

app.post('/register', async (req, res) => {
  const { secretCode } = req.body;

  try {
      const existingCode = await SecretCode.findOne({ secret: secretCode });
      if (!existingCode) {
          return res.status(404).json({ success: false, message: '시크릿 코드를 잘못 입력하셨거나, 존재하지 않는 시크릿 코드예요.' });
      }

      if (existingCode.userid) {
          return res.status(400).json({ success: false, message: '이미 있는 코드예요.' });
      }

      existingCode.userid = "테스트";
      await existingCode.save();
      res.status(200).json({ success: true, message: '시크릿 코드 등록 완료' });
  } catch (error) {
      console.error('서버 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류' });
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
