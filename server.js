require('dotenv').config();
const SecretCode = require('./models/secretCode');
const WebsiteVerify = require('./models/website_verify');
const user_save = require('./models/save_user_code');
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
            return res.status(404).json({ success: false, message: '상품 비밀 코드를 잘못 입력하셨거나, 존재하지 않는 비밀 코드예요.' });
        }
  
        if (existingCode.value == true) {
            res.status(200).json({
                success: false,
                message: '이미 등록된 비밀 코드예요. 파일 다운로드 페이지에서 파일을 다운로드 받으실 수 있습니다.',
            });
        }

  
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error('서버 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});


app.post('/all-done', async (req, res) => {
    const { secretCode, name, phone_number, where } = req.body; // where는 게임 링크

    try {
        const existingCode = await SecretCode.findOne({ secret: secretCode });

        if (!existingCode) {
            return res.status(404).json({ success: false, message: '비밀 코드가 없습니다.' });
        }

        const { SolapiMessageService } = require('solapi');
        const messageService = new SolapiMessageService("NCSXGE8BBCEZMTS7", "L7ZWWCTC7IA46F2VTPT6EHXBXDA73LMZ");

        await messageService.send({
            "to": phone_number,
            "from": '01067754665',
            "kakaoOptions": {
                "pfId": "KA01PF241022150327686bCbW0aZDu0y",
                "templateId": "KA01TP241026144535317dadfKhxSXs9",
                "variables": {
                    "#{이름}": name,
                    "#{비밀코드}": secretCode,
                    "#{상품이름}": existingCode.goodsname
                }
            }
        });

        existingCode.value = true;
        await existingCode.save();

        const verification = new user_save({
            phoneNumber: phone_number, // 스키마에 맞게 수정
            discordId: existingCode.userid, // 스키마에 맞게 수정
            secret: secretCode, // 스키마에 맞게 수정
            name: name,
            gameLink: where, // where을 gameLink로 매핑
            goodscode: existingCode.goodsnumber, // 스키마에 맞게 수정
            goodsname: existingCode.goodsname // 스키마에 맞게 수정
        });
        await verification.save();

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error('서버 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});



app.get('/project/verified_access_for_download_shmpyo_exclusive_goods/:secretCode', async (req, res) => {
    const { secretCode } = req.params;

    try {
        const existingCode = await SecretCode.findOne({ secret: secretCode });
        if (!existingCode) {
            return res.status(404).send('존재하지 않는 비밀 코드입니다.');
        }

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

app.get('/project/service-terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'project', 'service-terms.html'));
});

app.get('/project/shmpyo-goods', (req, res) => {
    res.sendFile(path.join(__dirname, 'project', 'shmpyo-goods.html'));
});

app.get('/project/add/goods-code', (req, res) => {
    res.sendFile(path.join(__dirname, 'project','add', 'goods-code.html'));
});



app.post('/send-verify-code', async (req, res) => {
    const { phoneNumber, name } = req.body;

    try {
        // 기존 데이터 삭제
        await WebsiteVerify.deleteOne({ phoneNumber });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();  // 6자리 인증번호 생성
        const verification = new WebsiteVerify({ phoneNumber, verifyCode });
        await verification.save();

        const { SolapiMessageService } = require('solapi');
        const messageService = new SolapiMessageService("NCSXGE8BBCEZMTS7", "L7ZWWCTC7IA46F2VTPT6EHXBXDA73LMZ");

        await messageService.send({
        "to": phoneNumber,
        "from": '01067754665',
        "kakaoOptions": {
            "pfId": "KA01PF241022150327686bCbW0aZDu0y",
            "templateId": "KA01TP241026144808928N0zKLn26eca",
            "variables": {
                "#{이름}": name,
                "#{인증번호}":verifyCode
            }
        }
        });

        res.json({ success: true, message: '인증번호가 발송되었습니다.' });

        setTimeout(async () => {
            await WebsiteVerify.deleteOne({ phoneNumber, verifyCode });
            console.log(`인증번호가 만료되어 삭제되었습니다: ${phoneNumber}`);
        }, 180000);  // 3분 = 180,000ms

    } catch (error) {
        console.error('인증번호 발송 중 오류:', error);
        res.json({ success: false, message: '인증번호 발송에 실패했습니다.' });
    }
});


app.post('/verify-code', async (req, res) => {
    const { phoneNumber, verifyCode } = req.body;

    if (!phoneNumber || !verifyCode) {
        return res.status(400).json({ success: false, message: '전화번호와 인증번호를 모두 입력해 주세요.' });
    }

    try {
        const result = await WebsiteVerify.findOne({ phoneNumber, verifyCode });

        if (result) {
            // 인증이 성공하면 MongoDB에서 데이터 삭제
            await WebsiteVerify.deleteOne({ phoneNumber, verifyCode });
            res.json({ success: true});
        } else {
            res.json({ success: false, message: '인증번호를 다시 한 번 확인해 주세요.' });
        }
    } catch (error) {
        console.error('인증번호 확인 중 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다. 다시 시도해 주세요.' });
    }
});




app.listen(process.env.PORT || port);
