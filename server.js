require('dotenv').config();
const SecretCode = require('./models/secretCode');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

const port = process.env.PORT || 3019;
const app = express();


app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());
app.use(session({
    secret: 'secret', // 비밀 키 설정
    resave: false,
    saveUninitialized: false
}));

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
;


passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.get('/auth/discord', (req, res) => {
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=1193950006714040461&response_type=code&redirect_uri=${encodeURIComponent('https://www.shmpyoshop.com/')} &scope=identify+email+guilds`;
    res.redirect(discordAuthUrl);
});


app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
      // 로그인 성공 후 홈 페이지로 리다이렉트
      res.redirect('/home');
  }
);

app.post('/register', async (req, res) => {
    const { secretCode } = req.body;
    const userId = req.user.id; // 디스코드 유저 ID

    try {
        const existingCode = await SecretCode.findOne({ secret: secretCode });
        if (!existingCode) {
            return res.status(404).json({ success: false, message: '시크릿 코드를 잘못 입력하셨거나, 존재하지 않는 시크릿 코드예요.' });
        }

        existingCode.ID = userId; // 디스코드 유저 ID 저장
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
