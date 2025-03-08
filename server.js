require('dotenv').config();
const SecretCode = require('./models/secretCode');
const WebsiteVerify = require('./models/website_verify');
const user_save = require('./models/save_user_code');
const goodscode_bool = require('./models/goodNumber');
const coupon_number_data = require('./models/coupon');
const userinfomation = require('./models/userData');
const buydata = require('./models/web_toss_data');
const discord_web = require('./models/discord_web_verify');
const tsdata = require('./models/trash_data');
const Post = require('./models/Post');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require("body-parser");


const got = require('got');
const port = process.env.PORT || 3019;
const app = express();

app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('몽고디비 연결완료');
      return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
      const collectionNames = collections.map(col => col.name);
      console.log('연결된 컬렉션들:', collectionNames.join(', '));
      console.log(port)
  })
  .catch(err => console.error('몽고디비 연결 실패:', err));



app.get('/posts', async (req, res) => {
    try {
        const { tag } = req.query;
        let posts;
        if (tag) {
            posts = await Post.find({ tag: tag }).sort({ date: -1 });
        } else {
            posts = await Post.find().sort({ date: -1 });
        }
        res.json(posts);
    } catch (err) {
        res.status(500).send("서버 오류");
    }
});


  
// 게시글 상세 페이지 API
app.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }

        // 현재 보고 있는 게시물을 제외하고 최신 4개의 게시물 가져오기
        const recommendedPosts = await Post.find({ _id: { $ne: req.params.id } })
                                           .sort({ date: -1 }) // 최신순 정렬
                                           .limit(4); // 최대 4개

        // 추천 게시물 목록 HTML 생성
        let recommendedHTML = recommendedPosts.map(rp => `
            <div class="recommended-item"> 
                <button class="side_post" onclick="location.href='/post/${rp._id}'">
                    <span class="post-title">${rp.title}</span>
                    <span class="date">${rp.date}</span>
                </button>
            </div>
        `).join('');

        res.send(`
        <html lang="ko">
          <head>
            <title>${post.title} | shmpyoshop</title>
            <link rel="stylesheet" href="/shmpyoBlog/blog_content.css"/>

            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta name="description" content="${post.date}에 올라온 새로운 소식을 확인해 보세요.">
            <meta name="robots" content="max-image-preview:large">
            <link href="/IMG/파비콘.svg" rel="shortcut icon" type="image/x-icon">
            <link rel="canonical" href="https://www.shmpyoshop.com/home">
            <meta property="og:locale" content="ko_KR">
            <meta property="og:site_name" content="# ${post.tag} - 쉼표샵">
            <meta property="og:type" content="website">
            <meta property="og:title" content="${post.title} - 쉼표샵">
            <meta property="og:description" content="${post.date}에 올라온 새로운 소식을 확인해 보세요.">
            <meta property="og:url" content="https://www.shmpyoshop.com/home">
            <meta property="og:image" content="https://media.discordapp.net/attachments/1282189604803444830/1342507726852587580/7d134f0e74b599b0.png?ex=67b9e340&is=67b891c0&hm=6904e632e03d87dbba50a57a111c489a7739896954bfe1a0694361aa5689c343&=&format=webp&quality=lossless">
            <meta property="og:image:width" content="1200">
            <meta property="og:image:height" content="630">
            <meta property="og:image:alt" content="쉼표샵 로고">    

            <meta name="twitter:site" content="https://www.shmpyoshop.com/home">
            <meta name="twitter:title" content="${post.title} - 쉼표샵">
            <meta name="twitter:description" content="${post.date}에 올라온 새로운 소식을 확인해 보세요.">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:image:src" content="https://media.discordapp.net/attachments/1282189604803444830/1342507726852587580/7d134f0e74b599b0.png?ex=67b9e340&is=67b891c0&hm=6904e632e03d87dbba50a57a111c489a7739896954bfe1a0694361aa5689c343&=&format=webp&quality=lossless">
        </head>
        <body>
        <div id="header-container"></div>
        <div class="information_1_section">
            <p class="date_title" id="date"># ${post.tag}, ${post.date}</p>
            <div class="title" id="post-title">${post.title}</div>
            <div class="information_1_flex">
            <div class="box">
        
                <div class="content" id="post-content">
                    <hr>
                    ${post.content}
                </div>
            </div>
            <div class="recommended-container">
                <p class="title_box">📣 새로운 소식</p>
                ${recommendedHTML}
            </div>
            </div>
        </div>


        <iframe src="/footer.html" style="width: 100%; height: 250px; border: none;"></iframe>
        </body>
        <script src="/Js/scrollTop.js"></script>
        <script>
            fetch('/header.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-container').innerHTML = data;
            });
        </script>

        <script src="./Js/scrollTop.js"></script>
        <script>
            fetch('/header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-container').innerHTML = data;
            });
        </script>


        </body>
        <script src="/Js/scrollTop.js"></script>
        <script>
            fetch('/header.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-container').innerHTML = data;
                });
        </script>
        </html>

      `);
    } catch (err) {
        res.status(500).send('서버 오류가 발생했습니다.');
    }
});





app.post('/register', async (req, res) => {
    const { secretCode } = req.body;
  
    try {
        const existingCode = await SecretCode.findOne({ secret: secretCode });
        if (!existingCode) {
            return res.status(404).json({ 
                success: false, 
                message: '상품 비밀 코드를 잘못 입력하셨거나, 존재하지 않는 비밀 코드예요.' 
            });
        }
    
        if (existingCode.force_value == true) {
            return res.status(404).json({ 
                success: false, 
                message: '강제 비활성화된 비밀 코드입니다. 디스코드 고객센터에 문의해 주세요.' 
            });
        }
    
        if (existingCode.value == true) {
            return res.status(200).json({
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

        if (existingCode.force_value == true) {
            return res.status(404).json({ 
                success: false, 
                message: '강제 비활성화된 비밀 코드입니다. 디스코드 고객센터에 문의해 주세요.' 
            });
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

app.post('/check-verifycode-for-discord', async (req, res) => {
    const { verify_code } = req.body;
  
    try {
        const existingCode = await discord_web.findOne({ verifyCode: verify_code });
  
        if (existingCode) {
            const verification = new tsdata({
                userName: existingCode.userName,
                channelId: existingCode.channelId,
                managerId: existingCode.managerId,
            });
            await verification.save();

            await discord_web.deleteOne({ verifyCode: verify_code });


            return res.status(200).json({
                success: true
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "인증번호를 다시 한번 확인해 주세요."
            });
        }

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
        const messageService = new SolapiMessageService("NCSXGE8BBCEZMTS7", "IVEWQULTQQLZNDYYK1OFAUZ5OBMEEBIX");

        await messageService.send({
            "to": phone_number,
            "from": '01067754665',
            "kakaoOptions": {
                "pfId": "KA01PF241022150327686bCbW0aZDu0y",
                "templateId": "KA01TP241125120001547W6BfCUByKaP",
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
            goodsname: existingCode.goodsname
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
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/project/service-terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'project', 'service-terms.html'));
});

app.get('/project/shmpyo-products', (req, res) => {
    res.sendFile(path.join(__dirname, 'project', 'shmpyo-products.html'));
});

app.get('/project/add/goods-code', (req, res) => {
    res.sendFile(path.join(__dirname, 'project','add', 'goods-code.html'));
});

app.get('/project/download/code-for-download', (req, res) => {
    res.sendFile(path.join(__dirname, 'project','download', 'code-for-download.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'project', 'payment', 'shmpyo_product_payment.html'));
});

app.get('/shmpyoBlog/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'shmpyoBlog', 'blog.html'));
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
        const messageService = new SolapiMessageService("NCSXGE8BBCEZMTS7", "IVEWQULTQQLZNDYYK1OFAUZ5OBMEEBIX");

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/product/:id", async (req, res) => {
    try {
        const productId = req.params.id;  // URL에서 제품 ID 가져오기
        const product = await goodscode_bool.findOne({ code: productId });  // DB에서 제품 정보 가져오기

        if (product) {
            res.json({ price: product.price });  // 제품 가격 반환
        } else {
            res.status(404).json({ message: "Product not found" });  // 제품이 없을 경우 404 반환
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });  // 서버 오류 처리
    }
});

app.use(express.static(path.join(__dirname, 'project', 'payment')));

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'project', 'payment', 'shmpyo_product_payment.html'));
});



app.get('/get-product-info/:productCode', async (req, res) => {
    const { productCode } = req.params;
    try {
        // MongoDB에서 상품 정보 조회
        const product = await goodscode_bool.findOne({ code: productCode });

        if (!product) {
            return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
        }

        // 상품 정보 반환
        res.json({
            code: product.code,
            name: product.name,
            price: product.price
        });
    } catch (error) {
        console.error('상품 정보 조회 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});


const axios = require('axios');
const { userInfo } = require('os');
const coupon = require('./models/coupon');


const TOSS_CLIENT_KEY = 'live_gck_vZnjEJeQVxnW7YzN6moz8PmOoBN0';  // 테스트용 키, 실제로는 비밀
const TOSS_SECRET_KEY = 'live_gsk_ZLKGPx4M3M9JQGXGgj5w3BaWypv1';  // 실제 비밀키는 안전하게 관리해야 합니다.

app.get('/get-client-key', (req, res) => {
    // 실제 운영에서는 클라이언트 키를 안전하게 관리해야 합니다.
    const clientKey = TOSS_CLIENT_KEY;  // 서버에서 클라이언트 키를 전달
    res.json({ clientKey });
});

// 서버 측에서 토스 API 호출 예시
app.post('/create-payment', async (req, res) => {
    const { orderId, orderName, amount, customerName, customerPhone } = req.body;

    const clientKey = TOSS_CLIENT_KEY; // 실제 사용시 비공개 환경 변수로 설정
    const product = await goodscode_bool.findOne({ name: orderName });
    if (product.price == amount) {
        try {
            
            const response = await axios.post('https://api.tosspayments.com/v1/payments', {
                orderId,
                orderName,
                amount,
                customerName,
                customerPhone
            });
    
            res.json(response.data);  // 결제 성공 시 클라이언트에 데이터 전달
        } catch (error) {
            res.status(500).json({ error: '결제 생성에 실패했습니다.' });
        }
    }

});


app.post("/confirm", async function (req, res) {
    const { paymentKey, orderId, amount, orderName, userName, userphone, coupon, roblox } = req.body;

    const widgetSecretKey = TOSS_SECRET_KEY;
    const encryptedSecretKey = "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function calculateDiscount(originalPrice, discountPercentage) {
        const discountAmount = originalPrice * (discountPercentage / 100);
        const finalPrice = originalPrice - discountAmount;
        return { finalPrice };
    }

    try {
        const product = await goodscode_bool.findOne({ name: orderName });
        const cp = await coupon_number_data.findOne({ couponId: coupon });
        const discountPercentage = cp ? Number(cp.sale) : 0; // 쿠폰이 없으면 할인 0%
        const test = calculateDiscount(Number(product.price), discountPercentage);

        if (Number(amount) !== product.price) {
            if (coupon) {
                // 쿠폰 사용 시, 할인 후 금액을 비교
                if (test.finalPrice !== Number(amount)) {
                    return res.status(400).json({ message: "쿠폰 적용 후 결제 금액이 맞지 않습니다. 다시 시도해 주세요." });
                }
            } else {
                return res.status(400).json({ message: "결제 금액이 맞지 않습니다. 다시 시도해 주세요." });
            }
        }

        const rb = await userinfomation.findOne({ playerName: roblox });

        const response = await got.post("https://api.tosspayments.com/v1/payments/confirm", {
            headers: {
                Authorization: encryptedSecretKey,
                "Content-Type": "application/json",
            },
            json: {
                orderId: orderId,
                amount: amount,
                paymentKey: paymentKey,
            },
            responseType: "json",
        });
        
        const paymentData = response.body;
        if (rb === null) {
            return res.status(200).json({
                confirm: true, // confirm 창을 띄워야 한다는 신호
                message: "회원가입을 진행하지 않으신 것 같은데 이대로 구매할까요?"
            });
        }
        

        const verifyCode = generateRandomString(12);
        const verification = new SecretCode({
            secret: verifyCode,
            userid: rb.discordId,
            value: false,
            goodsnumber: product.code,
            goodsname: product.name,
            force_value: false,
            phoneNumber:userphone
        });
        await verification.save();

        const web_ts = new buydata({
            phoneNumber: userphone,
            orderId: orderId,
            orderName: orderName,
            paymentKey: paymentKey,
            amount: parseInt(paymentData.totalAmount).toLocaleString() + '원',
            customerName: userName,
            roblox: roblox,
            secret: verifyCode,
            couponNumber: coupon,
            userid: rb.discordId
        });
        await web_ts.save();



        // 결제 성공 시 리다이렉트 URL
        const redirectUrl = `/order-success?orderId=${paymentData.orderId}&amount=${paymentData.totalAmount}&orderName=${paymentData.orderName}&customerName=${userName}&customerMobilePhone=${userphone}`;
        
        // 첫 번째 응답을 보냄
        res.json({
            redirect_path: redirectUrl,
        });

        const { SolapiMessageService } = require('solapi');
        const messageService = new SolapiMessageService("NCSXGE8BBCEZMTS7", "IVEWQULTQQLZNDYYK1OFAUZ5OBMEEBIX");

        await messageService.send({
            "to": userphone,
            "from": '01067754665',
            "kakaoOptions": {
                "pfId": "KA01PF241022150327686bCbW0aZDu0y",
                "templateId": "KA01TP241211145013771qw8QjRQ28To",
                "variables": {
                    "#{주문번호}": paymentData.orderId,
                    "#{이름}": userName,
                    "#{상품명}": orderName,
                    "#{결제금액}": parseInt(paymentData.totalAmount).toLocaleString() + '원',
                }
            }
        });

        await messageService.send({
            "to": userphone,
            "from": '01067754665',
            "kakaoOptions": {
                "pfId": "KA01PF241022150327686bCbW0aZDu0y",
                "templateId": "KA01TP241211144407906VdVbIMOMntV",
                "variables": {
                    "#{이름}": userName,
                    "#{상품이름}": orderName,
                    "#{비밀코드}": verifyCode,
                }
            }
        });

    } catch (error) {
        console.error("Error during payment confirmation:", error);

        // 이미 응답을 보냈다면 추가 응답을 보내지 않도록 처리
        if (!res.headersSent) {
            res.status(500).json({ message: "서버 오류가 발생했습니다." });
        }
    }
});


app.post('/check_coupon_code', async (req, res) => {
    const { coupon_nb, rbname, all_price } = req.body;

    function calculateDiscount(originalPrice, discountPercentage) {
        const discountAmount = originalPrice * (discountPercentage / 100);
        const finalPrice = originalPrice - discountAmount;
    
        return {
            discountAmount: discountAmount,
            finalPrice: finalPrice
        };
    }

    try {
        // 쿠폰 번호 확인
        const existingCode = await coupon_number_data.findOne({ couponId: coupon_nb });
        // 유저 정보 확인
        const rbdiscord = await userinfomation.findOne({ playerName: rbname });

        if (!existingCode) {
            return res.status(404).json({ success: false, message: '쿠폰번호가 올바르지 않습니다.' });
        }

        if (rbdiscord.discordId === existingCode.playerId) {
            // 할인 계산
            const { discountAmount, finalPrice } = calculateDiscount(Number(all_price), Number(existingCode.sale));
            
            return res.status(200).json({
                success: true,
                finalPrice: finalPrice.toLocaleString(), // 할인 적용된 최종 금액
                discountAmount: discountAmount.toLocaleString() // 할인 금액
            });
        } else {
            return res.status(404).json({ success: false, message: '등록된 쿠폰 이용자가 아닙니다.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: '서버 에러가 발생했습니다.' });
    }
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // views 디렉토리 설정

// 첫 번째 라우트: 인증 코드 페이지
app.get('/verify/:num', async (req, res) => {
    const num = req.params.num;
    const data = await discord_web.findOne({ webCode: num });

    if (data) {
        res.render('verify-user', { username: data.userName });
    } else {
        res.status(404).send('만료된 페이지입니다.');
    }
});

// 두 번째 라우트: 인증 코드 입력 후 바로 인증 페이지
app.get('/verify/:num/:uniq', async (req, res) => {
    const num = req.params.num;
    const uniq = req.params.uniq;

    // 웹 코드와 유니크 아이디로 데이터 조회
    const data = await discord_web.findOne({ webCode: num });
    const dataaa = await discord_web.findOne({ unique_id: uniq });

    if (data && dataaa) {
        res.render('fast-verify', { username: data.userName });
        const verification = new tsdata({
            userName: data.userName,
            channelId: data.channelId,
            managerId: data.managerId,
        });
        await verification.save();

        await discord_web.deleteOne({ webCode: num });
    } else {
        res.status(404).send('만료된 페이지입니다.');
    }
});







    // try {
    //     const response = await got.post("https://api.tosspayments.com/v1/payments/confirm", {
    //         headers: {
    //             Authorization: encryptedSecretKey,
    //             "Content-Type": "application/json",
    //         },
    //         json: {
    //             orderId: orderId,
    //             amount: amount,
    //             paymentKey: paymentKey,
    //         },
    //         responseType: "json",
    //     });

    //     const paymentData = response.body;

    //     // 결제 성공 시, 리다이렉트 URL을 JSON 형식으로 응답
    //     const redirectUrl = `/order-success?orderId=${paymentData.orderId}&amount=${paymentData.totalAmount}&orderName=${paymentData.orderName}&userName=${userName}`;

    //     // 서버가 클라이언트로 리다이렉트 정보와 함께 JSON 응답
    //     res.send({
    //         name: "StackOverFlow",
    //         reason: "Need help!",
    //         redirect_path: redirectUrl,
    //     });

    // } catch (error) {
    //     // 결제 실패 비즈니스 로직
    //     console.log(error.response.body);
    //     res.status(error.response.statusCode).json(error.response.body);
    // }
// });





// app.post("/confirm", function (req, res) {
//     const { paymentKey, orderId, amount, customerName, customerMobilePhone } = req.body;

//     const widgetSecretKey = "test_gsk_DpexMgkW36bjoRJDwNg93GbR5ozO";
//     const encryptedSecretKey =
//       "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

//     // 결제 승인 요청
//     got
//       .post("https://api.tosspayments.com/v1/payments/confirm", {
//         headers: {
//           Authorization: encryptedSecretKey,
//           "Content-Type": "application/json",
//         },
//         json: {
//           orderId: orderId,
//           amount: amount,
//           paymentKey: paymentKey,
//         },
//         responseType: "json",
//       })
//       .then(function (response) {
//         const paymentData = response.body;

//         // 결제 성공 시, 리다이렉트 URL을 JSON 형식으로 응답
//         const redirectUrl = `/order-success?orderId=${paymentData.orderId}&amount=${paymentData.totalAmount}&orderName=${paymentData.orderName}&customerName=${customerName}&customerMobilePhone=${customerMobilePhone}`;

//         // 서버가 클라이언트로 리다이렉트 정보와 함께 JSON 응답
//         res.send({
//           name: "StackOverFlow",
//           reason: "Need help!",
//           redirect_path: redirectUrl,
//         });
//       })
//       .catch(function (error) {
//         console.error("결제 확인 오류:", error.response.body);

//         // 결제 실패 시, 실패 메시지를 클라이언트로 반환
//         res.status(error.response.statusCode || 500).json({
//           message: "결제 확인 중 오류가 발생했습니다.",
//           error: error.response.body,
//         });
//       });
// });





// // 결제 완료 페이지 (GET 요청 처리)
// app.get("/order-success", function (req, res) {
//     const { orderId, amount, orderName, customerName, customerMobilePhone } = req.query;

//     // order-success.html 파일 경로 확인
//     const successPagePath = path.join(__dirname, 'project', 'payment', 'order_success.html'); // 파일 경로 수정

//     // HTML 파일을 전달
//     res.sendFile(successPagePath, {
//     headers: {
//         'Content-Type': 'text/html'
//     }
//     });
// });




app.listen(process.env.PORT || port);
