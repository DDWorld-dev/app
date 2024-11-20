import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import { createHmac } from "node:crypto";
import csurf from "csurf"
import cookieParser from "cookie-parser"
const { Pool } = pkg;

const privateKey = fs.readFileSync('/etc/nginx/ssl/certificate.key', 'utf8');
const certificate = fs.readFileSync('/etc/nginx/ssl/certificate.crt', 'utf8');
const ca = fs.readFileSync('/etc/nginx/ssl/certificate_ca.crt', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const port = 4000;

const pool = new Pool({
  user: '1',
  host: '1',
  database: '1',
  password: '1',
  port: 1,
});

const corsOptions = {
  origin: 'https://subgameserf.ru', // Разрешаем запросы только с вашего домена
  credentials: true, // Поддержка авторизации сессий и куки
};

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const httpsServer = https.createServer(credentials, app);

const server = httpsServer.listen(port, '0.0.0.0', () => {
  console.log(`Server running on https://localhost:${port}`);
});

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('Client connected');
});

app.get('/form', (req, res) => {
  // Отправьте CSRF токен клиенту
  console.log(req.csrfToken());
  res.json({ csrfToken: req.csrfToken() });
});

const  adminAccount = "EQCUs2k9DWlrpMmPHxroiMdpc96DCvAcsut0Nd5T6mL3bw0s"
const games = {};

const startGame = (gameId, account, accountName, amountbet, valute) => {
  if (games[gameId] && games[gameId].timerRunning) {
    games[gameId].lastBetter = account;
    games[gameId].lastBetterName = accountName;
    return;
  }
  pool.query(`DELETE FROM bethistory_${gameId}`)
    .then(() => {
      console.log(`History for ${gameId} cleared successfully`);
    })
    .catch(err => {
      console.error(`Error clearing history for ${gameId}:`, err);
    });



    pool.query(`INSERT INTO bethistory_${gameId} (account, balancebet) VALUES ($1, $2)`, [accountName, amountbet])
       .then(() => {
      console.log(`History for ${gameId} add successfully`);
    })
    .catch(err => {
      console.error(`Error add history for ${gameId}:`, err);
    });



  const gameState = {
    timerRunning: true,
    remainingTime: getRandomTime(10, 60),
    timerInterval: null,
    lastBetter: account,
    lastBetterName: accountName,
    timerStart: 60,
    isTon: 1
  };
  
  games[gameId] = gameState;

  if(valute == '2'){
    games[gameId].isTon = 2
  }

  console.log(gameState.remainingTime); // Случайное число от 10 секунд до 2 минут
  broadcastToClients({ type: 'timerUpdateFirst', gameId, time: gameState.timerStart });

  gameState.timerInterval = setInterval(async () => {
    //console.log(gameState.timerInterval);
    gameState.remainingTime -= 1;
    gameState.timerStart -= 1;
    broadcastToClients({ type: 'timerUpdate', gameId, time: gameState.timerStart });

    if (gameState.remainingTime <= 0) {
      clearInterval(gameState.timerInterval);
      gameState.timerRunning = false;

      // Подсчет общего balancebet и удаление всех записей из accountsbet для данной игры
      try {
        const result = await pool.query(`SELECT SUM(amountbet) as totalbalancebet FROM accountsbet_${gameId}`);
        const totalBalanceBet = result.rows[0].totalbalancebet || 0;

        let adminShare = 0;
        let userShare = 0;
        let referalShare = 0;

        if (gameState.lastBetter) {
          // Проверка значения referal для lastBetter
          const referalResult = await pool.query('SELECT referal FROM accounts WHERE account = $1', [gameState.lastBetter]);
          const referal = referalResult.rows[0].referal;
          console.log("referal", referal);
          if (referal !== "-1" && referal !== "0") {
            // Распределение: 5% referal, 5% adminAccount
            referalShare = totalBalanceBet * 0.05;
            adminShare = totalBalanceBet * 0.05;
            userShare = totalBalanceBet * 0.9;
          } else {
            // Распределение: 10% adminAccount
            adminShare = totalBalanceBet * 0.1;
            userShare = totalBalanceBet * 0.9;
          }
         // Обновление баланса referal, если применимо
         if(games[gameId].isTon == 1){
          if (referalShare > 0) {
            const referalAccount = await pool.query('SELECT account FROM accounts WHERE referal = $1', [referal])
  
            await pool.query('UPDATE accounts SET balance = balance + $1 WHERE account = $2', [referalShare, referalAccount.rows[0].account]);
          }
          if (adminAccount) {
            await pool.query('UPDATE accounts SET balance = balance + $1 WHERE account = $2', [adminShare, adminAccount]);
          }
          await pool.query('UPDATE accounts SET balance = balance + $1 WHERE account = $2', [userShare, gameState.lastBetter]);
          await pool.query(`INSERT INTO balancewinhistory_${gameId} (account, balancewin) VALUES ($1, $2)`, [gameState.lastBetterName, totalBalanceBet]);
        
         }
         if(games[gameId].isTon == 0){
          if (referalShare > 0) {
            const referalAccount = await pool.query('SELECT account FROM accounts WHERE referal = $1', [referal])
  
            await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE account = $2', [referalShare, referalAccount.rows[0].account]);
          }
          if (adminAccount) {
            await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE account = $2', [adminShare, adminAccount]);
          }
          await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE account = $2', [userShare, gameState.lastBetter]);
          await pool.query(`INSERT INTO balancewinhistory_${gameId} (account, balancewin) VALUES ($1, $2)`, [gameState.lastBetterName, totalBalanceBet]);
        
         }
       } else {
        if(games[gameId].isTon == 1){
         if (adminAccount) {
          await pool.query('UPDATE accounts SET balance = balance + $1 WHERE account = $2', [totalBalanceBet * 0.1, adminAccount]);
         }
       }
       else{
        if (adminAccount) {
          await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE account = $2', [totalBalanceBet * 0.1, adminAccount]);
         }
       }
      }
     // await pool.query(`DELETE FROM bethistory_${gameId}`);
      await pool.query(`DELETE FROM accountsbet_${gameId}`);
      broadcastToClients({ type: 'resetHistory', gameId, totalBalanceBet, lastBetter: gameState.lastBetterName });
      gameState.lastBetter = null; // Сбрасываем последнего игрока после завершения таймера
    } catch (err) {
      console.error('Error resetting history:', err);
    }
  }
}, 1000);
};

const getRandomTime = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const broadcastToClients = (message) => {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

app.post('/set-balance-bet', async (req, res) => {
  const { account, accountName, amountbet, gameId, valute } = req.body;
  if(valute == '2'){
    try {
    
      const balanceResult = await pool.query('SELECT balance FROM accounts WHERE account = $1', [account]);
  
      if (balanceResult.rows.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
      const currentBalance = balanceResult.rows[0].balance;
  
      if (currentBalance === 0 || currentBalance - amountbet < 0) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
  
      await pool.query('UPDATE accounts SET balance = balance - $1 WHERE account = $2', [amountbet, account]);
  
      const result = await pool.query(`SELECT amountbet FROM accountsbet_${gameId} WHERE account = $1`, [account]);
      if (result.rows.length > 0) {
  
        await pool.query(`UPDATE accountsbet_${gameId} SET amountbet = amountbet + $1 WHERE account = $2`, [amountbet, account]);
      } else {
  
        await pool.query(`INSERT INTO accountsbet_${gameId} (account, amountbet) VALUES ($1, $2)`, [account, amountbet]);
      }
  
      await pool.query(`INSERT INTO bethistory_${gameId} (account, balancebet) VALUES ($1, $2)`, [accountName, amountbet]);
  
      broadcastToClients({ type: 'historyUpdate', accountName, amountbet, gameId });
  
      startGame(gameId, account, accountName, amountbet, valute);
  
      res.json({ success: true });
    } catch (err) {
      console.error('Error setting balance bet:', err);
      res.status(500).json({ error: 'Something went wrong' });
    } 
  }
  if(valute == '1'){
    try {
    
      const balanceResult = await pool.query('SELECT balanceOas FROM accounts WHERE account = $1', [account]);
  
      if (balanceResult.rows.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
      const currentBalance = balanceResult.rows[0].balance;
  
      if (currentBalance === 0 || currentBalance - amountbet < 0) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
  
      await pool.query('UPDATE accounts SET balanceOas = balanceOas - $1 WHERE account = $2', [amountbet, account]);
  
      const result = await pool.query(`SELECT amountbet FROM accountsbet_${gameId} WHERE account = $1`, [account]);
      if (result.rows.length > 0) {
  
        await pool.query(`UPDATE accountsbet_${gameId} SET amountbet = amountbet + $1 WHERE account = $2`, [amountbet, account]);
      } else {
  
        await pool.query(`INSERT INTO accountsbet_${gameId} (account, amountbet) VALUES ($1, $2)`, [account, amountbet]);
      }
  
      await pool.query(`INSERT INTO bethistory_${gameId} (account, balancebet) VALUES ($1, $2)`, [accountName, amountbet]);
  
      broadcastToClients({ type: 'historyUpdate', accountName, amountbet, gameId });
  
      startGame(gameId, account, accountName, amountbet, valute);
  
      res.json({ success: true });
    } catch (err) {
      console.error('Error setting balance bet:', err);
      res.status(500).json({ error: 'Something went wrong' });
    } 
  } 
  
});
app.get('/recent-bets', async (req, res) => {
  const { gameId } = req.query;
  try {
    const result = await pool.query(`SELECT * FROM bethistory_${gameId} ORDER BY id DESC LIMIT 10`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recent bets:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.get('/balance-bet', async (req, res) => {
  const { account, gameId } = req.query;
  try {
    const result = await pool.query(`SELECT amountbet FROM accountsbet_${gameId} WHERE account = $1`, [account]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (err) {
    console.error('Error fetching balance from accountsbet:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/winner', async (req, res) => {
  const { gameId } = req.query;
  try {
    const result = await pool.query(`SELECT * FROM balancewinhistory_${gameId} ORDER BY id DESC LIMIT 1`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching winner:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/start-timer', (req, res) => {
  const { gameId } = req.body;
  if (!games[gameId] || !games[gameId].timerRunning) {
    startGame(gameId);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Timer is already running' });
  }
});


// Маршрут для получения текущего значения баланса из таблицы accounts
app.get('/balance', async (req, res) => {
  const { account, valute } = req.query;
  if(valute == '2'){
    try {
      const result = await pool.query('SELECT balance FROM accounts WHERE account = $1', [account]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching balance:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
  if(valute == '1'){
    try {
      const result = await pool.query('SELECT balanceOas FROM accounts WHERE account = $1', [account]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching balance:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
  
});

// Маршрут для увеличения значения баланса в таблице accounts
app.post('/increment', async (req, res) => {
  const { account, amount } = req.body;
  try {
    await pool.query('UPDATE accounts SET balance = balance + $1 WHERE account = $2', [amount, account]);
    res.json({ success: true });
    
  } catch (err) {
    console.error('Error incrementing balance:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Маршрут для уменьшения значения баланса в таблице accounts
app.post('/decrement', async (req, res) => {
  const { account, amount } = req.body;
  try {
    await pool.query('UPDATE accounts SET balance = balance - $1 WHERE account = $2', [amount, account]);
    res.json({ success: true });
    
  } catch (err) {
    console.error('Error decrementing balance:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});




app.post('/create-account', async (req, res) => {
  const { account, chatid, referal } = req.body;

  try {
    // Проверка, что chatid не существует еще в таблице accounts
    const chatidResult = await pool.query('SELECT account FROM accounts WHERE chatid = $1', [chatid]);
    const chatidExists = chatidResult.rows.length > 0;

    // Проверка, что chatid равен referal
    const actualReferal = chatidExists || chatid === referal ? -1 : referal;

    const result = await pool.query('SELECT balance FROM accounts WHERE account = $1', [account]);
    if (result.rows.length > 0) {
      const resultOas = await pool.query('SELECT balanceOas FROM accounts WHERE account = $1', [account])
      // Аккаунт существует, возвращаем текущий баланс
      res.json({ success: true, balance: result.rows[0].balance, balanceOas: resultOas.rows[0].balanceOas });
    } else {
      await pool.query('BEGIN');

      // Аккаунт не существует, создаем новый и устанавливаем balance на 0
      await pool.query('INSERT INTO accounts (account, accountname, balance, balanceoas, chatid, referal) VALUES ($1, $2, 12345, 1000000000, $3, $4)',
         [account, account, chatid, actualReferal]);
      // Создаем таблицу transactionHistory для нового аккаунта
      const sanitizedAccount = account.replace(/[^a-zA-Z0-9]/g, '_'); // Заменяем все не буквенно-цифровые символы на '_'
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS transactionHistory_${sanitizedAccount} (
          id SERIAL PRIMARY KEY,
          account VARCHAR(255) NOT NULL,
          contractAddr VARCHAR(255) NOT NULL,
          lt BIGINT NOT NULL,
          status INT NOT NULL,
          amountBalance INT NOT NULL,
          transactionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await pool.query(createTableQuery);
        1000000000
      // Вставляем дефолтные записи в таблицу transactionHistory
      const insertDefaultQuery = `
        INSERT INTO transactionHistory_${sanitizedAccount}
        (account, contractAddr, lt, status, amountBalance)
        VALUES ($1, 'default_contract', -500, -100, -500)
      `;
      await pool.query(insertDefaultQuery, [account]);

      const insertDefaultQuery1 = `
        INSERT INTO transactionHistory_${sanitizedAccount}
        (account, contractAddr, lt, status, amountBalance)
        VALUES ($1, 'default_contract', -500, 100, -500)
      `;
      await pool.query(insertDefaultQuery1, [account]);
      await pool.query('COMMIT');

      res.json({ success: true, balance: 0 });
    }
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error creating account:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});




// CREATE TABLE IF NOT EXISTS accounts (
//   account VARCHAR(255) NOT NULL,
//   accountName VARCHAR(255) NOT NULL,
//   balance INT NOT NULL,
//   balanceOas INT NOT NULL,
//   chatid VARCHAR(255) NOT NULL,
//   referal  VARCHAR(255) NOT NULL
// );








// Маршрут для увеличения ставки в таблице accountsbet

// Маршрут для получения последней строки из таблицы transactionHistory_<account>
app.get('/last-transaction/:account/:status', async (req, res) => {
  const { account, status } = req.params;
  const parsedStatus = parseInt(status);
  

  if (isNaN(parsedStatus) || ![-100, 100].includes(parsedStatus)) {
    return res.status(400).json({ error: 'Invalid status code. Only -100 and 100 are allowed.' });
  }
  try {
    const updateStatus = parsedStatus === -100 ? -200 : 200;
    const sanitizedAccount = account.replace(/[^a-zA-Z0-9]/g, '_');
    // Обновляем все записи, которые старше 24 часов, устанавливая им новый статус
    const updateQuery = `
      UPDATE transactionHistory_${sanitizedAccount}
      SET status = ${updateStatus}
      WHERE status = ${parsedStatus} AND transactionDate <= NOW() - INTERVAL '24 hours'
    `;
    await pool.query(updateQuery);

    // Извлекаем все записи с указанным статусом и датой транзакции в пределах последних 24 часов
    const selectQuery = `
      SELECT * FROM transactionHistory_${sanitizedAccount}
      WHERE status = ${parsedStatus} AND transactionDate > NOW() - INTERVAL '24 hours'
    `;
    const result = await pool.query(selectQuery);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ error: `No transactions with status ${parsedStatus} found within the last 24 hours` });
    }
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.post('/update-last-transaction', async (req, res) => {
  const { account, typeTx } = req.body;
  try {
    const sanitizedAccount = account.replace(/[^a-zA-Z0-9]/g, '_');
    // Извлекаем последнюю транзакцию для данного аккаунта
    const selectQuery = `
      SELECT id FROM transactionHistory_${sanitizedAccount} ORDER BY id DESC LIMIT 1
    `;
    const result = await pool.query(selectQuery);

    if (result.rows.length > 0) {
      const lastTransactionId = result.rows[0].id;
      if(typeTx == '1'){
        const updateQuery = `
        UPDATE transactionHistory_${sanitizedAccount}
        SET status = 1000
        WHERE id = $1
      `;
      await pool.query(updateQuery, [lastTransactionId]);
      }
      if(typeTx == '2'){
        const updateQuery = `
        UPDATE transactionHistory_${sanitizedAccount}
        SET status = -1000
        WHERE id = $1
      `;
      await pool.query(updateQuery, [lastTransactionId]);
      }
      // Обновляем статус последней транзакции на 1000
      

      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'No transactions found for this account' });
    }
  } catch (err) {
    console.error('Error updating last transaction:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// Маршрут для добавления информации о новой транзакции
app.post('/new-transaction', async (req, res) => {
  const { account, contractAddr, lt, status, amountBalance } = req.body;
  try {
    // Создаем запрос для добавления новой транзакции в таблицу transactionHistory_<account>
    const insertQuery = `
      INSERT INTO transactionHistory_${account} (account, contractAddr, lt, status, amountBalance)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(insertQuery, [account, contractAddr, lt, status, amountBalance]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error adding new transaction:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// Маршрут для обновления статуса транзакции в таблице transactionHistory_<account>
app.post('/update-transaction-status', async (req, res) => {
  const { id, account, lt, newStatus } = req.body;
  try {
    // Создаем запрос для обновления lt и status по id
    const updateQuery = `
      UPDATE transactionHistory_${account}
      SET lt = $1, 
      status = $2
      WHERE id = $3
    `;
    const result = await pool.query(updateQuery, [lt, newStatus, id]);

    if (result.rowCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (err) {
    console.error('Error updating transaction status:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/get-transaction-by-lt/:account/:lt', async (req, res) => {
  const { account, lt } = req.params;
  try {
    // Создаем запрос для получения записи по lt
    const selectQuery = `
      SELECT 1 FROM transactionHistory_${account}
      WHERE lt = $1
    `;
    const result = await pool.query(selectQuery, [lt]);

    if (result.rows.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error fetching transaction by lt:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});




function HMAC_SHA256(key, secret) {
  return createHmac("sha256", key).update(secret);
}

function getCheckString(data) {
        const items = [];

        // remove hash
        for (const [k, v] of data.entries()) if (k !== "hash") items.push([k, v]);

        return items.sort(([a], [b]) => a.localeCompare(b)) // sort keys
                .map(([k, v]) => `${k}=${v}`) // combine key-value pairs
                .join("\n");
}

app.post("/validate-init", (req, res) => {
        const data = new URLSearchParams(req.body);

        const data_check_string = getCheckString(data);
        console.log(data)
        const secret_key = HMAC_SHA256("WebAppData", "TOKEN").digest();
        const hash = HMAC_SHA256(secret_key, data_check_string).digest("hex");

        if (hash === data.get("hash"))
                // validated!
                return res.json(Object.fromEntries(data.entries()));
        return res.status(401).json({});
});


const TELEGRAM_BOT_TOKEN = 'TOKEN';
const TELEGRAM_CHANNEL_ID = '@fjsnfdc';

app.use(bodyParser.json());

async function isSubscribed(userId) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${TELEGRAM_CHANNEL_ID}&user_id=${userId}`;
        const response = await axios.get(url);
        const status = response.data.result.status;
        console.log(status);
        return ['member', 'administrator', 'creator'].includes(status);
    } catch (error) {
        console.error(error);
        return false;
    }
}

app.post('/check_subscription', async (req, res) => {
    const { user_id } = req.body;
    const subscribed = await isSubscribed(user_id.toString());
    res.json({ subscribed });
});


// CREATE TABLE accountsbet_game3 (
//   account VARCHAR(255) PRIMARY KEY,
//   amountbet BIGINT
// );

// CREATE TABLE balancewinhistory_game3 (
//   id SERIAL PRIMARY KEY,
//   account VARCHAR(255),
//   balancewin BIGINT
// );

// CREATE TABLE bethistory_game3 (
//   id SERIAL PRIMARY KEY,
//   account VARCHAR(255),
//   balancebet BIGINT
// );




// CREATE TABLE daily_quests (
//   id SERIAL PRIMARY KEY,               
//   user_id BIGINT NOT NULL,       
//   quest_date DATE NOT NULL,            
//   reward INTEGER NOT NULL,             
//   day_number INTEGER NOT NULL,         
//   clime INTEGER NOT NULL,
//   CONSTRAINT unique_user_day UNIQUE (user_id, day_number), 
//   FOREIGN KEY (user_id) REFERENCES accounts(chatid)       
// );
// CREATE TABLE user_quests (
//   id SERIAL PRIMARY KEY,               
//   user_id BIGINT NOT NULL,            
//   quest_id INTEGER NOT NULL,           
//   FOREIGN KEY (user_id) REFERENCES accounts(chatid),       
//   FOREIGN KEY (quest_id) REFERENCES quests(id)      
// );
// INSERT INTO quests (reward) 
// VALUES (20000);

// CREATE TABLE quests (
//   id SERIAL PRIMARY KEY,                  
//   reward INTEGER NOT NULL    
// );




// CREATE TABLE accounts (
//   chatid BIGINT PRIMARY KEY,
//   accountname VARCHAR(255),
//   balance BIGINT,
//   balanceoas BIGINT,
//   account VARCHAR(255),
//   referal BIGINT,
//   climed BIGINT,
//   totalwin BIGINT,
//   totallose BIGINT
// );

// CREATE TABLE userstats (
//   chatid BIGINT PRIMARY KEY,
//   accountname VARCHAR(255),
//   winsOas BIGINT,
//   lostOas BIGINT,
//   winTon BIGINT,
//   lostTon BIGINT,
//   taps BIGINT
// );

