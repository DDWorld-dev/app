// import express from 'express';
// import bodyParser from 'body-parser';
// import axios from 'axios';

// const app = express();
// const PORT = 3001; // Или любой другой порт
// const TELEGRAM_BOT_TOKEN = '';
// const TELEGRAM_CHANNEL_ID = '@solidiks';

// app.use(bodyParser.json());

// async function isSubscribed(userId) {
//     try {
//         const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${TELEGRAM_CHANNEL_ID}&user_id=${userId}`;
//         const response = await axios.get(url);
//         const status = response.data.result.status;
//         return ['member', 'administrator', 'creator'].includes(status);
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }

// app.post('/check_subscription', async (req, res) => {
//     const { user_id } = req.body;
//     const subscribed = await isSubscribed(user_id);
//     res.json({ subscribed });
// });


// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });







// <script src="https://telegram.org/js/telegram-web-app.js"></script>


// server {
//     listen 80;
//     server_name subgameserf.ru www.subgameserf.ru;

//     root /mainProject/my-twa/dist;
//     index index.html;

//     location / {
//         try_files $uri /index.html;
//     }

//     location /api/ {
//         proxy_pass https://localhost:4000/;
//         proxy_http_version 1.1;
//         proxy_set_header Upgrade $http_upgrade;
//         proxy_set_header Connection 'upgrade';
//         proxy_set_header Host $host;
//         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//         proxy_cache_bypass $http_upgrade;

//         # Add CORS headers
//         add_header Access-Control-Allow-Origin https://subgameserf.ru;
//         add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
//         add_header Access-Control-Allow-Credentials true;
//         add_header Access-Control-Allow-Headers 'Authorization, X-CSRF-Token, Content-Type';

//         # Handle preflight requests
//         if ($request_method = OPTIONS) {
//             add_header Access-Control-Allow-Origin https://subgameserf.ru;
//             add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
//             add_header Access-Control-Allow-Credentials true;
//             add_header Access-Control-Allow-Headers 'Authorization, X-CSRF-Token, Content-Type';
//             add_header Content-Length 0;
//             add_header Content-Type text/plain;
//             return 204;
//         }
//     }

//     # Redirect HTTP to HTTPS
//     if ($scheme != "https") {
//         return 301 https://$host$request_uri;
//     }
// }

// server {
//     listen 443 ssl;
//     server_name subgameserf.ru www.subgameserf.ru;

//     root /mainProject/my-twa/dist;
//     index index.html;

//     ssl_certificate /etc/nginx/ssl/certificate.crt;
//     ssl_certificate_key /etc/nginx/ssl/certificate.key;
//     ssl_trusted_certificate /etc/nginx/ssl/certificate_ca.crt;
//     include /etc/letsencrypt/options-ssl-nginx.conf;
//     ssl_dhparam /etc/ssl/certs/dhparam.pem;

//     location / {
//         try_files $uri /index.html;
//     }

//     location /api/ {
//         proxy_pass https://localhost:4000/;
//         proxy_http_version 1.1;
//         proxy_set_header Upgrade $http_upgrade;
//         proxy_set_header Connection 'upgrade';
//         proxy_set_header Host $host;
//         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//         proxy_cache_bypass $http_upgrade;

//         # Add CORS headers
//         add_header Access-Control-Allow-Origin https://subgameserf.ru;
//         add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
//         add_header Access-Control-Allow-Credentials true;
//         add_header Access-Control-Allow-Headers 'Authorization, X-CSRF-Token, Content-Type';

//         # Handle preflight requests
//         if ($request_method = OPTIONS) {
//             add_header Access-Control-Allow-Origin https://subgameserf.ru;
//             add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
//             add_header Access-Control-Allow-Credentials true;
//             add_header Access-Control-Allow-Headers 'Authorization, X-CSRF-Token, Content-Type';
//             add_header Content-Length 0;
//             add_header Content-Type text/plain;
//             return 204;
//         }
//     }
// }












// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import pkg from 'pg';
// import { WebSocketServer } from 'ws';
// import fs from 'fs';
// import https from 'https';
// import csurf from 'csurf';
// import cookieParser from 'cookie-parser';

// const { Pool } = pkg;

// const privateKey = fs.readFileSync('/etc/nginx/ssl/certificate.key', 'utf8');
// const certificate = fs.readFileSync('/etc/nginx/ssl/certificate.crt', 'utf8');
// const ca = fs.readFileSync('/etc/nginx/ssl/certificate_ca.crt', 'utf8');

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// };

// const port = 4000;

// const pool = new Pool({
//   user: 'user1',
//   host: '79.174.88.131',
//   database: 'user1',
//   password: 'BMIhrm/3S46(NM5h.#a()zav',
//   port: 15186,
// });

// const corsOptions = {
//   origin: 'https://subgameserf.ru', // Разрешаем запросы только с вашего домена
//   credentials: true, // Поддержка авторизации сессий и куки
// };

// const app = express();

// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(cors(corsOptions));

// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const httpsServer = https.createServer(credentials, app);

// const server = httpsServer.listen(port, '0.0.0.0', () => {
//   console.log(`Server running on https://localhost:${port}`);
// });

// const wss = new WebSocketServer({ server });
// wss.on('connection', (ws) => {
//   console.log('Client connected');
// });

// // Маршрут для получения CSRF токена
// app.get('/form', (req, res) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.json({ csrfToken: req.csrfToken() });
// });

// // Маршрут для создания аккаунта
// app.post('/create-account', csrfProtection, async (req, res) => {
//   const { account, chatid, referal } = req.body;
//   res.json({ success: true, message: 'Account created successfully', balance: 123456789, balanceOas: 987654321 });
// });
