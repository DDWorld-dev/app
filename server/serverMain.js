import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import axios from 'axios';
import https from 'https';
import { createHmac } from "node:crypto";
import cookieParser from 'cookie-parser';
import csurf from "csurf"


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
  user: 'user1',
  host: '79.174.88.210',
  database: 'user1',
  password: 'CXH5hZ@j(aU?iz$z4Z=)FV$d',
  port: 15904,
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
  
  res.json({ csrfToken: req.csrfToken() });
});


const  adminAccount = 896148776;
const games = {};
let gameCooldowns = {};


const startGame = async (gameId, account, accountName, amountbet, valute) => {
  // Проверка, если есть активное ожидание между играми
  if (gameCooldowns[gameId] && Date.now() < gameCooldowns[gameId]) {

      // console.log(`Нельзя начать новую игру. Ожидание до ${new Date(gameCooldowns[gameId])}`);
      return;
  }

  // Если игра уже запущена и таймер работает
  if (games[gameId] && games[gameId].timerRunning) {
      games[gameId].lastBetter = account;
      games[gameId].lastBetterName = accountName;
      games[gameId].totalTap += 1;
     return;
  }

  await pool.query(`DELETE FROM accountsbet_${gameId}`);
  await pool.query(`DELETE FROM bethistory_${gameId}`);

  await pool.query(`INSERT INTO bethistory_${gameId} (account, balancebet) VALUES ($1, $2)`, [accountName, amountbet]);
  await pool.query(`INSERT INTO accountsbet_${gameId} (account, amountbet) VALUES ($1, $2)`, [account, amountbet]);
  const re = await pool.query(`SELECT SUM(amountbet) as totalbalancebet FROM accountsbet_${gameId}`);
 const totalBalanceBet = re.rows[0].totalbalancebet || 0;
  const gameState = {
      timerRunning: true,
      remainingTime: getRandomTime(10, 60),
      timerInterval: null,
      lastBetter: account,
      lastBetterName: accountName,
      timerStart: 60,
      totalTap: 0,
      isTon: 1
  };

  games[gameId] = gameState;
  games[gameId].totalTap += 1;
  if(gameId == "gameOas1" || gameId ==  "gameOas2" || gameId == "gameOas3"){
    games[gameId].isTon = 1
  }
  else{
   games[gameId].isTon = 2

 }
  // console.log(gameState.remainingTime); // Случайное число от 10 секунд до 2 минут
  broadcastToClients({ type: 'timerUpdateFirst', gameId: gameId, time: gameState.timerStart, totalBet: totalBalanceBet });

  gameState.timerInterval = setInterval(async () => {
      gameState.remainingTime -= 1;
      gameState.timerStart -= 1;
        // console.log(games[gameId].isTon)
      broadcastToClients({ type: 'timerUpdate', gameId: gameId, time: gameState.timerStart });

      if (gameState.remainingTime <= 0) {
          clearInterval(gameState.timerInterval);
          gameState.timerRunning = false;

          try {
              const result = await pool.query(`SELECT SUM(amountbet) as totalbalancebet FROM accountsbet_${gameId}`);
              const totalBalanceBet = result.rows[0].totalbalancebet || 0;

              let adminShare = 0;
              let userShare = 0;
              let referalShare = 0;

              
              if (gameState.lastBetter) {
                const referalResult = await pool.query('SELECT referal FROM accounts WHERE chatid = $1', [gameState.lastBetter]);
                const referal = referalResult.rows[0].referal;
            
                if (Number(referal) === -1 || Number(referal) === 0) {
                    adminShare = Math.round(Number(totalBalanceBet) * 0.1);
                    userShare = Math.round(Number(totalBalanceBet) * 0.9);
                } else {
                    referalShare = Math.round(Number(totalBalanceBet) * 0.05);
                    adminShare = Math.round(Number(totalBalanceBet) * 0.05);
                    userShare = Math.round(Number(totalBalanceBet) * 0.9);
                }
            
                if (games[gameId].isTon === 1) {
                    if (referalShare > 0) {
                        await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE chatid = $2', [referalShare, referal]);
                    }
                    if (adminAccount) {
                        await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE chatid = $2', [adminShare, adminAccount]);
                    }
                    await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE chatid = $2', [userShare, gameState.lastBetter]);
                    await pool.query(`INSERT INTO balancewinhistory_${gameId} (account, balancewin) VALUES ($1, $2)`, [gameState.lastBetterName, userShare]);
                    await pool.query('UPDATE userstats SET winsoas = winsoas + $1, lostoas = lostoas + $1 WHERE chatid = $2', [userShare, gameState.lastBetter]);
            
                } else if (games[gameId].isTon === 2) {
                    if (referalShare > 0) {
                        await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [referalShare, referal]);
                    }
                    if (adminAccount) {
                        await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [adminShare, adminAccount]);
                    }
                    await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [userShare, gameState.lastBetter]);
                    await pool.query(`INSERT INTO balancewinhistory_${gameId} (account, balancewin) VALUES ($1, $2)`, [gameState.lastBetterName, userShare]);
                    await pool.query('UPDATE userstats SET winton = winton + $1, lostton = lostton + $1 WHERE chatid = $2', [userShare, gameState.lastBetter]);
                }
            }
            const maxBet = await pool.query(`
              SELECT amountbet
              FROM accountsbet_${gameId}
              WHERE account = $1
          `, [gameState.lastBetter]);
          // console.log(maxBet.rows[0].amountbet, "ANANANANA");
            broadcastToClients({
              type: 'resetHistory',
              gameId: gameId,
              totalBalanceBet: totalBalanceBet,
              lastBetterName: gameState.lastBetterName,
              lastBetter: gameState.lastBetter,
              totalTap: gameState.totalTap,
              maxBet: maxBet.rows[0].amountbet
            });

            // Установка таймера ожидания перед началом новой игры
            let cooldownTime = 10; // 10 секунд в будущем
            gameCooldowns[gameId] = Date.now() + cooldownTime * 1000;

            const cooldownInterval = setInterval(() => {
                cooldownTime -= 1;
                broadcastToClients({
                    type: 'gameCooldown',
                    gameId: gameId,
                    remainingCooldownTime: cooldownTime
                });

                if (cooldownTime <= 0) {
                    clearInterval(cooldownInterval);
                    broadcastToClients({
                      type: 'gameCooldownEnd',
                      gameId: gameId
                  });
                }
            }, 1000);

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
//98992800
//98991300
//98992800
app.post('/total-bet', csrfProtection, async (req, res) => {
   const {gameId} = req.body;
   const totalBet = await pool.query(`SELECT SUM(amountbet) as totalbalancebet FROM accountsbet_${gameId}`);

   res.json({ totalBet: totalBet });
})

app.post('/check-online', csrfProtection, async (req, res) => {
const { gameId1, gameId2, gameId3 } = req.body;
// console.log(gameId1, gameId2, gameId3)
 try {
   // Извлекаем параметры из запроса

   // Создаем запросы для подсчета количества записей
   const queries = [
     pool.query(`SELECT COUNT(*) FROM accountsbet_${gameId1}`),
     pool.query(`SELECT COUNT(*) FROM accountsbet_${gameId2}`),
     pool.query(`SELECT COUNT(*) FROM accountsbet_${gameId3}`)
   ];

   // Выполняем все запросы параллельно
   const [result1, result2, result3] = await Promise.all(queries);

   // Извлекаем количество записей из результатов запросов
   const count1 = parseInt(result1.rows[0].count, 10);
   const count2 = parseInt(result2.rows[0].count, 10);
   const count3 = parseInt(result3.rows[0].count, 10);

   // Возвращаем результат в виде JSON
   res.json({
     count1,
     count2,
     count3
   });
 } catch (error) {
   console.error('Error checking online status:', error);
   res.status(500).json({ error: 'Something went wrong' });
 }
});

   app.post('/add-address', csrfProtection, async (req, res) => {
     const { chatid, account } = req.body;
     try {
       await pool.query('UPDATE accounts SET account = $1 WHERE chatid = $2', [account, chatid]);
       res.json({ success: true });
      } catch (err) {
        console.error('Error decrementing balance:', err);
        res.status(500).json({ error: 'Something went wrong' });
      }
    });


app.post('/task-complite', csrfProtection, async (req, res) => {
  const { userId } = req.body;

  try {
    // Первый запрос: подсчет количества заданий в user_quests
    const userQuestsQuery = `
      SELECT COUNT(*) AS user_count
      FROM user_quests
      WHERE user_id = $1;
    `;
    const userQuestsResult = await pool.query(userQuestsQuery, [userId]);
    const userCount = userQuestsResult.rows[0].user_count;

    // Второй запрос: получение значения climed из accounts по chatid
    const accountsQuery = `
      SELECT climed
      FROM accounts
      WHERE chatid = $1;
    `;
    const accountsResult = await pool.query(accountsQuery, [userId]);

    // Проверяем, есть ли результат из accounts
    let climedValue = null;
    if (accountsResult.rows.length > 0) {
      climedValue = accountsResult.rows[0].climed;
    }

    // Возвращаем оба значения в ответе
    res.json({count: userCount, climed: climedValue });
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.post('/user-stats', csrfProtection, async (req, res) => {
  const { chatId } = req.body;
  // console.log(chatId)
  if (!chatId) {
        // console.log("faildldld")
    return res.status(400).json({ message: 'chatId is required' });
  }

  try {
    const query = `
      SELECT winsoas, lostoas, winton, lostton, taps
      FROM userstats
      WHERE chatid = $1;
       `;

    const result = await pool.query(query, [chatId]);
      // console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User stats retrieved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
});


app.get('/top-accounts',csrfProtection, async (req, res) => {
  // console.log("TOTOT")
  try {
    const query = `
      SELECT chatid, accountname, winsoas, lostoas, winton, lostton, (winsoas + lostoas + winton + lostton) AS turnover
      FROM userstats
      ORDER BY turnover DESC;
    `;

    const result = await pool.query(query);
    res.status(200).json({
      message: 'Top accounts by turnover',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching top accounts:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
});


app.post('/set-balance-bet', csrfProtection, async (req, res) => {
    const { account, accountName, amountbet, gameId, valute } = req.body;
    // console.log(valute, gameId);
    // Проверка, если есть активное ожидание между играми
    if (gameCooldowns[gameId] && Date.now() < gameCooldowns[gameId]) {
        return res.status(400).json({ error: 'Game is currently in cooldown period. Please wait before placing another bet.' });
    }

    // Проверка для TON
    if (valute == '2') {
      try {
        const balanceResult = await pool.query('SELECT balance FROM accounts WHERE chatid = $1', [account]);

        if (balanceResult.rows.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }
        const currentBalance = balanceResult.rows[0].balance;

        if (currentBalance === 0 || currentBalance - amountbet < 0) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        await pool.query('UPDATE accounts SET balance = balance - $1 WHERE chatid = $2', [amountbet, account]);
        await pool.query('UPDATE userstats SET taps = taps + 1, lostton = lostton - $1 WHERE chatid = $2', [amountbet, account]);

        const result = await pool.query(`SELECT amountbet FROM accountsbet_${gameId} WHERE account = $1`, [account]);
        if (result.rows.length > 0) {
            await pool.query(`UPDATE accountsbet_${gameId} SET amountbet = amountbet + $1 WHERE account = $2`, [amountbet, account]);
        } else {
            await pool.query(`INSERT INTO accountsbet_${gameId} (account, amountbet) VALUES ($1, $2)`, [account, amountbet]);
        }
        const re = await pool.query(`SELECT SUM(amountbet) as totalbalancebet FROM accountsbet_${gameId}`);
          const totalBalanceBet = re.rows[0].totalbalancebet || 0;
        await pool.query(`INSERT INTO bethistory_${gameId} (account, balancebet) VALUES ($1, $2)`, [accountName, amountbet]);
         broadcastToClients({ type: 'historyUpdate', accountName: accountName, amountbet: amountbet, gameId: gameId, totalBet: totalBalanceBet });

        startGame(gameId, account, accountName, amountbet, valute);

        res.json({ success: true });
    } catch (err) {
        console.error('Error setting balance bet:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

// Проверка для OAS
if (valute == '1') {
    try {
        const balanceResult = await pool.query('SELECT balanceOas FROM accounts WHERE chatid = $1', [account]);

        if (balanceResult.rows.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }
        const currentBalance = balanceResult.rows[0].balanceoas;

        if (currentBalance === 0 || currentBalance - amountbet < 0) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        await pool.query('UPDATE accounts SET balanceOas = balanceOas - $1 WHERE chatid = $2', [amountbet, account]);
        await pool.query('UPDATE userstats SET taps = taps + 1, lostoas = lostoas - $1 WHERE chatid = $2', [amountbet, account]);

        const result = await pool.query(`SELECT amountbet FROM accountsbet_${gameId} WHERE account = $1`, [account]);
        if (result.rows.length > 0) {
            await pool.query(`UPDATE accountsbet_${gameId} SET amountbet = amountbet + $1 WHERE account = $2`, [amountbet, account]);
        } else {
            await pool.query(`INSERT INTO accountsbet_${gameId} (account, amountbet) VALUES ($1, $2)`, [account, amountbet]);
          }

          await pool.query(`INSERT INTO bethistory_${gameId} (account, balancebet) VALUES ($1, $2)`, [accountName, amountbet]);

           const re = await pool.query(`SELECT SUM(amountbet) as totalbalancebet FROM accountsbet_${gameId}`);
            const totalBalanceBet = re.rows[0].totalbalancebet || 0;
           broadcastToClients({ type: 'historyUpdate', accountName: accountName, amountbet: amountbet, gameId: gameId, totalBet: totalBalanceBet });

          startGame(gameId, account, accountName, amountbet, valute);

          res.json({ success: true });
      } catch (err) {
          console.error('Error setting balance bet:', err);
          res.status(500).json({ error: 'Something went wrong' });
      }
  }
});




app.get('/max-bet', csrfProtection, async (req, res) => {
const { gameId, chatId } = req.query;
try {
    const result = await pool.query(`
        SELECT amountbet
        FROM accountsbet_${gameId}
        WHERE account = $1
    `, [chatId]);

    // console.log(result.rows[0]);
    if (result.rows.length > 0) {
        res.json(result.rows[0]);
    } else {
        res.status(404).json({ error: 'No bets found for this user' });
    }
} catch (err) {
    console.error('Error fetching max bet from accountsbet:', err);
    res.status(500).json({ error: 'Something went wrong' });
}
});


app.get('/recent-bets',csrfProtection, async (req, res) => {
const { gameId } = req.query;
try {
 const result = await pool.query(`SELECT * FROM bethistory_${gameId} ORDER BY id DESC LIMIT 10`);
 res.json(result.rows);
} catch (err) {
 console.error('Error fetching recent bets:', err);
 res.status(500).json({ error: 'Something went wrong' });
}
});
app.get('/balance-bet',csrfProtection, async (req, res) => {
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

app.get('/winner',csrfProtection, async (req, res) => {
const { gameId } = req.query;
try {
  const result = await pool.query(`SELECT * FROM balancewinhistory_${gameId} ORDER BY id DESC LIMIT 1`);
  res.json(result.rows);
} catch (err) {
  console.error('Error fetching winner:', err);
  res.status(500).json({ error: 'Something went wrong' });
}
});

app.get('/balance', csrfProtection,  async (req, res) => {
  const { account, valute } = req.query;
  if(valute == '2'){
    try {
      const result = await pool.query('SELECT balance FROM accounts WHERE chatid = $1', [account]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching balance:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
  if(valute == '1'){
    try {
      const result = await pool.query('SELECT balanceOas FROM accounts WHERE chatid = $1', [account]);

      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching balance:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

});


app.post('/increment', csrfProtection, async (req, res) => {
  const { account, amount, lt } = req.body; // Принимаем lt и account

  try {
    // Проверяем наличие транзакции с code == 0
    const transactionCheckQuery = `
      SELECT *
      FROM transactionhistory_${account}
      WHERE lt = $1 AND status = 0
       `;
      const transactionCheckResult = await pool.query(transactionCheckQuery, [lt]);

      if (transactionCheckResult.rows.length > 0) {
        // Увеличиваем баланс
        await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [amount, account]);

        // Обновляем поле lt в таблице transactionHistory_${account}
        const updateLtQuery = `
          UPDATE transactionhistory_${account}
          SET status = -1111
          WHERE lt = $1
        `;
        await pool.query(updateLtQuery, [lt]);

        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'No transaction with code 0 found for this lt.' });
      }
    } catch (err) {
      console.error('Error incrementing balance or updating lt:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  app.post('/increment-ton', csrfProtection, async (req, res) => {
    const { account, amount, lt } = req.body; // Принимаем lt и account
    // console.log("INCREMENT", account, amount, lt)
    try {
      // Проверяем наличие транзакции с code == 0
      const transactionCheckQuery = `
        SELECT *
        FROM transactionhistory_${account}
        WHERE status = $1
        `;

      const transactionCheckResult = await pool.query(transactionCheckQuery, [lt]);

      if (transactionCheckResult.rows.length > 0) {
        // Увеличиваем баланс
        await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [amount, account]);

        // Обновляем поле lt в таблице transactionHistory_${account}


        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'No transaction with code 0 found for this lt.' });
      }
    } catch (err) {
      console.error('Error incrementing balance or updating lt:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  app.post('/increment-oas', csrfProtection, async (req, res) => {
    const { account, amount } = req.body;
    try {
      await pool.query('UPDATE accounts SET balanceoas = balanceoas + $1 WHERE chatid = $2', [amount, account]);
      await pool.query('UPDATE accounts SET climed = climed + $1 WHERE chatid = $2', [amount, account]);
      res.json({ success: true });

    } catch (err) {
      console.error('Error incrementing balance:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });



  app.post('/increment-ton', csrfProtection, async (req, res) => {
    const { account, amount, lt } = req.body; // Принимаем lt и account

    try {
      // Проверяем наличие транзакции с code
      const transactionCheckQuery = `
        SELECT *
        FROM transactionhistory_${account}
        WHERE lt = $1
        `;

      const transactionCheckResult = await pool.query(transactionCheckQuery, [lt]);

      if (transactionCheckResult.rows.length > 0) {
        // Увеличиваем баланс
        await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [amount, account]);

        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'No transaction with code 0 found for this lt.' });
      }
    } catch (err) {
      console.error('Error incrementing balance or updating lt:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });



  app.post('/quest', csrfProtection,async (req, res) => {
    const { userId, questId } = req.body;

    try {
      // Проверяем, был ли квест уже выполнен пользователем
      const checkQueryText = 'SELECT * FROM user_quests WHERE user_id = $1 AND quest_id = $2';
      const checkResult = await pool.query(checkQueryText, [userId, questId]);

      if (checkResult.rows.length > 0) {
        // Если запись уже существует, возвращаем сообщение о том, что квест уже выполнен
        return res.status(400).json({
          complete: '3'
        });
      }

      // Получаем награду за квест из таблицы quests
      const rewardQueryText = 'SELECT reward FROM quests WHERE id = $1';
      const rewardResult = await pool.query(rewardQueryText, [questId]);

      if (rewardResult.rows.length === 0) {
        return res.status(404).json({
          message: 'Quest not found'
        });
      }

      const amount = rewardResult.rows[0].reward;

      // Вставляем новую запись, если квест еще не выполнен
      const insertQueryText = 'INSERT INTO user_quests (user_id, quest_id) VALUES ($1, $2)';
      await pool.query(insertQueryText, [userId, questId]);

      // Обновляем баланс пользователя и другие поля в таблице accounts
      await pool.query('UPDATE accounts SET balanceoas = balanceoas + $1 WHERE chatid = $2', [amount, userId]);
      await pool.query('UPDATE accounts SET climed = climed + $1 WHERE chatid = $2', [amount, userId]);

      // Отправляем успешный ответ
      res.status(200).json({
        complete: '3'
      });

    } catch (error) {
      console.error('Error completing quest:', error.message);
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  });


  app.post('/find-referals', csrfProtection, async (req, res) => {
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: 'chatId is required' });
    }
    try {
      const query = `
        SELECT accountname
        FROM accounts
        WHERE referal = $1;
      `;

      const result = await pool.query(query, [chatId]);
      // console.log("referal")
      if (result.rows.length === 0) {
        // console.log("fail")
        return res.status(404).json({ message: 'No referals found for this chatId' });
      }

      const accountNames = result.rows.map(row => row.accountname);
      // console.log(accountNames)

      res.status(200).json({ accountNames });
    } catch (error) {
      console.error('Error finding referals:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post('/check-daily-quest', csrfProtection, async (req, res) => {
    const { userId } = req.body;
        // console.log(userId)
    try {
      // Получаем последнюю выполненную запись квеста
      const lastQuestQuery = `
        SELECT * FROM daily_quests
        WHERE user_id = $1;
      `;
      const lastQuestResult = await pool.query(lastQuestQuery, [userId]);
      if (lastQuestResult.rows.length === 0) {

        const insertQuery = `
          INSERT INTO daily_quests (user_id, day_number, quest_date, reward, clime)
          VALUES ($1, 1, CURRENT_DATE, 100, 0);
        `;
        await pool.query(insertQuery, [userId]);


        // Если пользователь еще не выполнял квесты
        return res.status(200).json({
          dayNumber: 1,
          message: 0,
          load: 1
        });
      }
      const lastQuestDateRes = `
      SELECT quest_date, day_number FROM daily_quests
       WHERE user_id = $1;
      `;
      const lastQuestResultRes = await pool.query(lastQuestDateRes, [userId]);

      const lastQuest = lastQuestResultRes.rows[0];
      const lastQuestDate = new Date(lastQuest.quest_date);
      const today = new Date();
      const isClimed = lastQuest.clime
      // Проверяем, был ли пропущен хотя бы один день
      const oneDayInMillis = 24 * 60 * 60 * 1000;
      const daysDifference = Math.floor((today - lastQuestDate) / oneDayInMillis);

      if (daysDifference > 1) {
        // Если пропущен хотя бы один день, обнуляем прогресс
        const updateQuery = `
          UPDATE daily_quests
          SET day_number = $1, quest_date = CURRENT_DATE, reward = $3, clime = $4
          WHERE user_id = $2;
        `;
        await pool.query(updateQuery, [1, userId, 100, 0]);
        return res.status(200).json({
          dayNumber: 1,
          message: 0,
          load: 1
        });
      } else if (daysDifference === 1) {
        // Если новый день, увеличиваем day_number
        const newDayNumber = lastQuest.day_number + 1;

        // Сброс до 1-го дня, если достигнут лимит в 30 дней
        const updatedDayNumber = newDayNumber > 30 ? 1 : newDayNumber;

        // Обновляем запись с новым day_number
        let reward = 100 + (updatedDayNumber - 1) * 200;
        // console.log(newDayNumber, " vdv", reward)
        if(newDayNumber == 10 ){
          reward = 5000
        }
        if(newDayNumber == 20){
          reward = 7000
        }
        if(newDayNumber == 30){
          reward = 10000
        }

        const updateQuery = `
          UPDATE daily_quests
          SET day_number = $1, quest_date = CURRENT_DATE, reward = $3, clime = $4
          WHERE user_id = $2;
        `;
        const updateResult = await pool.query(updateQuery, [updatedDayNumber, userId, reward, 0]);
        // console.log("NEW DAY")
        return res.status(200).json({
          dayNumber: updatedDayNumber,
          message: 0,
          load: 1
        });
      } else {
        // Если квесты выполнялись без пропусков и сегодня еще не начался новый день
        if(isClimed == 0){
          return res.status(200).json({
            dayNumber: lastQuest.day_number,
            message: 0,
            load: 0
          });
        }
        if(isClimed == 1){
          return res.status(200).json({
            dayNumber: lastQuest.day_number,
            message: 1,
            load: 0
          });
        }
      }
    } catch (error) {

      console.error('Error checking daily quest:', error.message);
      res.status(500).json({
        message: 0,
        error: error.message,
      });
    }
  });




  app.post('/daily-quest', csrfProtection, async (req, res) => {
    const { userId } = req.body;

    try {
      // Проверяем, был ли квест уже выполнен сегодня
      const todayQuery = `
        SELECT clime FROM daily_quests
        WHERE user_id = $1;
      `;
      const todayResult = await pool.query(todayQuery, [userId]);

      if (todayResult.rows[0].clime == 1) {
        return res.status(400).json({
          message: 'You have already completed today\'s quest.',
        });
      }

      const updateClimeQuery = `
        SELECT reward FROM daily_quests
        WHERE user_id = $1;
      `;
      const updateResult = await pool.query(updateClimeQuery, [userId]);

      if (updateResult.rows.length === 0) {
        return res.status(404).json({
          message: 'No quest found for today to update.',
        });
      }

      // Обновляем баланс пользователя и climed
      try {
        // console.log(updateResult.rows[0].reward);
        const reward = updateResult.rows[0].reward;

       await pool.query('UPDATE accounts SET balanceoas = balanceoas + $1 WHERE chatid = $2', [reward, userId]);
        await pool.query('UPDATE accounts SET climed = climed + $1 WHERE chatid = $2', [reward, userId]);
        await pool.query('UPDATE daily_quests SET clime = 1 WHERE user_id = $1', [userId]);
        res.status(200).json({
          message: 'Quest completed successfully',
          data: updateResult.rows[0].day_number,
        });
      } catch (err) {
        console.error('Error updating balance:', err);
        res.status(500).json({
          message: 'Internal server error',
          error: err.message,
        });
      }

    } catch (error) {
      console.error('Error completing daily quest:', error.message);
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  });


  // !!!!!!!!!!!!!!!!
  app.post('/climed-oas', csrfProtection, async (req, res) => {
    const { account } = req.body;
    try {
      const result = await pool.query('SELECT climed FROM accounts WHERE chatid = $1', [account]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching balance:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  app.post('/decrement', csrfProtection, async (req, res) => {
      const { account, amount } = req.body;
      try {
        await pool.query('UPDATE accounts SET balance = balance - $1 WHERE chatid = $2', [amount, account]);
        res.json({ success: true });

      } catch (err) {
        console.error('Error decrementing balance:', err);
        res.status(500).json({ error: 'Something went wrong' });
      }
    });

    app.post('/create-account', csrfProtection, async (req, res) =>  {
const { chatid, accountname, account, referal } = req.body;
          // console.log(chatid)
          // console.log(referal)
      try {


        const result = await pool.query('SELECT balance FROM accounts WHERE chatid = $1', [chatid]);

        if (result.rows.length > 0) {

        const resultOas = await pool.query('SELECT balanceOas FROM accounts WHERE chatid = $1', [chatid]);
        if (resultOas.rows.length > 0) {
          // console.log(resultOas.rows[0].balanceoas)
          // console.log(result.rows[0].balance)
  
          // Возвращаем текущий баланс и balanceOas
          res.json({
            success: true,
            balance: result.rows[0].balance,
            balanceOas: resultOas.rows[0].balanceoas
          });
        } else {
          res.status(500).json({ success: false, message: 'Unable to retrieve balanceOas.' });
        }
        } else {
          await pool.query('BEGIN');
  
  
         const actualReferal = chatid === referal ? -1 : referal;
          let startBalance = 0
          if(actualReferal == -1){
            startBalance = 0
            await pool.query(
          'INSERT INTO accounts (chatid, accountname, balance, balanceoas, account, referal, climed, totalwin, totallose) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0)',
            [chatid, accountname, 0, 0, account, actualReferal, 0]
          );
         } else{
         startBalance = 1500
         await pool.query(
          'INSERT INTO accounts (chatid, accountname, balance, balanceoas, account, referal, climed, totalwin, totallose) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0)',
            [chatid, accountname, 0, 1500, account, actualReferal, 1500]
          );
          await pool.query('UPDATE accounts SET balanceoas = balanceoas + $1 WHERE chatid = $2', [1500, actualReferal]);
           await pool.query('UPDATE accounts SET climed = climed + $1 WHERE chatid = $2', [1500, actualReferal]);
          }
          // const sanitizedAccount = chatid.replace(/[^a-zA-Z0-9]/g, '_');
          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS transactionHistory_${chatid} (
              id SERIAL PRIMARY KEY,
              account VARCHAR(255) NOT NULL,
              contractAddr VARCHAR(255) NOT NULL,
              lt BIGINT NOT NULL,
              status INT NOT NULL,
              amountBalance BIGINT NOT NULL,
              transactionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `;
          await pool.query(createTableQuery);
  
  
  
  
          const query = `
          INSERT INTO userstats (chatid, accountname, winsoas, lostoas, winton, lostton, taps)
           VALUES ($1, $2, 0, 0, 0, 0, 0);
          `;
          const values = [chatid, accountname];
          await pool.query(query, values);
          await pool.query('COMMIT');

          res.json({
          success: true,
          balance: 0,
          balanceOas: startBalance
        });
      }
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error('Error creating account:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });


app.post('/last-transaction', csrfProtection, async (req, res) => {
  const { account, status } = req.body;
  const parsedStatus = parseInt(status);

  // Проверяем, что статус корректный: либо -100, либо 100
  if (isNaN(parsedStatus) || ![-100, 100].includes(parsedStatus)) {
    return res.status(400).json({ error: 'Invalid status code. Only -100 and 100 are allowed.' });
  }

  try {
    // Обновляем статус: -100 меняется на -200, а 100 меняется на 200
    const updateStatus = parsedStatus === -100 ? -200 : 200;

    // Обновляем статус всех транзакций, которые старше 1 часа
    const updateQuery = `
      UPDATE transactionHistory_${account}
      SET status = ${updateStatus}
      WHERE status = ${parsedStatus} AND transactionDate <= NOW() - INTERVAL '1 hours'
    `;
    await pool.query(updateQuery);

    // Выбираем все транзакции с переданным статусом, которые произошли в последние 1 час
    const selectQuery = `
      SELECT * FROM transactionHistory_${account}
      WHERE status = ${parsedStatus} AND transactionDate > NOW() - INTERVAL '1 hours'
    `;
    const result = await pool.query(selectQuery);

    // Возвращаем результат
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.json([]); // Если нет записей, возвращаем пустой массив
    }
  } catch (err) {
    console.error('Error fetching last transactions:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/new-transaction',csrfProtection, async (req, res) => {
  const {chatid, account, contractAddr, lt, status, amountBalance } = req.body;
      // console.log(chatid, account, contractAddr, lt, status, amountBalance)
  try {
    const insertQuery = `
      INSERT INTO transactionHistory_${chatid} (account, contractAddr, lt, status, amountBalance)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(insertQuery, [account, contractAddr, lt, status, amountBalance]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error adding new transaction:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/update-last-transaction', csrfProtection, async (req, res) => {
const { chatid, typeTx } = req.body;
try {
  // Сначала находим последнюю транзакцию для указанного аккаунта
  const selectQuery = `
    SELECT id FROM transactionHistory_${chatid}
    ORDER BY transactiondate DESC
    LIMIT 1;
  `;
  const selectResult = await pool.query(selectQuery);

  if (selectResult.rows.length === 0) {
    return res.status(404).json({ error: 'No transactions found' });
  }

  const transactionId = selectResult.rows[0].id;

  // Определяем значения lt и status в зависимости от typeTx
  let lt, newStatus;

  if (typeTx == 1) {
    lt = -1000;
    newStatus = -1000;
  } else if (typeTx == 2) {
    lt = 1000;
    newStatus = 1000;
  } else {
    return res.status(400).json({ error: 'Invalid typeTx' });
  }

  // Обновляем последнюю транзакцию
  const updateQuery = `
    UPDATE transactionHistory_${chatid}
    SET lt = $1,
        status = $2
    WHERE id = $3
  `;
  const result = await pool.query(updateQuery, [lt, newStatus, transactionId]);

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



app.post('/update-transaction-status',csrfProtection, async (req, res) => {
  const { id, account, lt, newStatus } = req.body;
  console.log(id, lt, "HAHAHA")
  try {
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

app.post('/get-transaction-by-lt', csrfProtection, async (req, res) => {
  const { account, lt } = req.body;
  try {
    // Находим все chatid, которые соответствуют переданному account
    const selectChatIdsQuery = `
      SELECT chatid FROM accounts
      WHERE account = $1;
    `;
    const chatIdsResult = await pool.query(selectChatIdsQuery, [account]);

    if (chatIdsResult.rows.length === 0) {
      return res.json({ exists: false, message: 'No accounts found with the given account' });
    }

    // Проходим по всем найденным chatid и ищем транзакцию с данным lt
    let transactionFound = false;
    for (const row of chatIdsResult.rows) {
      const foundChatId = row.chatid;

      // Делаем запрос к каждой таблице transactionHistory_{chatid} для поиска транзакции с данным lt
      const selectTransactionQuery = `
        SELECT 1 FROM transactionHistory_${foundChatId}
        WHERE lt = $1
        `;
        const transactionResult = await pool.query(selectTransactionQuery, [lt]);
        // Если транзакция найдена, выходим из цикла
        if (transactionResult.rows.length > 0) {
          transactionFound = true;
          break;
        }
      }

      if (transactionFound) {
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

app.post("/validate-init", csrfProtection, (req, res) => {
    const data = new URLSearchParams(req.body);

    const data_check_string = getCheckString(data);
    // console.log(data)
    const secret_key = HMAC_SHA256("WebAppData", "ROKEN").digest();
    const hash = HMAC_SHA256(secret_key, data_check_string).digest("hex");

    if (hash === data.get("hash"))
            // validated!
            return res.json(Object.fromEntries(data.entries()));
    return res.status(401).json({});
});

const TELEGRAM_BOT_TOKEN = 'TOKEN';
const TELEGRAM_CHAT_ID = '@fjsnfdc';
const TELEGRAM_CHANNEL_ID = '@teskfbs'

app.use(bodyParser.json());

async function isSubscribed(userId) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${TELEGRAM_CHANNEL_ID}&user_id=${userId}`;
    const response = await axios.get(url);
    const status = response.data.result.status;
    // console.log(status);
    return ['member', 'administrator', 'creator'].includes(status);
} catch (error) {
    console.error(error);
    return false;
}
}

async function isSubscribedChat(userId) {
  try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${TELEGRAM_CHAT_ID}&user_id=${userId}`;
      const response = await axios.get(url);
      const status = response.data.result.status;
      // console.log(status);
      return ['member', 'administrator', 'creator'].includes(status);
  } catch (error) {
      console.error(error);
      return false;
  }
  }

app.post('/check_subscription',csrfProtection, async (req, res) => {
const { user_id } = req.body;
const subscribed = await isSubscribed(user_id.toString());
res.json({ subscribed });
});
app.post('/check_subscription_chat',csrfProtection, async (req, res) => {
  const { user_id } = req.body;
  const subscribed = await isSubscribedChat(user_id.toString());
  res.json({ subscribed });
  });



