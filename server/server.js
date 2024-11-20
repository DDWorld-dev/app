import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import axios from 'axios';
import http from 'http';
import { createHmac } from "node:crypto";
import cookieParser from 'cookie-parser';
import csurf from "csurf"
import { act } from 'react';


const { Pool } = pkg;

const port = 4000;

const pool = new Pool({
  user: 'user1',
  host: '79.174.88.210',
  database: 'user1',
  password: 'CXH5hZ@j(aU?iz$z4Z=)FV$d',
  port: 15904,
});


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
const httpServer = http.createServer(app);

const server = httpServer.listen(port, '0.0.0.0', () => {
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


const  adminAccount = 896148776
const games = {};

const startGame = async (gameId, account, accountName, amountbet, valute) => {
  if (games[gameId] && games[gameId].timerRunning) {
    games[gameId].lastBetter = account;
    games[gameId].lastBetterName = accountName;
    return;
  }
  await pool.query(`DELETE FROM accountsbet_${gameId}`);

  await pool.query(`DELETE FROM bethistory_${gameId}`)

    
  await pool.query(`INSERT INTO bethistory_${gameId} (account, balancebet) VALUES ($1, $2)`, [accountName, amountbet])
  await pool.query(`INSERT INTO accountsbet_${gameId} (account, amountbet) VALUES ($1, $2)`, [account, amountbet]);
     
  



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
  broadcastToClients({ type: 'timerUpdateFirst', gameId: gameId, time: gameState.timerStart });
  
  gameState.timerInterval = setInterval(async () => {
    //console.log(gameState.timerInterval);
    gameState.remainingTime -= 1;
    gameState.timerStart -= 1;
    broadcastToClients({ type: 'timerUpdate', gameId: gameId, time: gameState.timerStart });

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
          const referalResult = await pool.query('SELECT referal FROM accounts WHERE chatid = $1', [gameState.lastBetter]);
          const referal = referalResult.rows[0].referal;
          console.log("referal", referal);
          if (Number(referal) === -1 || Number(referal) === 0) {
            // Распределение: 5% referal, 5% adminAccount
            
            adminShare = Number(totalBalanceBet) * 0.1;
            userShare = Number(totalBalanceBet) * 0.9;
          } else {
            // Распределение: 10% adminAccount
            referalShare = Number(totalBalanceBet) * 0.05;
            adminShare = Number(totalBalanceBet) * 0.05;
            userShare = Number(totalBalanceBet) * 0.9;
          }
         // Обновление баланса referal, если применимо
         if(games[gameId].isTon == 1){

          if (referalShare > 0) {
            
            await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE chatid = $2', [referalShare, referal]);
            await pool.query('UPDATE userstats SET winsoas = winsoas + $1 WHERE chatid = $2', [referalShare, referal]);
          }
          if (adminAccount) {
            await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE chatid = $2', [adminShare, adminAccount]);
          }
          await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE chatid = $2', [userShare, gameState.lastBetter]);
          await pool.query(`INSERT INTO balancewinhistory_${gameId} (account, balancewin) VALUES ($1, $2)`, [gameState.lastBetterName, userShare]);
          await pool.query('UPDATE userstats SET winsoas = winsoas + $1 WHERE chatid = $2', [userShare, gameState.lastBetter]);
         }
         if(games[gameId].isTon == 2){
          if (referalShare > 0) {
            
            await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [referalShare, referal]);
            await pool.query('UPDATE userstats SET winton = winton + $1 WHERE chatid = $2', [referalShare, referal]);
          }
          if (adminAccount) {
            await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [adminShare, adminAccount]);
          }
          await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [userShare, gameState.lastBetter]);
          await pool.query(`INSERT INTO balancewinhistory_${gameId} (account, balancewin) VALUES ($1, $2)`, [gameState.lastBetterName, userShare]);
          await pool.query('UPDATE userstats SET winton = winton + $1 WHERE chatid = $2', [userShare, gameState.lastBetter]);
          
         }
       } else {
          console.log("err");
      //   if(games[gameId].isTon == 1){
      //    if (adminAccount) {
      //     await pool.query('UPDATE accounts SET balance = balance + $1 WHERE account = $2', [totalBalanceBet * 0.1, adminAccount]);
      //    }
      //  }
      //  else{
      //   if (adminAccount) {
       //     await pool.query('UPDATE accounts SET balance = balance + $1 WHERE account = $2', [totalBalanceBet * 0.1, adminAccount]);
      //    }
      //  }
      //  else{
      //   if (adminAccount) {
      //     await pool.query('UPDATE accounts SET balanceOas = balanceOas + $1 WHERE account = $2', [totalBalanceBet * 0.1, adminAccount]);
      //    }
      //  }
    }
    // await pool.query(`DELETE FROM bethistory_${gameId}`);
     broadcastToClients({ type: 'resetHistory', gameId: gameId, totalBalanceBet: userShare, lastBetterName: gameState.lastBetterName });
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
 //98992800
 //98991300
 //98992800
 app.post('/set-balance-bet', async (req, res) => {
  const { account, accountName, amountbet, gameId, valute } = req.body;
  console.log(valute);
  //ton
  if(valute == '2'){
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

      await pool.query(`INSERT INTO bethistory_${gameId} (account, balancebet) VALUES ($1, $2)`, [accountName, amountbet]);

      broadcastToClients({ type: 'historyUpdate', accountName, amountbet, gameId });

      startGame(gameId, account, accountName, amountbet, valute);

      res.json({ success: true });
    } catch (err) {
      console.error('Error setting balance bet:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
  //oas
  if(valute == '1'){
    try {

      const balanceResult = await pool.query('SELECT balanceOas FROM accounts WHERE chatid = $1', [account]);

      if (balanceResult.rows.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
      const currentBalance = balanceResult.rows[0].balance;

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

      
      broadcastToClients({ type: 'historyUpdate', accountName, amountbet, gameId });

      startGame(gameId, account, accountName, amountbet, valute);

      res.json({ success: true });
    } catch (err) {
      console.error('Error setting balance bet:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

});

app.post('/total-bet', async (req, res) => {
  const {gameId} = req.body;
  const totalBet = await pool.query(`SELECT SUM(amountbet) as totalbalancebet FROM accountsbet_${gameId}`);
        
  res.json({ totalBet: totalBet });
})
 app.get('/max-bet', async (req, res) => {
   const { gameId } = req.query;
   try {
     const result = await pool.query(`
       SELECT account, amountbet
       FROM accountsbet_${gameId}
       WHERE amountbet = (
         SELECT MAX(amountbet)
         FROM accountsbet_${gameId}
       )
       LIMIT 1
     `);

     if (result.rows.length > 0) {
       res.json(result.rows[0]);
     } else {
       res.status(404).json({ error: 'No bets found' });
     }
   } catch (err) {
     console.error('Error fetching max bet from accountsbet:', err);
     res.status(500).json({ error: 'Something went wrong' });
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



app.get('/balance',  async (req, res) => {
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
  app.post('/increment', async (req, res) => {
    const { account, amount } = req.body;
    try {
      await pool.query('UPDATE accounts SET balance = balance + $1 WHERE chatid = $2', [amount, account]);
      res.json({ success: true });
  
    } catch (err) {
      console.error('Error incrementing balance:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  
  app.post('/increment-oas', async (req, res) => {
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
  
  
  app.post('/quest',async (req, res) => {
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

  
  app.post('/check-daily-quest', async (req, res) => {
    const { userId } = req.body;
  
    try {
      // Получаем последнюю выполненную запись квеста
      const lastQuestQuery = `
        SELECT * FROM daily_quests
        WHERE user_id = $1
        ORDER BY quest_date DESC
        LIMIT 1;
      `;
      const lastQuestResult = await pool.query(lastQuestQuery, [userId]);
      if (lastQuestResult.rows.length === 0) {
  
        const insertQuery = `
          INSERT INTO daily_quests (user_id, day_number, quest_date, reward, clime)
          VALUES ($1, 1, CURRENT_DATE, 1000, 0)
          RETURNING *;
        `;
        const insertResult = await pool.query(insertQuery, [userId]);
  
  
        // Если пользователь еще не выполнял квесты
        return res.status(200).json({
          dayNumber: 1,
          message: 0,
        });
      }
  
      const lastQuest = lastQuestResult.rows[0];
      const lastQuestDate = new Date(lastQuest.quest_date);
      const today = new Date();
      const isClimed = lastQuest.clime
      // Проверяем, был ли пропущен хотя бы один день
      const oneDayInMillis = 24 * 60 * 60 * 1000;
      const daysDifference = Math.floor((today - lastQuestDate) / oneDayInMillis);
  
      if (daysDifference > 1) {
        // Если пропущен хотя бы один день, обнуляем прогресс
        await pool.query('DELETE FROM daily_quests WHERE user_id = $1', [userId]);
        return res.status(200).json({
          dayNumber: 1,
          message: 0,
        });
      } else if (daysDifference === 1) {
        // Если новый день, увеличиваем day_number
        const newDayNumber = lastQuest.day_number + 1;
  
        // Сброс до 1-го дня, если достигнут лимит в 30 дней
        const updatedDayNumber = newDayNumber > 30 ? 1 : newDayNumber;
  
        // Обновляем запись с новым day_number
        const reward = 1000 + (updatedDayNumber - 1) * 200;
  
        const updateQuery = `
          UPDATE daily_quests
          SET day_number = $1, quest_date = CURRENT_DATE, reward = $3, clime = $4
          WHERE id = $2
          RETURNING day_number;
        `;
        const updateResult = await pool.query(updateQuery, [updatedDayNumber, lastQuest.id, reward, 0]);
  
        return res.status(200).json({
          dayNumber: updateResult.rows[0].day_number,
          message: 0,
        });
      } else {
        // Если квесты выполнялись без пропусков и сегодня еще не начался новый день
        if(isClimed == 0){
          return res.status(200).json({
            dayNumber: lastQuest.day_number,
            message: 0,
          });
        }
        if(isClimed == 1){
          return res.status(200).json({
            dayNumber: lastQuest.day_number,
            message: 1,
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
  
  
  app.post('/find-referals', async (req, res) => {
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
      console.log("referal")
      if (result.rows.length === 0) {
        console.log("fail")
        return res.status(404).json({ message: 'No referals found for this chatId' });
      }
  
      const accountNames = result.rows.map(row => row.accountname);
      console.log(accountNames)
  
      res.status(200).json({ accountNames });
    } catch (error) {
      console.error('Error finding referals:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/daily-quest', async (req, res) => {
    const { userId } = req.body;
  
    try {
      // Проверяем, был ли квест уже выполнен сегодня
      const todayQuery = `
        SELECT clime FROM daily_quests
        WHERE user_id = $1;
      `;
      const todayResult = await pool.query(todayQuery, [userId]);
  
      if (todayResult.rows.length > 0) {
        return res.status(400).json({
          message: 'You have already completed today\'s quest.',
        });
      }
  
      // Обновляем значение clime на 1 в таблице daily_quests
      const updateClimeQuery = `
        UPDATE daily_quests
        SET clime = 1
        WHERE user_id = $1 AND quest_date = CURRENT_DATE
        RETURNING *;
      `;
      const updateResult = await pool.query(updateClimeQuery, [userId]);
  
      if (updateResult.rows.length === 0) {
        return res.status(404).json({
          message: 'No quest found for today to update.',
        });
      }
  
      // Обновляем баланс пользователя и climed
      try {
        const reward = updateResult.rows[0].reward;
  
       await pool.query('UPDATE accounts SET balanceoas = balanceoas + $1 WHERE chatid = $2', [reward, userId]);
        await pool.query('UPDATE accounts SET climed = climed + $1 WHERE chatid = $2', [reward, userId]);
  
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
  app.post('/climed-oas', async (req, res) => {
    const { account } = req.body;
    try {
      const result = await pool.query('SELECT climed FROM accounts WHERE chatid = $1', [account]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching balance:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  app.post('/decrement', async (req, res) => {
      const { account, amount } = req.body;
      try {
        await pool.query('UPDATE accounts SET balance = balance - $1 WHERE chatid = $2', [amount, account]);
        res.json({ success: true });
  
      } catch (err) {
        console.error('Error decrementing balance:', err);
        res.status(500).json({ error: 'Something went wrong' });
      }
    });
  
    app.post('/create-account', async (req, res) =>  {
      const { chatid, accountname, account, referal } = req.body;
          console.log(chatid)
          console.log(referal)
      try {
        
        const actualReferal = chatid === referal ? -1 : referal;
  
        const result = await pool.query('SELECT balance FROM accounts WHERE chatid = $1', [chatid]);
  
        if (result.rows.length > 0) {
          
        const resultOas = await pool.query('SELECT balanceOas FROM accounts WHERE chatid = $1', [chatid]);

        if (resultOas.rows.length > 0) {
        console.log(resultOas.rows[0].balanceoas)
        console.log(result.rows[0].balance)

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
        let balanceOasRef = 0
        if(actualReferal != -1){
            balanceOasRef = 20000
        }
        else{
            balanceOasRef = 0
        }
       await pool.query(
        'INSERT INTO accounts (chatid, accountname, balance, balanceoas, account, referal, climed, totalwin, totallose) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0)',
          [chatid, accountname, 125235250, 12456542, account, actualReferal, 0]
        );
        await pool.query('UPDATE accounts SET balanceoas = balanceoas + $1 WHERE chatid = $2', [20000, actualReferal]);
        // const sanitizedAccount = chatid.replace(/[^a-zA-Z0-9]/g, '_');
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS transactionHistory_${chatid} (
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
        const query = `
            INSERT INTO userstats (chatid, accountname, winsoas, lostoas, winton, lostton, taps)
             VALUES ($1, $2, 0, 0, 0, 0, 0);
            `;
        const values = [chatid, accountname];

        await pool.query(query, values);
        // const insertDefaultQuery = `
        //   INSERT INTO transactionHistory_${sanitizedAccount}
        //   (account, contractAddr, lt, status, amountBalance)
        //   VALUES ($1, 'default_contract', -500, -100, -500)
        // `;
        // await pool.query(insertDefaultQuery, [account]);

        // const insertDefaultQuery1 = `
        //   INSERT INTO transactionHistory_${sanitizedAccount}
        //   (account, contractAddr, lt, status, amountBalance)
        //   VALUES ($1, 'default_contract', -500, 100, -500)
        // `;
        // await pool.query(insertDefaultQuery, [account]);

        await pool.query('COMMIT');

        res.json({ success: true, balance: 0 });
      }
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error('Error creating account:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  app.get('/user-stats', async (req, res) => {
    const { chatId } = req.query;
  
    if (!chatId) {
      return res.status(400).json({ message: 'chatId is required' });
    }
  
    try {
      const query = `
        SELECT winsoas, lostoas, winton, lostton, taps
        FROM userstats
        WHERE chatid = $1;
      `;
      
      const result = await pool.query(query, [chatId]);
        console.log(result.rows);
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
  

  app.get('/top-accounts', async (req, res) => {
   
    try {
      const query = `
        SELECT chatid, accountname, winsoas, lostoas, winton, lostton, (winsoas + lostoas + winton + lostton) AS turnover
        FROM userstats
        ORDER BY turnover DESC;
      `;
      
      const result = await pool.query(query);
      console.log(result.rows);
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
  app.post('/last-transaction', async (req, res) => {
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
  
      // Выбираем все транзакции со статусом -100 или 100, которые произошли в последние 1 час
      const selectQuery = `
        SELECT * FROM transactionHistory_${account}
        WHERE status IN (-100, 100) AND transactionDate > NOW() - INTERVAL '1 hours'
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
  

  app.post('/new-transaction', async (req, res) => {
    const { account, contractAddr, lt, status, amountBalance } = req.body;
    try {
      const sanitizedAccount = account.replace(/[^a-zA-Z0-9]/g, '_');
      const insertQuery = `
        INSERT INTO transactionHistory_${sanitizedAccount} (account, contractAddr, lt, status, amountBalance)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await pool.query(insertQuery, [account, contractAddr, lt, status, amountBalance]);
      res.json({ success: true });
    } catch (err) {
      console.error('Error adding new transaction:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });


  app.post('/update-transaction-status', async (req, res) => {
    const { id, account, lt, newStatus } = req.body;
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
  app.post('/get-transaction-by-lt', async (req, res) => {
    const { account, lt } = req.body;
    
    try {
      // Находим все chatid, которые соответствуют переданному account
      const selectChatIdsQuery = `
        SELECT chatid FROM accounts 
        WHERE account = $1;
      `;
      const chatIdsResult = await pool.query(selectChatIdsQuery, [account]);
      console.log('chatID RESULT', chatIdsResult.rows)
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
        console.log(transactionResult)
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

app.post("/validate-init", (req, res) => {
    const data = new URLSearchParams(req.body);

    const data_check_string = getCheckString(data);
    console.log(data)
    const secret_key = HMAC_SHA256("WebAppData", "7447660458:AAFoFXLKY1brSpjfrOS-PpHUrZb7N7u-ln8").digest();
    const hash = HMAC_SHA256(secret_key, data_check_string).digest("hex");

    if (hash === data.get("hash"))
            // validated!
            return res.json(Object.fromEntries(data.entries()));
    return res.status(401).json({});
});

const TELEGRAM_BOT_TOKEN = '7447660458:AAFoFXLKY1brSpjfrOS-PpHUrZb7N7u-ln8';
const TELEGRAM_CHAT_ID = '@fjsnfdc';
const TELEGRAM_CHANNEL_ID = '@teskfbs'

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

async function isSubscribedChat(userId) {
  try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${TELEGRAM_CHAT_ID}&user_id=${userId}`;
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
app.post('/check_subscription_chat', async (req, res) => {
  const { user_id } = req.body;
  const subscribed = await isSubscribedChat(user_id.toString());
  res.json({ subscribed });
  });
