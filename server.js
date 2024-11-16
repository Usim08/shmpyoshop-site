require('dotenv').config();
const SecretCode = require('./models/secretCode');
const WebsiteVerify = require('./models/website_verify');
const user_save = require('./models/save_user_code');
const goodscode_bool = require('./models/goodNumber');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

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

app.post('/check_secret', async (req, res) => {
    const { secretCode } = req.body;
  
    try {
        const existingCode = await SecretCode.findOne({ secret: secretCode });
        if (!existingCode) {
            return res.status(404).json({ success: false, message: '상품 비밀 코드를 잘못 입력하셨거나, 존재하지 않는 비밀 코드예요.' });
        }

        const gdscode = existingCode.goodsnumber
        const goodscode_for_bool = await goodscode_bool.findOne({ code: gdscode });

        if (goodscode_for_bool.download == "T") {
            if (existingCode.value == true) {
                return res.status(200).json({
                    success: true
                });
            } else {
                return res.status(200).json({
                    success: false,
                    message: '활성화 되지 않은 코드예요. 비밀코드 활성화 페이지에서 코드 활성화를 진행해 주세요.',
                });
            }    
        } else {
            return res.status(200).json({
                success: false,
                message: '해당 상품은 아직 준비중입니다.',
            });
        }
        
    } catch (error) {
        console.error('서버 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

app.post('/check_code_for_true_or_false', async (req, res) => {
    const { secretCode } = req.body;
  
    try {
        const existingCode = await SecretCode.findOne({ secret: secretCode });
        if (!existingCode) {
            return res.status(404).json({ success: false, message: '상품 비밀 코드를 잘못 입력하셨거나, 존재하지 않는 비밀 코드예요.' });
        }
  
        if (existingCode.value == true) {
            return res.status(200).json({
                success: true
            });
        }

  
        res.status(200).json({
            success: false,
            message: "활성화 되지 않은 코드입니다. 비밀코드 활성화 페이지에서 활성화 신청을 진행해 주세요."
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

app.post('/verify-code-second', async (req, res) => {
    const { phoneNumber, verifyCode, secretCode, name } = req.body;

    if (!phoneNumber || !verifyCode) {
        return res.status(400).json({ success: false, message: '전화번호와 인증번호를 모두 입력해 주세요.' });
    }

    try {
        // 인증번호와 전화번호로 데이터베이스에서 확인
        const result = await WebsiteVerify.findOne({ phoneNumber, verifyCode });

        if (result) {
            // 인증이 성공하면, 해당 데이터를 삭제
            await WebsiteVerify.deleteOne({ phoneNumber, verifyCode });

            // 사용자 데이터 찾기
            const save_user_data = await user_save.findOne({ secret: secretCode });

            if (save_user_data.name === name) {
                if (save_user_data.phoneNumber === phoneNumber) {
                    if (save_user_data.secret === secretCode) {
                        return res.json({ success: true, message: "인증이 완료되었습니다." });
                    } else {
                        return res.json({ success: false, message: "회원 정보가 일치하지 않습니다." });
                    }
                } else {
                    return res.json({ success: false, message: "회원 정보가 일치하지 않습니다." });
                }
            } else {
                return res.json({ success: false, message: "회원 정보가 일치하지 않습니다." });
            }
        } else {
            return res.json({ success: false, message: '인증번호를 다시 한 번 확인해 주세요.' });
        }
    } catch (error) {
        console.error('인증번호 확인 중 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다. 다시 시도해 주세요.' });
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

const crypto = require('crypto'); // crypto 모듈을 사용하여 랜덤 값 생성


app.post('/download-file', async (req, res) => {
    try {
        const { secretCode } = req.body; // 요청에서 secretCode 추출
        const existingCode = await SecretCode.findOne({ secret: secretCode });

        if (!existingCode) {
            return res.status(404).json({ success: false, message: "Secret code not found" });
        }

        // 랜덤한 경로 생성
        const randomPath = crypto.randomBytes(90).toString('hex'); 
        const all = `/project/download/${secretCode}/${randomPath}`;

        // 동적으로 생성된 경로에 대한 라우팅 설정
        app.get(all, (req, res) => {
            const filePath = path.join(__dirname, 'project', 'verified_access_for_download_shmpyo_exclusive_goods', `${existingCode.goodsnumber}.html`);

            // 파일이 존재하면 보내고, 그렇지 않으면 404 반환
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath, (err) => {
                    if (err) {
                        res.status(500).json({ success: false, message: "Error sending file" });
                    }
                });

                // 파일 다운로드 후 URL을 더 이상 유효하지 않게 설정 (일회성 처리)
                app._router.stack = app._router.stack.filter((middleware) => middleware.route?.path !== all);
            } else {
                res.status(404).json({ success: false, message: "File not found" });
            }
        });

        // 응답 반환 (클라이언트에서 이 URL을 사용)
        res.json({ success: true, message: all });

    } catch (error) {
        console.error(error); // 에러 로깅
        res.status(500).json({ success: false, message: "Internal server error" }); // 서버 에러 응답
    }
});



app.listen(process.env.PORT || port);
