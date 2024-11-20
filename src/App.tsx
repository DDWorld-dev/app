import { useState, useEffect, useRef } from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
// import { useTonConnect } from './hooks/useTonConnect';
// scp -r D:\TonSmartContract\my-twa\dist root@95.163.229.37:/mainProject/my-twa
import { useCounterContract } from './hooks/useCounterContract';
import { useTonAddress } from '@tonconnect/ui-react';
import { useTonClient } from './hooks/useTonClient';
import '@twa-dev/sdk';
import { useWithdrawl } from './hooks/useWithdrawl';
import axios from 'axios';
import { Address } from '@ton/core';

import { useSwipeable } from 'react-swipeable';

import  main from "./assets/main.png"
import  quests from "./assets/quests.png"
import  referal from "./assets/referal.png"
import  leaderboard from "./assets/leaderboard.png"
import  profile from "./assets/profile.png"

import  main1 from "./assets/main1.png"
import  quests1 from "./assets/quests1.png"
import  referal1 from "./assets/referal1.png"
import  leaderboard1 from "./assets/leaderboard1.png"
import  profile1 from "./assets/profile1.png"
import gameJin from "./assets/gameJin.png"
import gameJinAct from "./assets/gameJinAct.png"
import winGame from "./assets/winGame.png"
import x from "./assets/x.png"
import starting2 from './assets/starting2.png'
import menuStart from './assets/menuStart.png'
import tokenTonCent from './assets/tokenTonCent.png'
import join1 from './assets/join1.png'
import join2 from './assets/join2.png'
import join3 from './assets/join3.png'


import tokenOas from "./assets/tokenOas.png"
import tokenTon from "./assets/tokenTon.png"
// import logoProf from "./assets/logoProf.png"
import btn from "./assets/btn.png"
import contact from "./assets/contact.png"
import term from "./assets/term.png"
import news from "./assets/news.png"

import gameLamp from "./assets/gameLamp.png"
import gold from "./assets/gold.png"
import copyPng from "./assets/copyPng.png"
// import coin from './assets/coin.png' 



import telegramLogo from "./assets/telegram.png"

//import LottieAnimation from './hooks/LottieAnimation';
//import animationData from './assets/lamp.json';

import lamp2 from "./assets/lamp2.png"
import lamp from "./assets/lamp.png"
import lamp3 from "./assets/lamp3.png"
import lampDay from "./assets/lampDay.png"
//import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
interface Bet {
  account: string;
  balancebet: number;
}


function App() {
  const [images, setImages] = useState(['']);
  const [images1, setImages1] = useState(['']);

  // const { connected } = useTonConnect();
  const [amount, setAmount] = useState<string>('0');
  const { value, sendMoneyInContract, addr, flag1, flag1S, setSend1, setSendS1 } = useCounterContract();
  const { sendMoney, flag, flagS, setSend, setSendS } = useWithdrawl();
  const rawAddress = useTonAddress();

  value
  const [accountName, setAccountName] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceToken, setBalanceToken] = useState<string | null>(null);
  
  //const [token, setToken] = useState<number | null>(null)

  const [balanceChanges, setBalanceChanges] = useState<string[]>([]);
  const [timer, setTimer] = useState<string | null>(null);
  const [timerColl, setTimerColl] = useState<string | null>(null);


  const [totalBalanceBet, setTotalBalanceBet] = useState<number | null>(0);
  const [lastBetter, setLastBetter] = useState<string | null>(null);

  const client = useTonClient()

  //referal in link
  const [startParam1, setStartParam] = useState(0);
  startParam1
  const [idChat, setIdChat] = useState<number | null>();
  const [isToken, setIsTokenState] = useState('1');
  const [gameJinMain, setGameJinMain] = useState(gameJin);
  
  const [isPage, setIsPageState] = useState('0');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем, нужно ли показывать загрузочный экран
    if (isPage && !['0', '1', '2', '3', '4', '5'].includes(isPage)) {
      setIsLoading(true); // Включаем загрузочный экран


      const timer = setTimeout(() => {
        setIsLoading(false); // Скрываем загрузочный экран после 1 секунды
      }, 1000);

      // Очищаем таймер при изменении isPage
      return () => clearTimeout(timer);
    } else {
      // Если страница равна '1', '2', '3', '4', '5', немедленно скрываем загрузочный экран
      setIsLoading(false);
    }
  }, [isPage]);

  useEffect(() => {
    const handleAddressChange = async () => {
      if (rawAddress) {
        try {
          const token = await fetchCsrfToken();
          await axios.post(
            'https://subgameserf.ru:4000/add-address',
            { chatid: idChat, account: Address.parse(rawAddress).toString() },
            {
              headers: {
                'X-CSRF-Token': token,
              },
              withCredentials: true,
            }
          );
          // console.log('rawAddress is not empty:', rawAddress);
          // console.log('Server response:', response.data);
        } catch (error) {
          // console.error('Error posting address:', error);
        }
      }
    };
    handleAddressChange();
  }, [rawAddress]);

  const handleSetToken = (value: any) => {
    if (value === 1 || value === 2) {
      setIsTokenState(value.toString());
    } else {
      // console.error('Value must be 1 or 2');
    }
  };
  const [onlineCounts, setOnlineCounts] = useState([0, 0, 0]); 
  useEffect(() => {
    // Вызываем onlineCheck, передавая нужный typeGame
    onlineCheck(1); // Или onlineCheck(2) в зависимости от вашего типа игры
  }, []);

  const onlineCheck = async (typeGame: any) => {
    const token = await fetchCsrfToken();
    let response;

    if (typeGame === 1) {
      response = await axios.post(
        'https://subgameserf.ru:4000/check-online',
        { gameId1: 'gameoas1', gameId2: 'gameoas2', gameId3: 'gameoas3' },
        {
          headers: {
            'X-CSRF-Token': token
          },
          withCredentials: true
        }
      );
    } else if (typeGame === 2) {
      response = await axios.post(
        'https://subgameserf.ru:4000/check-online',
        { gameId1: 'game1', gameId2: 'game2', gameId3: 'game3' },
        {
          headers: {
            'X-CSRF-Token': token
          },
          withCredentials: true
        }
      );
    }

    if (response && response.data) {
      // Присваиваем данные в состояние
      setOnlineCounts([
        response.data.count1 || 0,
        response.data.count2 || 0,
        response.data.count3 || 0
      ]);
    }
  };
  const handleSetPage = (Page: any) => {
    if (Page === 0 || Page === 1 || Page === 2 || Page === 3 || Page === 4 || Page === 5 || Page == 6 || Page == 7 || Page == 8) {

      hapticFeedback.impactOccurred("medium");
      handlePopClick('stop')
      if(Page === 0){
        app.BackButton.hide()
      }
      if(Page === 1){
        app.BackButton.show();
        if(isToken == '1'){
          onlineCheck(1)
        }
        if(isToken == '2'){
          onlineCheck(2)
         
        }
      }

      if(Page === 3){
        
        handleSetReferal() 
        app.BackButton.hide()
      }

      if(Page === 2){
        
        checkDay(idChat)

        checkComplite()

        const iscont = localStorage.getItem('connection')
        if(rawAddress && iscont != '3'){
          setConnectedAddr('2')
          localStorage.setItem('connection', '2')
        }
        app.BackButton.hide()
        
      }
      if(Page === 4){
        fetchTopAccounts()
        fetchStats()
        app.BackButton.hide()
      }
      if(Page == 5){
        oracle()
        app.BackButton.hide()
      }

    
      if((Page == 6 ) && isToken == '2'){
        setIsLoading(true)
        changeGame('game1')
        app.BackButton.show();
        Page = 60
        setIsPageState(Page.toString());
       
        setActTime('');
        setIsVisible(false);
        

       

        setTimer(null)
        setImages([])
        setImages1([])
        // fetchRecentBets()

      }if((Page == 6 ) && isToken == '1'){
        setIsLoading(true)
        changeGame('gameOas1')
        app.BackButton.show();
        setTimer(null)
        setIsPageState(Page.toString());
        setActTime('');
        setIsVisible(false);
        setImages([])
        setImages1([])
       
        // fetchRecentBets()
      }
      if((Page == 7 ) && isToken == '2'){
        setIsLoading(true)
        changeGame('game2')
        app.BackButton.show();

        setTimer(null)
        Page = 70
        setIsPageState(Page.toString());
        setActTime('');
        setIsVisible(false);
        setImages([])
        setImages1([])
        // fetchRecentBets()
      
      }if((Page == 7 ) && isToken == '1'){
        setIsLoading(true)
        changeGame('gameOas2')
        app.BackButton.show();
        setTimer(null)
        setActTime('');
        setIsVisible(false);
        setIsPageState(Page.toString());
        setImages([])
        setImages1([])

        // fetchRecentBets()
      
      }
      if((Page == 8 ) && isToken == '2'){
        setIsLoading(true)
        changeGame('game3')
        app.BackButton.show();
        setTimer(null)
        Page = 80
        setIsPageState(Page.toString());
        setActTime('');
        setIsVisible(false);
        setImages([])
        setImages1([])
        // fetchRecentBets()
      
      }
      if((Page == 8 ) && isToken == '1'){
        setIsLoading(true)
        changeGame('gameOas3')
        app.BackButton.show();
        setTimer(null)
        setActTime('');
        setIsVisible(false);
        setIsPageState(Page.toString());
        setImages([])
        setImages1([])
    
        // fetchRecentBets()
      
      }    
      else{
        setIsPageState(Page.toString());
      }
    } else {
      // console.error('Page must be 1 or 2, 3, 4');
    }
  };


  const [checkTg, setCheckTg] = useState(() => {
    const savedAmount = localStorage.getItem('checkTg');
    return savedAmount !== null ? savedAmount : '0';
  });
  const [checkTgChat, setCheckTgChat] = useState(() => {
    const savedAmount = localStorage.getItem('checkTgChat');
    return savedAmount !== null ? savedAmount : '0';
  });
  const [taskComplete, settaskComplete] = useState('0');
  const [coinReciver, setcoinReciver] = useState('0');
  
const app = window.Telegram.WebApp;
app.ready();
app.expand() 
const hapticFeedback = app.HapticFeedback;
  app.onEvent('backButtonClicked', () => {
    if(isPage == '1'){
      setIsPageState('0')
      app.BackButton.hide()
      
    }else{
      setIsPageState('1')
      app.BackButton.show()
    }
    

   
});
// app.disableVerticalSwipes()
//Функция перехода в канал для подписки
const sendLink = () => {
    app.ready()
    app.openTelegramLink("https://t.me/teskfbs")
    localStorage.setItem('checkTg', '1')
    setCheckTg('1')
}

const sendLinkChat = () => {
  app.ready()
  app.openTelegramLink("https://t.me/fjsnfdc")
  localStorage.setItem('checkTgChat', '1')
  setCheckTgChat('1')
}



const checkComplite = async () => {
  try {
    // Получаем CSRF-токен
    const token = await fetchCsrfToken();

    // Выполняем POST-запрос к серверу
    const response = await axios.post(
      'https://subgameserf.ru:4000/task-complite',
      { userId: idChat },
      {
        headers: {
          'X-CSRF-Token': token
        },
        withCredentials: true
      }
    );

    // Получаем данные из ответа
    const { count, climed } = response.data;

    // Обновляем состояние taskComplete, преобразовывая его в строку
    settaskComplete(count.toString());

    // Вызываем функцию setcoinReciver, если это необходимо
    if(Number(climed) >= 1000000000000){
      const formattedBalance = (Number(climed) / 1000000000000).toFixed(1).toString() + "D";
      setcoinReciver(formattedBalance);
    } else if (Number(climed) >= 1000000) {
      const formattedBalance = (Number(climed) / 1000000).toFixed(1).toString() + "M";
      setcoinReciver(formattedBalance);
    } else if (Number(climed) >= 1000) {
      const formattedBalance = (Number(climed) / 1000).toFixed(1).toString() + "K";
      setcoinReciver(formattedBalance);
    } else {
      const formattedBalance = climed.toString();
      setcoinReciver(formattedBalance);
      
    }
    
  } catch (error) {
    // console.error('Error checking task completion:', error);
    // Здесь можно добавить обработку ошибки, например, показать уведомление пользователю
  }
};

const rewardOas = async ( questid: any) => {
  const token = await fetchCsrfToken()

    hapticFeedback.impactOccurred("medium");
    if(questid == 1){
      localStorage.setItem('checkTg', '3')
      setCheckTg('3')
      
      await axios.post('https://subgameserf.ru:4000/quest', { userId: idChat, questId: questid},
        {
          headers: {
            'X-CSRF-Token': token
          },
          withCredentials: true
        })
        // console.log(value);
    

    }
    if(questid == 2){
      localStorage.setItem('checkTgChat', '3')
      setCheckTgChat('3')
      
     await axios.post('https://subgameserf.ru:4000/quest', { userId: idChat, questId: questid },
        {
          headers: {
            'X-CSRF-Token': token
          },
          withCredentials: true
        })
        
        // console.log(value);
    }

    const balanceResponse = await axios.get('https://subgameserf.ru:4000/balance', {
      params: {
        account: idChat,
        valute: '1',
      },
      headers: {
        'X-CSRF-Token': token,
      },
      withCredentials: true,
    });

    const currentBalanceOas = balanceResponse.data.balanceoas;
    if(Number(currentBalanceOas) >= 1000000000000){
      const formattedBalance = (currentBalanceOas / 1000000000000).toFixed(1).toString() + "D";
      setBalanceToken(formattedBalance);
    } else if (Number(currentBalanceOas) >= 1000000) {
      const formattedBalance = (currentBalanceOas / 1000000).toFixed(1).toString() + "M";
      setBalanceToken(formattedBalance);
    } else if (Number(currentBalanceOas) >= 100000) {
      const formattedBalance = (currentBalanceOas / 1000).toFixed(1).toString() + "k";
      setBalanceToken(formattedBalance);
    } else {
      const formattedBalance = currentBalanceOas.toString();
      setBalanceToken(formattedBalance);
    }
    await checkComplite()

 
}

const [dayNumber, setDayNumber] = useState(() => {
  const dayNumber1 = localStorage.getItem('dayNumber');
  return dayNumber1 !== null ? dayNumber1 : '0'
});
const [dayNew, setDayNew] = useState(() => {
  const dayNumbe1 = localStorage.getItem('dayNew');
  return dayNumbe1 !== null ? dayNumbe1 : '0';
});

const checkDay = async (id: any) => {
  const token = await fetchCsrfToken()
   
    const response = await axios.post('https://subgameserf.ru:4000/check-daily-quest', { userId: id},
    {
      headers: {
        'X-CSRF-Token': token
      },
      withCredentials: true
    })
    
    const dayNumberNow = response.data.dayNumber;
    const dayNew = response.data.message
    const isLoad = response.data.load
    
    localStorage.setItem('dayNumber',  dayNumberNow);
    setDayNumber(dayNumberNow.toString()); 
    localStorage.setItem('dayNew', dayNew);
    setDayNew(dayNew.toString());

    if(isLoad == 1){
      handlePopClick('activePop')
    }

 
}

const newDayQuest  = async () => {

  hapticFeedback.impactOccurred("medium");
  localStorage.setItem('dayNew', '1');
  setDayNew('1');
  const token = await fetchCsrfToken()
   
  const response = await axios.post('https://subgameserf.ru:4000/daily-quest', { userId: idChat},
  {
    headers: {
      'X-CSRF-Token': token
    },
    withCredentials: true
  })

  const balanceResponse = await axios.get('https://subgameserf.ru:4000/balance', {
    params: {
      account: idChat,
      valute: '1',
    },
    headers: {
      'X-CSRF-Token': token,
    },
    withCredentials: true,
  });

  const currentBalanceOas = balanceResponse.data.balanceoas;
  if(Number(currentBalanceOas) >= 1000000000000){
    const formattedBalance = (currentBalanceOas / 1000000000000).toFixed(1).toString() + "D";
    setBalanceToken(formattedBalance);
  } else if (Number(currentBalanceOas) >= 1000000) {
    const formattedBalance = (currentBalanceOas / 1000000).toFixed(1).toString() + "M";
    setBalanceToken(formattedBalance);
  } else if (Number(currentBalanceOas) >= 100000) {
    const formattedBalance = (currentBalanceOas / 1000).toFixed(1).toString() + "k";
    setBalanceToken(formattedBalance);
  } else {
    const formattedBalance = currentBalanceOas.toString();
    setBalanceToken(formattedBalance);
  }


  const questData = response.data.data;

  const dayNumberNow = questData.day_number;

  localStorage.setItem('dayNumber', dayNumberNow.toString());
  setDayNumber(dayNumberNow.toString());  
  await checkComplite()

}

const [csrfToken, setCsrfToken] = useState('');
  csrfToken
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('https://subgameserf.ru:4000/form', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
      return response.data.csrfToken;
    } catch (error) {
      // console.error('Error fetching CSRF token:', error);
      return null;
    }
  };
//Эффект при загрузке страницы инициализирует данные сыылки телеграм миниапп

    const validateInitData = async (token: any) => {
      const hasVisited = localStorage.getItem('hasVisited');
    
      if (!hasVisited) {
        // Если метки нет, значит это первый заход
        setIsFirstVisit(true);
        setIsPageState('100')
        
        // Устанавливаем метку о том, что пользователь уже был на сайте
        localStorage.setItem('hasVisited', 'true');
      }
      
      try {
       
        const response = await axios.post('https://subgameserf.ru:4000/validate-init', new URLSearchParams(app.initData), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-Token': token
          },
          withCredentials: true
        });    
        if (response.status === 200) {
          
          const startParam = response.data;
          
          setStartParam(startParam.start_param)
          const id = JSON.parse(startParam.user)
     
          setIdChat(id.id)
          if(hasVisited == 'true'){
            checkDay(id.id)
          }
          let accountAddress = ""
          if(rawAddress){
             accountAddress = Address.parse(rawAddress).toString()
          }else{
             accountAddress = ""
          }
          let referal = "-1";
          if(startParam.start_param && startParam.start_param != id.id){
            referal = startParam.start_param
          }else{
            referal = "-1"
          }
          let userName = "oasis_player"
          if(id.username){
            userName = id.username
          }
          else{
              userName = "oasis_player"
          }
          const balanceStart = await axios.post('https://subgameserf.ru:4000/create-account', 
            { 
              chatid: id.id, 
              accountname: userName,
              account: accountAddress, 
              referal: referal
            }, 
            {
              headers: {
                'X-CSRF-Token': token
              },
              withCredentials: true
            }
          )
          
              
              setBalance((Number(balanceStart.data.balance) / 1_000_000_000).toString());
              setAccountName(userName)
              const balanceToken = balanceStart.data.balanceOas
      
              if(Number(balanceToken) >= 1000000000000){
                const formattedBalance = (balanceToken / 1000000000000).toFixed(1).toString() + "D";
                setBalanceToken(formattedBalance);
              } else if (Number(balanceToken) >= 1000000) {
                const formattedBalance = (balanceToken / 1000000).toFixed(1).toString() + "M";
                setBalanceToken(formattedBalance);
              } else if (Number(balanceToken) >= 100000) {
                const formattedBalance = (balanceToken / 1000).toFixed(1).toString() + "k";
                setBalanceToken(formattedBalance);
              } else {
                const formattedBalance = balanceToken.toString();
                setBalanceToken(formattedBalance);
              }
      
              
            
          return { startParam: startParam.start_param, id: id.id };
        } else {
          
          // console.error('Failed to validate initData');
        }
      } catch (error) {
        // console.error('Error validating initData', error);
      }
    };


    useEffect(() => {
      const initializeAccount = async () => {
        
          const token = await fetchCsrfToken();
          // await handleCheckOrCreateAccount();
          //const token = "0"
          if (token) {
            await validateInitData(token)
          }
        
      };
  
      initializeAccount();
    }, []);
     

  
 //Функция создает реферальную ссылку которую можно отправить либо через телеграм
  const handleShareClick = () => {
    if (idChat !== 0 && idChat !== null && idChat !== undefined) {
      const url = encodeURIComponent(`https://t.me/SubGameSerfe_bot/start?startapp=${idChat}`);
      const text = encodeURIComponent('Try to play oasis');
      const telegramShareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
      window.open(telegramShareUrl, '_blank');
    }
    
  };

  //Тоже самое но копирует ссылку
  const handleCopyClick = () => {
    if (idChat !== 0 && idChat !== null && idChat !== undefined) {
      const link = `https://t.me/SubGameSerfe_bot/start?startapp=${idChat}`;
      navigator.clipboard.writeText(link)
        .then(() => {
          alert('Ссылка скопирована в буфер обмена!');
        })
        // .catch(err => {
        //   // console.error('Ошибка при копировании ссылки:', err);
        // });
    }
  };



  

  // const handleCheckOrCreateAccount = async () => {
    
  //     console.log("IN CREATE");
      

  //   // const referal = startParam ? startParam.toString() : "-1";

  //   let accountAddress = ""
  //         if(rawAddress){
  //            accountAddress = Address.parse(rawAddress).toString()
  //         }else{
  //            accountAddress = "no"
  //         }
  //   axios.post('http://localhost:4000/create-account', 
  //     { 
  //       chatid: 8593458, 
  //       accountname: "@youngboyforever",
  //       account: accountAddress, 
  //       referal: '-1'
  //     }
  //   )
  //     .then(response => {
  //       console.log(response);

  //       setBalance((Number(response.data.balance) / 1_000_000_000).toString());
  //       setAccountName("@youngboyforever")
  //       setIdChat(8593458)
  //       const balanceToken = response.data.balanceOas;
  //       console.log(balanceToken, "TOKEN");

  //       if(Number(balanceToken) >= 1000000000000){
  //         const formattedBalance = (balanceToken / 1000000000000).toFixed(1).toString() + "D";
  //         setBalanceToken(formattedBalance);
  //       } else if (Number(balanceToken) >= 1000000) {
  //         const formattedBalance = (balanceToken / 1000000).toFixed(1).toString() + "M";
  //         setBalanceToken(formattedBalance);
  //       } else if (balanceToken >= 1000) {
  //         const formattedBalance = (balanceToken / 1000).toFixed(1).toString() + "k";
  //         setBalanceToken(formattedBalance);
  //       } else {
  //         const formattedBalance = balanceToken.toString();
  //         setBalanceToken(formattedBalance);
  //       }

  //       console.log(response.data.balance, "RELOAD ACCOUNT");
  //     })
  //     .catch(error => console.error('Error checking or creating account:', error));
  // };

  // Инициализация аккаунта при заходе на сайт, работает когда будет сделан connect
  
  //Функция которая создаст акканут когда будет connect
  

  // Функция будет настроена чтоб транзакции сканились только когда ты на главных страниах где видны балансы а в игре нет для уменьшения нагрузки
 
    const [intervalOutId, setIntervalOutId] = useState<NodeJS.Timeout | null>(null);
    const [intervalInId, setIntervalInId] = useState<NodeJS.Timeout | null>(null);
    const [timerOutId, setTimerOutId] = useState<NodeJS.Timeout | null>(null);
    const [timerInId, setTimerInId] = useState<NodeJS.Timeout | null>(null);
  
    // Для checkTransactionOut
    useEffect(() => {
      // console.log("INFE");
      
      const fl = localStorage.getItem('flag1S');
      if (fl === 'true') {
        setSendS1(true);
      }
    
      if (flag1S && ['0', '1', '2', '3', '4', '5'].includes(isPage)) {
        localStorage.setItem('flag1S', flag1S.toString());
    
        // Устанавливаем интервал, если он еще не установлен
        if (intervalOutId === null) {
          const id = setInterval(() => {
            checkTransactionIn();
            // console.log("Check Transaction IN");
          }, 1000); // Вызываем раз в секунду
          setIntervalOutId(id);
    
          // Устанавливаем таймер на 60 секунд
          const timer = setTimeout(() => {
            if (id !== null) {
              clearInterval(id); // Очищаем интервал после 60 секунд
              setIntervalOutId(null); // Сбрасываем идентификатор интервала
              setSendS1(false); // Вызываем setSendS1 для завершения процесса
              localStorage.setItem('flag1S', ''); // Сбрасываем значение в localStorage
            }
          }, 300 * 1000); // 60 секунд
          setTimerOutId(timer); // Сохраняем идентификатор таймера
        }
      }
    
      return () => {
        // Очистка интервала и таймера при размонтировании компонента
        if (intervalOutId !== null) {
          clearInterval(intervalOutId);
          setIntervalOutId(null);
        }
        if (timerOutId !== null) {
          clearTimeout(timerOutId);
          setTimerOutId(null);
        }
        localStorage.setItem('flag1S', '');
      };
    }, [flag1S, isPage, intervalOutId, timerOutId]);
  
    // Для checkTransactionIn
    useEffect(() => {
      const fl = localStorage.getItem('flagS');
      if (fl === 'true') {
        setSendS(true);
      }
    
      if (flagS && ['0', '1', '2', '3', '4', '5'].includes(isPage)) {
        localStorage.setItem('flagS', flagS.toString());
    
        // Устанавливаем интервал, если он еще не установлен
        if (intervalInId === null) {
          const id = setInterval(() => {
            checkTransactionOut();
            // console.log("Check Transaction OUT");
          }, 1000); // Вызываем раз в секунду
          setIntervalInId(id);
    
          // Устанавливаем таймер на 5 минут (300 секунд)
          const timer = setTimeout(() => {
            if (id !== null) {
              clearInterval(id); // Очищаем интервал после 300 секунд
              setIntervalInId(null); // Сбрасываем идентификатор интервала
              setSendS(false); // Вызываем setSend для завершения процесса
              localStorage.setItem('flagS', ''); // Сбрасываем значение в localStorage
            }
          }, 300 * 1000); // 5 минут
          setTimerInId(timer); // Сохраняем идентификатор таймера
        }
      }
    
      return () => {
        // Очистка интервала и таймера при размонтировании компонента
        if (intervalInId !== null) {
          clearInterval(intervalInId);
          setIntervalInId(null);
        }
        if (timerInId !== null) {
          clearTimeout(timerInId);
          setTimerInId(null);
        }
        localStorage.setItem('flagS', '');
      };
    }, [flagS, isPage, intervalInId, timerInId]);
    



  //Функция скана странзакции на вывод
  const checkTransactionOut = async () => {
    try {
      const token = await fetchCsrfToken();
      const addressFrom = Address.parse(rawAddress)?.toString();
  
      if (addr && addressFrom) {
        const addressTo = Address.parse('EQAunf-Pn16zTTLildDPDoZpxilpTLYPqatVrTWM8a6K7IE8');
        const ltTransactions = await client?.getTransactions(addressTo, { limit: 10 });
  
        if (!ltTransactions || ltTransactions.length === 0) return;  // Если транзакций нет, выходим
  
        const response = await axios.post(
          'https://subgameserf.ru:4000/last-transaction',
          {
            account: idChat?.toString(),
            status: 100
          },
          {
            headers: {
              'X-CSRF-Token': token
            },
            withCredentials: true
          }
        );
  
        const lastTransactions = response.data;
        if (!lastTransactions || lastTransactions.length === 0) return;  
        for (const ltTransaction of ltTransactions) {
          const { exitCode: code } = ltTransaction.description.computePhase;
          const codelt = ltTransaction.lt;
          const srcAddr = ltTransaction.inMessage?.info.src;
          const destAddr = ltTransaction.inMessage?.info.dest;
          let valueout = -10000;

              try{
                valueout = ltTransaction.outMessages.get(0)?.info.value.coins;
              }catch{
                valueout = 0;
              }
              
          // Проверяем, если транзакция уже существует
          const findLt = await axios.post(
            'https://subgameserf.ru:4000/get-transaction-by-lt',
            { account: addressFrom, lt: codelt.toString() },
            {
              headers: { 'X-CSRF-Token': token },
              withCredentials: true
            }
          );
  
          if (findLt.data.exists) continue;  // Если транзакция уже существует, пропускаем
  
          const matchingTransactions = lastTransactions.filter((lastTransaction: any) =>
            srcAddr?.toString() === lastTransaction.account.toString() &&
            destAddr?.toString() === lastTransaction.contractaddr.toString() &&
            Number(lastTransaction.status) === 100 &&
            Number(valueout) === Number(lastTransaction.amountbalance)
          );
  
          for (const transaction of matchingTransactions) {
            const newStatus = code === 0 ? 0 : code;
  
            // Обновляем статус транзакции
            await axios.post(
              'https://subgameserf.ru:4000/update-transaction-status',
              {
                id: transaction.id,
                account: idChat,
                lt: codelt.toString(),
                newStatus: newStatus
              },
              {
                headers: { 'X-CSRF-Token': token },
                withCredentials: true
              }
            );




            if (code !== 0) {
              await axios.post(
                'https://subgameserf.ru:4000/increment-ton',
                { account: idChat, amount: transaction.amountbalance, lt: codelt.toString() },
                {
                  headers: { 'X-CSRF-Token': token },
                  withCredentials: true
                }
              );
  
              await fetchBalanceFromDB();  
             // Обновляем баланс пользователя
            }
          }
        }
      }
    } catch (error) {
      // console.error('Error in checkTransactionIn:', error);
    }
  };

 

//Аналогичная фукнция для скана транзакции на ввод
const checkTransactionIn = async () => {
  try {
    const token = await fetchCsrfToken();
      const addressFrom = Address.parse(rawAddress)?.toString();
  
      if (addr && addressFrom) {
        const addressTo = Address.parse('EQAunf-Pn16zTTLildDPDoZpxilpTLYPqatVrTWM8a6K7IE8');
        const ltTransactions = await client?.getTransactions(addressTo, { limit: 10 });
  
        if (!ltTransactions || ltTransactions.length === 0) return;  // Если транзакций нет, выходим
  
        const response = await axios.post(
          'https://subgameserf.ru:4000/last-transaction',
          {
            account: idChat?.toString(),
            status: -100
          },
          {
            headers: {
              'X-CSRF-Token': token
            },
            withCredentials: true
          }
        );

      const lastTransactions = response.data;
      if (!lastTransactions || lastTransactions.length === 0) return;   // Если нет транзакций, выходим

      for (const ltTransaction of ltTransactions) {
        const { exitCode: code } = ltTransaction.description.computePhase;
        const codelt = ltTransaction.lt;
        const srcAddr = ltTransaction.inMessage?.info.src;
        const destAddr = ltTransaction.inMessage?.info.dest;
        const value = Number(ltTransaction.inMessage?.info.value.coins);

        // Проверяем, если транзакция уже существует
        const findLt = await axios.post(
          'https://subgameserf.ru:4000/get-transaction-by-lt',
          { account: addressFrom, lt: codelt.toString() },
          {
            headers: { 'X-CSRF-Token': token },
            withCredentials: true
          }
        );

        if (findLt.data.exists) continue;  // Если транзакция уже существует, пропускаем

        const matchingTransactions = lastTransactions.filter((lastTransaction: any) =>
        srcAddr?.toString() === lastTransaction.account.toString() &&
        destAddr?.toString() === lastTransaction.contractaddr.toString() &&
        Number(lastTransaction.status) === -100 &&
        Number(value) === Number(lastTransaction.amountbalance)
        );

        for (const transaction of matchingTransactions) {
          const newStatus = code === 0 ? 0 : code;

          // Обновляем статус транзакции
          await axios.post(
            'https://subgameserf.ru:4000/update-transaction-status',
            {
              id: transaction.id,
              account: idChat,
              lt: codelt.toString(),
              newStatus: newStatus
            },
            {
              headers: { 'X-CSRF-Token': token },
              withCredentials: true
            }
          );

          // Если статус транзакции успешный (code == 0), увеличиваем баланс
          if (code === 0) {
            await axios.post(
              'https://subgameserf.ru:4000/increment',
              { account: idChat, amount: transaction.amountbalance, lt: codelt.toString() },
              {
                headers: { 'X-CSRF-Token': token },
                withCredentials: true
              }
            );

            await fetchBalanceFromDB();  
            oracle()// Обновляем баланс пользователя
          }
        }
      }
    }
  } catch (error) {
    // console.error('Error in checkTransactionIn:', error);
  }
};



//Функции для установки игры смотря какой пулл
const [gameId, setGameId] = useState<string>('gameOas1'); 
const changeGame = (game: string) => {
  setGameId(game);
};
//Функция вывода послжених 10 ставок в пуле


//при загрузке страницы выводит последние 10 траназкций пула нужно сделать чтоб вызывалась когда ты находишь в игре для уменьшения нагрузки
useEffect(() => {
  const fetchRecentBets = async () => {
    const token = await fetchCsrfToken()
    try {
      if(isToken == '1'){

        const response = await axios.get('https://subgameserf.ru:4000/recent-bets', { params: { gameId },
          headers: {
            'X-CSRF-Token': token
          },
          withCredentials: true
         });
         const postResponse = await axios.post('https://subgameserf.ru:4000/total-bet', { 
          gameId: gameId
        },
        {
          headers: {
            'X-CSRF-Token': token, 
          },
          withCredentials: true
        }
      );
         
      
      const bets: Bet[] = response.data;
      const formattedBets = bets.map((bet: Bet) => `${bet.account.slice(0, 15)} +${bet.balancebet} OAS`);
      setBalanceChanges(formattedBets);
      setTotalBalanceBet(postResponse.data.totalBet.rows[0].totalbalancebet)
      }
      if(isToken == '2'){
        const response = await axios.get('https://subgameserf.ru:4000/recent-bets', { params: { gameId },
          headers: {
            'X-CSRF-Token': token
          },
          withCredentials: true
        });
        const postResponse = await axios.post('https://subgameserf.ru:4000/total-bet', { 
          gameId: gameId
        },
        {
          headers: {
            'X-CSRF-Token': token, 
          },
          withCredentials: true
        }
      );
         
      
      const bets: Bet[] = response.data;
      const formattedBets = bets.map((bet: Bet) => `${bet.account.slice(0, 15)} +${Number(bet.balancebet)/ 1_000_000_000} TONs`);
      setBalanceChanges(formattedBets);
      setTotalBalanceBet(Number(postResponse.data.totalBet.rows[0].totalbalancebet) / 1_000_000_000)
      }
      
    } catch (error) {
      // console.error('Error fetching recent bets:', error);
    }
  };
  fetchRecentBets();
}, [gameId, isToken]);

const [maxBet, setMaxBet] = useState<string | null>(null);


const [actTime, setActTime] = useState('');
const [totalTaps, setTotalTaps] = useState<string | null>(null)
const [textWin, setTextWin] = useState<string | null>(null)
//Соккет для отображения общей инофрмации об игре всем пользователям при загрузке всю инормацию нужно улучшить 
const wsRef = useRef<WebSocket | null>(null);

useEffect(() => {
  if (!idChat) {
    return; // Если idChat еще не установлен, не подключаем WebSocket
  }

  const connectWebSocket = () => {
    const ws = new WebSocket('wss://subgameserf.ru:4000/');

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected, retrying...");
      setTimeout(() => connectWebSocket(), 1000); // Переподключение через 1 секунду
    };

    wsRef.current = ws;
  };

  connectWebSocket();

  return () => {
    wsRef.current?.close();
    wsRef.current = null;
  };
}, [idChat]);
useEffect(() => {
  if (!wsRef.current) {
    return;
  }

  const handleMessage = async (event: MessageEvent) => {
    const message = JSON.parse(event.data);

    if (message.type === 'historyUpdate' && message.gameId === gameId) {
      
      if (isToken === '1') {
        
        setBalanceChanges((prevChanges) => {
          const newChange = `${message.accountName} +${message.amountbet} OAS`;
          return [newChange, ...prevChanges]; 
        });
        setTotalBalanceBet(message.totalBet)
      }
       if (isToken === '2') {
        
        setBalanceChanges((prevChanges) => {
          const newChange = `${message.accountName} +${Number(message.amountbet)/ 1_000_000_000} TONs`;
          return [newChange, ...prevChanges]; 
        });
        setTotalBalanceBet(Number(message.totalBet) / 1_000_000_000)
      }
    } else if (message.type === 'gameCooldown' && message.gameId === gameId) {
      if (actTime == '') {
        setActTime('act');
      }
      setIsVisible(false);
      setTimerColl(message.remainingCooldownTime.toString());
    } else if (message.type === 'gameCooldownEnd' && message.gameId === gameId) {
      setActTime('');
      setIsVisible(false);
      setTimerColl('0');
    } else if (message.type === 'timerUpdate' && message.gameId === gameId) {
      if (actTime == 'act') {
        setActTime('');
      }
      if(Number(message.time) < 10){
        setTimer("0:0"+ message.time.toString())
      }else{
        setTimer("0:" + message.time.toString());
      }
      

      if (!isVisible) {
        setIsVisible(true);
      }

      
      setLastBetter(null);
      setMaxBet(null);
      setTotalTaps(null);
    } else if (message.type === 'resetHistory' && message.gameId === gameId) {
      if (isEnd == 'dis') {
        setIsEnd('act');
      }

      setIsVisible(false);

      const token = await fetchCsrfToken();

      setTotalTaps(message.totalTap);
 
      setLastBetter(message.lastBetterName);
     

      if (Number(message.lastBetter) === Number(idChat)) {
        setTextWin('You are Winner!');
      } else {
        setTextWin('Better luck next time');
      }

      const balanceResponse = await axios.get('https://subgameserf.ru:4000/balance', {
        params: {
          account: idChat,
          valute: isToken,
        },
        headers: {
          'X-CSRF-Token': token,
        },
        withCredentials: true,
      });

      if (isToken == '1') {
        setMaxBet(message.maxBet);
        setTotalBalanceBet(message.totalBalanceBet);
        const currentBalanceOas = balanceResponse.data.balanceoas;
        setBalanceToken(currentBalanceOas.toString());
      }
      if (isToken == '2') {
        setMaxBet((Number(message.maxBet) / 1_000_000_000).toString());
        setTotalBalanceBet(Number(message.totalBalanceBet) / 1_000_000_000);
        const currentBalance = balanceResponse.data.balance;
        setBalance((Number(currentBalance) / 1_000_000_000).toString());
      }
    } else if (message.type === 'timerUpdateFirst' && message.gameId == gameId) {
      if (actTime == 'act') {
        setActTime('');
      }

      setIsVisible(true);

      setBalanceChanges((prevChanges) => {
        const lastElement = prevChanges.slice(0, 1);
        return lastElement;
      });
      if(isToken == '1'){
        setTotalBalanceBet(message.totalBet);
      }
      if(isToken == '2'){
        setTotalBalanceBet(Number(message.totalBet) / 1_000_000_000)
      }
      
      setLastBetter(null);
      setMaxBet(null);
      setTotalTaps(null);

      setTimer("1:00");
    }
  };

  wsRef.current.onmessage = handleMessage;

  return () => {
    if (wsRef.current) {
      wsRef.current.onmessage = null;
    }
  };
}, [gameId, idChat, isToken, actTime]);
//Функция которая работает со ставками в игре в зависимости от того в какой игре ты находешься 
const handleDecreaseBalance = async () => {
  const token = await fetchCsrfToken()
    try {
        let amountBet = 0
        // Проверяем, достаточно ли баланса для ставки
        if(gameId == "game1"){
          amountBet = 1000000
        }
        if(gameId == "game2"){
          amountBet = 50000000
        }
        if(gameId == "game3"){
          amountBet = 100000000
        }
        if(gameId == "gameOas1"){
          amountBet = 20
        }
        if(gameId == "gameOas2"){
          amountBet = 50
        }
        if(gameId == "gameOas3"){
          amountBet = 100
        } 
          
          let valute = Number(isToken)
          const postResponse = await axios.post('https://subgameserf.ru:4000/set-balance-bet', {
            account: idChat,
            accountName: accountName,
            amountbet: amountBet,
            gameId: gameId,
            valute: valute
          },
          {
            headers: {
              'X-CSRF-Token': token, 
            },
            withCredentials: true
          }
        );
          if (postResponse.status === 200) {
      
            
            // Если POST-запрос успешен, выполняем GET-запрос для получения обновленного баланса
            // const getResponse = await axios.get('https://subgameserf.ru:4000/balance-bet', {
            //   params: { account: Address.parse(rawAddress).toString(), gameId }
            // }); 
              // Обновляем баланс в состоянии
              const balanceResponse = await axios.get('https://subgameserf.ru:4000/balance', { params: { account: idChat, valute: isToken },
                headers: {
                  'X-CSRF-Token': token, 
                },
                withCredentials: true, 
              });

                if(Number(isToken) == 1){
                 
                  const currentBalanceOas = balanceResponse.data.balanceoas;

                  
                  setBalanceToken(currentBalanceOas);
                }
                if(Number(isToken) == 2){
                 
                  const currentBalance = balanceResponse.data.balance;
                  setBalance((Number(currentBalance) / 1_000_000_000).toString());
                } 
          }
          else{
            // console.log("error");
            
          }
    } catch (error) {
      // console.error('Error placing bet:', error);
    }
  
};


  //Выводит баланс пользователя TOn
  const fetchBalanceFromDB = async (): Promise<string | null> => {
    const token = await fetchCsrfToken()
    try {
      const response = await axios.get('https://subgameserf.ru:4000/balance', 
        { 
          params: { 
            account: idChat, 
            valute: '2'
           },
           
            headers: {
              'X-CSRF-Token': token
            },
            withCredentials: true
        
        }
      
        
      );
      setBalance((Number(response.data.balance) / 1_000_000_000).toString())
      // console.log("CURRENT BALANCE", response.data.balance);
      return response.data.balance;
    } catch (error) {
      // console.error('Error fetching balance from DB:', error);
      return null;
    }

  };

 
  //Функция увеличивает баланс пользователя
  const handleSendMoneyDB = async (dbBalance: string, newBalance: string) => {
    const token = await fetchCsrfToken()
    if (rawAddress) {
      const amountToSend = newBalance;
      axios.post('https://subgameserf.ru:4000/increment-ton', 
        { 
          account: idChat, 
          amount: amountToSend,
          lt: 1000
        },
        {
          headers: {
            'X-CSRF-Token': token
          },
          withCredentials: true
        }
      )
        .then(() => {
          setBalance(((Number(dbBalance) + Number(newBalance)) / 1_000_000_000).toString());
          oracle()
        })
        // .catch();
    } else {
      // console.error('No account selected');
    }
    
  };


  //Функция устанавливает новый amount
  const handleAmountChange = (event: any) => {

    let newAmount = event.target.value;
  

    newAmount = newAmount.replace(',', '.');
  
 
    newAmount = newAmount.replace(/[^0-9.]/g, '');

    const parts = newAmount.split('.');
    if (parts.length > 2) {
      newAmount = parts[0] + '.' + parts.slice(1).join('');
    }
  
    // console.log(newAmount);
  
    setAmount(newAmount);
  };
  

  //функция которая отправляет в блокчейн транзакцию на вывод и таймер на капчу также сообщение

  const [lastCallTime, setLastCallTime] = useState(0);
  const [message, setMessage] = useState('');
  message
  const handleSendMoney = async () => {
    // const token = await fetchCsrfToken();
    const currentTime = Date.now();
    if (currentTime - lastCallTime >= 5000) {
      sendMoneyInContract(amount);
      // console.log(addr, "SENDE MOUNEW AAAADR");

       
      setLastCallTime(currentTime);
    } else {
      setMessage('Пожалуйста, подождите выполнение предыдущей странзакции возбежании коллизий');
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };


  //функция которая делает тоже самое но на ввод денег
  const handleSendOutMoney = async () => {
    
    
    const token = await fetchCsrfToken();
    const currentTime = Date.now();
    if (currentTime - lastCallTime >= 5000) {
      setLastCallTime(currentTime);
      try {
        console.log("gg");
        
        
        const balanceResponse = await axios.get('https://subgameserf.ru:4000/balance', 
          { params: { account: idChat, valute: '2' } ,
          
            headers: {
              'X-CSRF-Token': token
            },
            withCredentials: true
          
          
        });
        const currentBalance = balanceResponse.data.balance;
       
        if (currentBalance != null) {
          
          
          if (Number(currentBalance) < Number(amount) * 1_000_000_000) {
            // console.log("insufficient balance");
          } else {
          //  .catch(error => console.error('Error decrementing balance:', error));

            await sendMoney(amount);
            // console.log(tx, "GEGERGER");
            
          }
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }    
      
    } else {
      setMessage('Пожалуйста, подождите выполнение предыдущей странзакции возбежании коллизий');
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };
      // }

  // Этот эффект сработает есле трназакция была отклонена пользовтелем доделать чтоб в истории транзакций это было видно
  // const checkFInd = () => {
  
  //   console.log(flag1S);
  //   console.log(flag1);
    
  // }
  useEffect(() => {
    // console.log(flag1, "GGG");
  
    const updateTransaction = async (status: any) => {
      try {
        const token = await fetchCsrfToken();
  
        await axios.post(
          'https://subgameserf.ru:4000/new-transaction',
          {
            chatid: idChat,
            account: Address.parse(rawAddress).toString(),
            contractAddr: addr?.toString(),
            lt: 0,
            status: status,  // Передаем статус
            amountBalance: (Number(amount) * 1_000_000_000).toString(),
          },
          {
            headers: {
              'X-CSRF-Token': token,
            },
            withCredentials: true,
          }
        );
  
        // console.log("Transaction updated successfully.");
      } catch (error) {
        // console.error('Error updating transaction:', error);
      }
    };
  
    // Проверяем значение flag1 и вызываем нужную логику
    if (flag1 !== null) {
      const status = flag1 === true ? -100 : -1000;
  
      updateTransaction(status)
      setSend1();
    }
  }, [flag1]);
  
 
  
  
  useEffect(() => {
    const updateTransaction = async (status: any, amountValue: any) => {
      try {
        const token = await fetchCsrfToken();
        
        await axios.post(
          'https://subgameserf.ru:4000/new-transaction',
          {
            chatid: idChat,
            account: Address.parse(rawAddress).toString(),
            contractAddr: addr?.toString(),
            lt: 0,
            status: status,
            amountBalance: (Number(amountValue) * 1_000_000_000).toString(),
          },
          {
            headers: { 'X-CSRF-Token': token },
            withCredentials: true,
          }
        );
        
        // console.log(`Transaction with status ${status} successfully updated.`);
        
        if (status === 1000) {
          const dbBalance = await fetchBalanceFromDB();
          if (dbBalance != null) {
            await handleSendMoneyDB(dbBalance, (Number(amountValue) * 1_000_000_000).toString());
            // console.log("Balance successfully updated after transaction.");
            oracle()
          }
        }
        if(status == 100) {
          await axios.post('https://subgameserf.ru:4000/decrement', { 
            account: idChat, 
            amount: (Number(amount) * 1_000_000_000).toString()
          },
          {
            headers: {
              'X-CSRF-Token': token
            },
            withCredentials: true
          }
        
        )
        .then(async () => {
          const dbBalance = await fetchBalanceFromDB();
          if (dbBalance != null) {
          setBalance(((Number(dbBalance) - Number(amount) * 1_000_000_000) / 1_000_000_000).toString());
          }
         })
        }
        oracle()
      } catch (error) {
        // console.error(`Error updating transaction with status ${status}:`, error);
      }
    };
  
    if (flag !== null) {
      const status = flag === true ? 100 : 1000;
      updateTransaction(status, amount);
      setSend();
      
    }
  }, [flag]);
  
  
  
  
    //функция которая проверяет проверяет твою подписку на канал телеграмм и выводит об этом сообщение нужно доработать с балансом токенов
    const [subscriptionStatus, setSubscriptionStatus] = useState('');
    subscriptionStatus
    const checkSubscription = async () => {
      const token = await fetchCsrfToken();
      
        try {
            const response = await axios.post('https://subgameserf.ru:4000/check_subscription', { user_id: idChat }, 
              {
              headers: {
                'X-CSRF-Token': token
              },
              withCredentials: true
            });
            if (response.data.subscribed) {
                setSubscriptionStatus('You are subscribed!');
                localStorage.setItem('checkTg', '2')
                setCheckTg('2')
            } else {
                setSubscriptionStatus('You are not subscribed.');
                localStorage.setItem('checkTg', '0')
                setCheckTg('0')
            }
        } catch (error) {
            // console.error(error);
            setSubscriptionStatus('Error checking subscription.');
            localStorage.setItem('checkTg', '0')
            setCheckTg('0')
        }
      }
      const checkSubscriptionChat = async () => {
        const token = await fetchCsrfToken();
        
          try {
              const response = await axios.post('https://subgameserf.ru:4000/check_subscription', { user_id: idChat }, 
                {
                headers: {
                  'X-CSRF-Token': token
                },
                withCredentials: true
              });
              if (response.data.subscribed) {
                  setSubscriptionStatus('You are subscribed!');
                  localStorage.setItem('checkTgChat', '2')
                  setCheckTgChat('2')
              } else {
                  setSubscriptionStatus('You are not subscribed.');
                  localStorage.setItem('checkTgChat', '0')
                  setCheckTgChat('0')
              }
          } catch (error) {
              // console.error(error);
              setSubscriptionStatus('Error checking subscription.');
              localStorage.setItem('checkTgChat', '0')
              setCheckTgChat('0')
          }
        }

      const [activeIcon, setActiveIcon] = useState('iconSwap1');

      //Функция которая пенаяет вид токена на сайте для игрока нужно придумать как сделать чтоб не обнулялось при перезагрузке и видно было в фронте
      const handleIconClick = (icon: any) => {
        if (icon === activeIcon) {
          return;
        }
        if(icon === 'iconSwap1'){
          // console.log("SWAP TOKEN 1");
          onlineCheck(1)
          handleSetToken(1)
          
        }
        if(icon == 'iconSwap2'){
          // console.log("SWAP TOKEN 2");
          onlineCheck(2)
          handleSetToken(2)
        }
        setActiveIcon(icon);
      };

      const [activePop, setActivePop] = useState('inActivePop');
      //Функция которая пенаяет вид токена на сайте для игрока нужно придумать как сделать чтоб не обнулялось при перезагрузке и видно было в фронте
      const handlePopClick = (icon: any) => {
        // if (icon === activeIcon) {
        //   return;
        // }
        // console.log(icon);
        
        if(icon === 'activePop'){
          setActivePop('activePop')
        }
        if(icon == 'closePop'){
          setActivePop('closePop')
        }
        if(icon == 'stop'){
          setActivePop('incactivePop')
        }
        
      };
      const [activeDep, setActiveDep] = useState('inActiveDep');
      //Функция которая пенаяет вид токена на сайте для игрока нужно придумать как сделать чтоб не обнулялось при перезагрузке и видно было в фронте
      const handleDepClick = (icon: any) => {
        // if (icon === activeIcon) {
        //   return;
        // }
       
        if(icon == 'activeDep1'){
          setActiveDep('activeDep1')
        }
        if(icon === 'activeDep'){
          setActiveDep('activeDep')
        }
        if(icon == 'closeDep'){
          setActiveDep('closeDep')
        }
        if(icon == 'stop'){
          setActiveDep('incactiveDep')
        }
        
      };

    
      // const [startY, setStartY] = useState(0);
      // const [isSwiping, setIsSwiping] = useState(false);
      // const [currentY, setCurrentY] = useState(0);
      // const [translateY, setTranslateY] = useState(0);
    
      // const handleTouchStart = (event: any) => {
      //   setStartY(event.touches[0].clientY);
      //   setIsSwiping(true);
      // };
    
      // const handleTouchMove = (event: any) => {
      //   if (!isSwiping) return;
    
      //   const currentY = event.touches[0].clientY;
      //   const diffY = currentY - startY;
    
      //   if (diffY > 0) {
      //     setTranslateY(diffY); // Перемещаем блок вниз
      //   }
      // };
      const [accountNames, setAccountNames] = useState([]);
      const handleSetReferal = async () => {
        const token = await fetchCsrfToken();
        try {
          const response = await axios.post(
            'https://subgameserf.ru:4000/find-referals',
            { chatId: idChat },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token, // Если требуется CSRF-токен
              },
              withCredentials: true 
            }
          );
    
          setAccountNames(response.data.accountNames);
        } catch (err) {
          // console.log("err");
          
        }
      };

      // setActiveIcon


      const days = [
        { day: 1, reward: 100 },
        { day: 2, reward: 300 },
        { day: 3, reward: 500 },
        { day: 4, reward: 700 },
        { day: 5, reward: 900 },
        { day: 6, reward: 1100 },
        { day: 7, reward: 1300 },
        { day: 8, reward: 1500 },
        { day: 9, reward: 1700 },
        { day: 10, reward: 5000 },
        { day: 11, reward: 2100 },
        { day: 12, reward: 2300 },
        { day: 13, reward: 2500 },
        { day: 14, reward: 2700 },
        { day: 15, reward: 2900 },
        { day: 16, reward: 3100 },
        { day: 17, reward: 3300 },
        { day: 18, reward: 3500 },
        { day: 19, reward: 3700 },
        { day: 20, reward: 5000 },
        { day: 21, reward: 4100 },
        { day: 22, reward: 4300 },
        { day: 23, reward: 4500 },
        { day: 24, reward: 4700 },
        { day: 25, reward: 4900 },
        { day: 26, reward: 7000 },
        { day: 27, reward: 5300 },
        { day: 28, reward: 5500 },
        { day: 29, reward: 5700 },
        { day: 30, reward: 10000 },
        // Добавьте остальные дни до 30...
      ];

      interface Account {
        chatid: number;
        accountname: string;
        balance: number;
        balanceoas: number;
        account: string;
        referal: number;
        climed: number;
        winton: number;
        winsoas: number
        lostton: number;
        lostoas: number;
      }
     
        const [accounts, setAccounts] = useState<Account[]>([]);
        const [rank, setRank] = useState<string>("0");
        
          const fetchTopAccounts = async () => {
            
            
            const token = await fetchCsrfToken();
            
            try {
              const response = await axios.get('https://subgameserf.ru:4000/top-accounts', 
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': token, // Если требуется CSRF-токен
                  },
                  withCredentials: true 
                }
              );
              
              setAccounts(response.data.data);
          
              
              const userRank = response.data.data.findIndex((account: Account) => Number(account.chatid) === Number(idChat));
           
              
              if (userRank !== -1) {
                setRank((userRank + 1).toString()); // Устанавливаем ранг пользователя (+1, чтобы индексация начиналась с 1)
              } else {
                setRank("Not ranked"); // Если пользователь не найден
              }
            } catch (error) {
              // console.error('Error fetching top accounts:', error);
            }
          };

          const [winOas, setWinOas] = useState<string>("0");
          const [lostOas, setLostOas] = useState<string>("0");
          const [winTon, setWinTon] = useState<string>("0")
          const [lostTon, setLostTon] = useState<string>("0")
          const [taps, setTaps] = useState<string>("0");
          
          const fetchStats = async () => {
            const token = await fetchCsrfToken();
            try {
              const response = await axios.post('https://subgameserf.ru:4000/user-stats', 
                { chatId: idChat },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': token, // Если требуется CSRF-токен
                  },
                  withCredentials: true 
                });
              // console.log(response.data.data);
              setWinOas(response.data.data.winsoas)
              setLostOas(response.data.data.lostoas)
              setWinTon((response.data.data.winton / 1_000_000_000).toString())
              setLostTon((response.data.data.lostton / 1_000_000_000).toString() )
              setTaps(response.data.data.taps)


              // setTotalEarnd((Number(response.data.data.wins) - Number(response.data.data.lost)).toString())
              
            } catch (error) {
              // console.error('Error fetching top accounts:', error);
            }
          };
     
         
          const formatNumber = (num: any) => {
            const absNum = Math.abs(num); 
            if(absNum >= 1000000000000){
              return (num / 1000000000000).toFixed(1) + 'T';
            }
            if(absNum >= 1000000000){
              return (num / 1000000000).toFixed(1) + 'B';
            }
            if (absNum >= 1000000) {
              return (num / 1000000).toFixed(1) + 'M'; // Формат для миллионов
            } else if (absNum >= 10000) {
              return (num / 1000).toFixed(1) + 'k'; // Формат для тысяч
            }
            
            return parseFloat(Number(num).toFixed(4)).toString(); // Если меньше 1000, просто возвращаем число
          };
          const [priceUsdt, setPriceUsdt] = useState<string>("0");
          const oracle = async () => {
            const response = await axios.get('https://api.diadata.org/v1/assetQuotation/Ton/0x0000000000000000000000000000000000000000');
              // console.log(response.data.Price.toFixed(2));
              setPriceUsdt((Number(response.data.Price) * Number(balance)).toString())
            
          }

          const [currentIndex, setCurrentIndex] = useState(0);

          // const items = [
          //   {
          //     balance: 'comming soon',
          //     priceUsdt: 'comming soon',
          //     tokenTon: tokenOas, // замените на путь к вашему изображению
          //   },
          //   {
          //     balance: Number(balance).toFixed(2).toString() + " TON",
          //     priceUsdt: ((Number(priceUsdt) * Number(balance)).toFixed(2)).toString() + " $",
          //     tokenTon: tokenTon,
          //   },
          //   {
          //     balance: 'comming soon',
          //     priceUsdt: 'comming soon',
          //     tokenTon: tokenOas,
          //   },
          // ];
          const nextSlide = () => {
            setCurrentIndex((prevIndex) => {
              // Перемещение вправо
              if (prevIndex < 1) {
                return prevIndex + 1;
              }
              // Если индекс уже равен 1, не изменяем его
              return prevIndex;
            });
          };
        
          const prevSlide = () => {
            setCurrentIndex((prevIndex) => {
              // Перемещение влево
              if (prevIndex > -1) {
                return prevIndex - 1;
              }
              // Если индекс уже равен -1, не изменяем его
              return prevIndex;
            });
          };
          const handleSwipe = (direction: any) => {
            if (direction === 'Right') {
              nextSlide();
            } else if (direction === 'Left') {
              prevSlide();
            }
          };

          const swipeHandlers = useSwipeable({
            onSwipedLeft: () => handleSwipe('Left'),
            onSwipedRight: () => handleSwipe('Right'),
            trackMouse: true,
         
          });
          
          const [twitterCheck, setTwitterCheck] = useState(
            () => {
              const savedAmount = localStorage.getItem('twitterCheck');
              return savedAmount !== null ? savedAmount : '0';
            }
          ) 
         
          const setTwitter = async(val: any) => {
            if(val == '1'){
              localStorage.setItem('twitterCheck', '1')
              setTwitterCheck('1')
              
            }
            if(val == '2'){
              const token = await fetchCsrfToken();
              localStorage.setItem('twitterCheck', '2')
              setTwitterCheck('2')

              await axios.post('https://subgameserf.ru:4000/quest', { userId: idChat, questId: '3' },
                {
               headers: {
                    'X-CSRF-Token': token
                },
                withCredentials: true
              })

              const balanceResponse = await axios.get('https://subgameserf.ru:4000/balance', {
                params: {
                  account: idChat,
                  valute: '1',
                },
                headers: {
                  'X-CSRF-Token': token,
                },
                withCredentials: true,
              });
            
              const currentBalanceOas = balanceResponse.data.balanceoas;
              if(Number(currentBalanceOas) >= 1000000000000){
                const formattedBalance = (currentBalanceOas / 1000000000000).toFixed(1).toString() + "D";
                setBalanceToken(formattedBalance);
              } else if (Number(currentBalanceOas) >= 1000000) {
                const formattedBalance = (currentBalanceOas / 1000000).toFixed(1).toString() + "M";
                setBalanceToken(formattedBalance);
              } else if (Number(currentBalanceOas) >= 100000) {
                const formattedBalance = (currentBalanceOas / 1000).toFixed(1).toString() + "k";
                setBalanceToken(formattedBalance);
              } else {
                const formattedBalance = currentBalanceOas.toString();
                setBalanceToken(formattedBalance);
              }
            
              checkComplite()
            }
           
          }
          const [connectedAddr, setConnectedAddr] = useState(
            () => {
              const savedAmount = localStorage.getItem('connection');
              return savedAmount !== null ? savedAmount : '1';
            }
          ) 

          const setConnect = async (val: any) => {
            const token = await fetchCsrfToken();
            if(rawAddress && val == '3'){

              setConnectedAddr('3')
              localStorage.setItem('connection', '3')

              await axios.post('https://subgameserf.ru:4000/quest', { userId: idChat, questId: '4' },
                {
               headers: {
                    'X-CSRF-Token': token
                },
                withCredentials: true
              })
              const balanceResponse = await axios.get('https://subgameserf.ru:4000/balance', {
                params: {
                  account: idChat,
                  valute: '1',
                },
                headers: {
                  'X-CSRF-Token': token,
                },
                withCredentials: true,
              });
            
              const currentBalanceOas = balanceResponse.data.balanceoas;
              if(Number(currentBalanceOas) >= 1000000000000){
                const formattedBalance = (currentBalanceOas / 1000000000000).toFixed(1).toString() + "D";
                setBalanceToken(formattedBalance);
              } else if (Number(currentBalanceOas) >= 1000000) {
                const formattedBalance = (currentBalanceOas / 1000000).toFixed(1).toString() + "M";
                setBalanceToken(formattedBalance);
              } else if (Number(currentBalanceOas) >= 100000) {
                const formattedBalance = (currentBalanceOas / 1000).toFixed(1).toString() + "k";
                setBalanceToken(formattedBalance);
              } else {
                const formattedBalance = currentBalanceOas.toString();
                setBalanceToken(formattedBalance);
              }
            
              checkComplite()
            }

          }


          
          const [zone, setZone] = useState('');
          const timeoutRef = useRef<number | null>(null); // Хранит ID таймера
        
          const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
            hapticFeedback.impactOccurred("medium");
        
            // Асинхронный вызов параллельно с основными вычислениями
            const decreaseBalancePromise = handleDecreaseBalance();
        
            handleAddImage();
        
            const rect = event.currentTarget.getBoundingClientRect();
            const { clientX, clientY } = event;
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const { width, height } = rect;
        
            handleSetJin();
        
            // Предварительный расчет зон
            const centralZoneSize = 0.3;
            const centralStartX = (1 - centralZoneSize) / 2 * width;
            const centralEndX = (1 + centralZoneSize) / 2 * width;
            const centralStartY = (1 - centralZoneSize) / 2 * height;
            const centralEndY = (1 + centralZoneSize) / 2 * height;
        
            // Определение новой зоны
            let newZone = '';
            if (x > centralStartX && x < centralEndX && y > centralStartY && y < centralEndY) {
                newZone = 'center-center';
            } else if (x < width / 3) {
                newZone = 'left';
            } else if (x > 2 * width / 3) {
                newZone = 'right';
            } else if (y > 2 * height / 3) {
                newZone = 'bottom';
            } else {
                newZone = 'center';
            }
        
            setZone(newZone);
        
            // Сброс состояния через 200 мс (можно обернуть в useEffect для сброса при изменении зоны)
            setTimeout(() => {
                setZone('');
            }, 200);
        
            // Ожидание асинхронного уменьшения баланса
            await decreaseBalancePromise;
        };
        
        
          const handleSetJin = () => {
            // Если уже есть таймер, отменить его
            if (timeoutRef.current !== null) {
              clearTimeout(timeoutRef.current);
            }
        
            setGameJinMain(gameJinAct);
        
            // Устанавливаем новый таймер
            timeoutRef.current = window.setTimeout(() => {
              setGameJinMain(gameJin);
              timeoutRef.current = null; // Сбрасываем ref после завершения таймера
            }, 700);
          };
        
          useEffect(() => {
            // Очистка таймера при размонтировании компонента
            return () => {
              if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
              }
            };
          }, []);
        

          const [isVisible, setIsVisible] = useState(false);
          
          const [isEnd, setIsEnd] = useState('dis');
        

 
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimating1, setIsAnimating1] = useState(false);
  const [isStor, setIsStor] = useState(0); // Счетчик для переключения между списками

 

  const handleAddImage = () => {
    const newImage = '';

    if (isStor % 2 === 0) {
      // Добавляем в первый список
      setImages(prevImages => {
        setIsAnimating(true); // Запускаем анимацию для первого списка

        // Обновляем список
         const updatedImages = [...prevImages, newImage];
        // if (updatedImages.length > 10) {
        //   return updatedImages.slice(9); // Удаляем первый элемент, если больше 10
        // }
        return updatedImages;
      });
    } else {
      // Добавляем во второй список
      setImages1(prevImages => {
        setIsAnimating1(true); // Запускаем анимацию для второго списка

        // Обновляем список
        const updatedImages = [...prevImages, newImage];
        
        return updatedImages;
      });
    }

    // Переключаем значение isStor, чтобы следующий элемент добавлялся в другой список
    setIsStor(prevIsStor => prevIsStor + 1);
  };

     
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  isFirstVisit
  
  // useEffect(() => {
  //   // Проверяем наличие отметки в localStorage
  //   const hasVisited = localStorage.getItem('hasVisited');
    
  //   if (!hasVisited) {
  //     // Если метки нет, значит это первый заход
  //     setIsFirstVisit(true);
  //     setIsPageState('100')
      
  //     // Устанавливаем метку о том, что пользователь уже был на сайте
  //     localStorage.setItem('hasVisited', 'true');
  //   }
  // }, []);

    const [startPlay, setStartPlay] = useState(0)

    const handleSetStart = () => {
      if(startPlay == 2){

        setIsPageState('0')

        checkDay(idChat)
        return
      }
      const newStartPlay = startPlay + 1;
      setStartPlay(newStartPlay)
    }


    const [inact, setInact] = useState('off')
    const setIninact = () =>{
      if(inact == 'off'){
        setInact('on')
      }
      if(inact == 'on'){
        setInact('off')
      }
    }


    // const checkTx = async () => {
    //   if(addr){
    //     const addressTo = Address.parse(addr);
    //     const ltTransactions = await client?.getTransactions(addressTo, { limit: 10 });
    //     console.log(ltTransactions);
    //   }
     
      

      
    // }
  const renderContent = () => {

      switch (isPage) {
        case '100':
          return(
            <div className='scroller' onClick={handleSetStart}>
              {
                  startPlay === 0 && (
                    <div >
                       <div style={{height: '600px'}}>
              <div className='mainFirst'>
              What is Oasis?
                </div>
                <div style={{margin: '0 auto', display: 'flex', justifyContent: 'center'}}>
                  <img src={join1} style={{width: '360px', height: '360px', margin: '0 auto'}} alt="" />
                </div>
                <div style={{textAlign: 'center', width: '80%', margin: '0 auto', marginTop: '50px'}}>
                A platform that provides a number of interesting PvP games with the possibility of earning real cryptocurrency. Compete against other players using TON or Oasis tokens. Winning and earning depends only on you and your talent. The strongest will win! 
                </div>
                <div style={{margin: '0 auto'}}>
                
                  </div>
                  <div className='loadto acti'>
                    <div className='loadedto acit'> </div>
                  </div>
               </div>

                </div>
                  )
                }
                {
                  startPlay === 1 && (
                    <div>
                      <div style={{height: '600px'}}>
                      <div className='mainFirst'>
              Referal program - 5%
                </div>
                <div style={{margin: '0 auto', display: 'flex', justifyContent: 'center'}}>
                  <img src={join2} style={{width: '297px', height: '297px', margin: '63px auto'}} alt="" />
                </div>
                <div style={{textAlign: 'center', width: '80%', margin: '0 auto', marginTop: '-10px', height: '95px'}}>
                Bring your friends and play together. For each friend you invite you will get 5% of their winnings.
                </div>
                
                </div>
                <div className='loadto acti1'>
                    <div className='loadedto acti1'> </div>
                  </div>
                        </div>
             
                
                  )
                }
                {
                  startPlay === 2 && (
                    <div>
 <div style={{height: '600px'}}>
              <div className='mainFirst'>
              Earn free Oasis tokens 
                </div>
                <div style={{margin: '0 auto', display: 'flex', justifyContent: 'center'}}>
                  <img src={join3} style={{width: '360px', height: '360px', margin: '0 auto'}} alt="" />
                </div>
                <div style={{textAlign: 'center', width: '80%', margin: '0 auto', marginTop: '50px'}}>
                You can only earn future Oasis tokens by winning them from other players and completing quests. Compete with other people and earn more! 5% of all tokens won will be burned thus creating deflation and increasing its value.
                </div>
                </div>
                <div className='loadto acti2'>
                    <div className='loadedto acti2'> </div>
                  </div>
                </div>
                  )
                }
              

               
              </div>
          )
        case '1':
          return (  
           
              <div className='scroller'>
              <div className='Container'>
              
            {/* <TonConnectButton /> */}
            


            <div className='mainProfile'> 

            <div className='iconProf'>
                  {accountName?.slice(0,1).toUpperCase()}
              </div> 
              <div className='profile'>
              {accountName?.slice(0,20)} 
              </div>
              <div className='balances' style={{marginRight:'8px'}}>
            
            <div className='BalanceValue oasToken'>{balance !== null ? balance.toString().slice(0,5) : '0'} </div> 
            <img src={tokenTon} alt="ton" className='tokenOasImg'/>
          
             </div>
             <div className='balances'>
           
             
          
            <div className='BalanceValue oasToken'>{balanceToken !== null ? balanceToken.toString() : '0' } </div> 
            <img src={tokenOas} alt="oas" className='tokenOasImgOas'/>
             </div>
            </div>
             

            


            
             
            </div>

            <div className="container2">
              <div className='cont2'>
              <div
        className={`iconSwap ${activeIcon === 'iconSwap1' ? 'active' : ''} ${activeIcon !== 'iconSwap1' ? 'inactive' : ''} iconSwap1`}
        onClick={() => handleIconClick('iconSwap1')}
      >
        OAS
      </div>
      <div
        className={`iconSwap ${activeIcon === 'iconSwap2' ? 'active2' : ''} ${activeIcon !== 'iconSwap2' ? 'inactive' : ''} iconSwap2`}
        onClick={() => handleIconClick('iconSwap2')}
      >
        TON
      </div>
        </div>
    </div>

    {/* <TonConnectButton /> */}

            <div className='littleOas' >
              
            
              <div className='textLittleOas'>
                    <div className='playingNow '>
                      Playing Now {onlineCounts[0]}
                    </div>
                  
                    <p className='textOasName'>
                  Little Oasis 
                    </p>
                    <div className='bet'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                       </div>

                  <div className='buttonGame1' onClick={() => handleSetPage(6)}>
                  Join for <span className= {`Oas ${activeIcon === 'iconSwap1' ? 'active1' : ''} ${activeIcon && activeIcon !== 'iconSwap1' ? 'inactive1' : ''}`}> 20 <span className='OasColor'>OAS</span></span>
                            <span className={`Ton ${activeIcon === 'iconSwap2' ? 'active1' : ''} ${activeIcon && activeIcon !== 'iconSwap2' ? 'inactive1' : ''}`}>0.001 <span className='TonColor'>TON</span></span>
                  </div>

                    
                    
          
                   

                      {/* <div className={`buttonGame2 ${activeIcon === 'iconSwap2' ? 'active1' : ''} ${activeIcon && activeIcon !== 'iconSwap2' ? 'inactive1' : ''}`}>
                      Join for 0.005 OAS
                    </div> */}

                   

              </div>
              <img src={lamp} alt="" className="littleOasImage"/>
             
              <div className="corner-1"></div>
             <div className="corner-2"></div>
            </div>

            <div className='middleOas' >
              
              <img src={lamp2} alt="" className="littleOasImage"/>
             
              <div className='textLittleOas' >
              <div className='playingNow '>
                      Playing Now {onlineCounts[1]}
                    </div>
                  
                    <p className='textOasName'>
                  Middle Oasis 
                    </p>
                    <div className='bet'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                       </div>
  
                     
                    
                       <div className='buttonGame1' onClick={() => handleSetPage(7)}>
                  Join for <span className= {`Oas ${activeIcon === 'iconSwap1' ? 'active1' : ''} ${activeIcon && activeIcon !== 'iconSwap1' ? 'inactive1' : ''}`}> 50 <span className='OasColor'>OAS</span></span>
                            <span className={`Ton ${activeIcon === 'iconSwap2' ? 'active1' : ''} ${activeIcon && activeIcon !== 'iconSwap2' ? 'inactive1' : ''}`}>0.05 <span className='TonColor'>TON</span></span>
                  </div>



                     
                    

              </div>
              <div className="cornermiddle-1"></div>
             <div className="cornermiddle-2"></div>
            </div>
           
            <div className='bigOas'>
              
              <img src={lamp3} alt="" className="littleOasImage"/>
             
              <div className='textLittleOas'>
                
              <div className='playingNow '>
                      Playing Now {onlineCounts[2]}
                    </div>
                  
                    <p className='textOasName'>
                  Big Oasis 
                    </p>
                    <div className='bet'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                       </div>
  
                       <div className='buttonGame1' onClick={() => handleSetPage(8)}>
                  Join for <span className= {`Oas ${activeIcon === 'iconSwap1' ? 'active1' : ''} ${activeIcon && activeIcon !== 'iconSwap1' ? 'inactive1' : ''}`}> 100 <span className='OasColor'>OAS</span></span>
                            <span className={`Ton ${activeIcon === 'iconSwap2' ? 'active1' : ''} ${activeIcon && activeIcon !== 'iconSwap2' ? 'inactive1' : ''}`}>0.1 <span className='TonColor'>TON</span></span>
                  </div>


              </div>
              
            </div>
            
            <div className="bottom-menu">    
              <div className='bottomMenuSize'>
              <ul>
          
            <li onClick={() => handleSetPage(2)} style={{width: '110%'}}>
              <img src={quests1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Quests</span>
            </li>
            
            <li onClick={() => handleSetPage(3)} style={{width: '110%'}}> 
            <img src={referal1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Referal</span>
            </li>
            <li className='mainsapn' onClick={() => handleSetPage(0)} style={{position: 'relative', top: '-15px', width: '110%'}}>
              <img src={main} className='bottomMenuImg mainimg' alt="image" />
              <br></br>
              <span style={{color: "white", fontSize: "12px"}} >Main</span>
            </li>
            <li onClick={() => handleSetPage(4)} style={{width: '110%'}}>
              <img src={leaderboard1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Leaderboard</span>
            </li>
            <li onClick={() => handleSetPage(5)} style={{width: '110%'}}>
              <img src={profile1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Profile</span>
            </li>
        </ul>
              </div>
        
        </div> 
            
            
              </div>
      
          );
        case '2':
          return (
                 <div className='scroller'>
            <div className='Container'>
            {/* <TonConnectButton /> */}
            {/* <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>My Lottie Animation</h1>
      <LottieAnimation animationData={animationData} width={200} height={200} />
    </div> */}
             <div className='mainProfile'> 

<div className='iconProf'>
      {accountName?.slice(0,1).toUpperCase()}
  </div> 
  <div className='profile'>
  {accountName?.slice(0,20)} 
  </div>
  <div className='balances' style={{marginRight:'8px'}}>

<div className='BalanceValue oasToken'>{balance !== null ? balance.toString().slice(0,5) : '0'} </div> 
<img src={tokenTon} alt="ton" className='tokenOasImg'/>

 </div>
 <div className='balances'>

 

<div className='BalanceValue oasToken'>{balanceToken !== null ? balanceToken.toString() : '0' } </div> 
<img src={tokenOas} alt="oas" className='tokenOasImgOas'/>
 </div>
</div>
              
           
            </div>
              <div style={{textAlign: "center"}}>
              <div className='questToken'>
             Coins received
             </div>

             <div style={{marginTop: "8px", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              {coinReciver} <img src={tokenOas} style={{width: "20px", height: "20px"}} alt="" /> <span style={{fontSize: "24px", marginLeft: '4px'}}> {} </span>
             </div>
             <div style={{fontSize: "16px", marginTop: "8px", color: "rgba(255, 255, 255, 0.5)"}}>
             Tasks completed: <span style={{fontWeight: "700", color: "rgba(255, 255, 255, 1)"}}>{taskComplete}</span>
             </div>
            
             <div style={{fontSize: "24px", marginTop: "12px"}}> Earn more coins! </div>
              </div>
            
            <div className='reward'>
            <div className='dayly'>
              Daily tasks
              </div>
              <div className='dayleReward'>
                <div className='dayleRewardImg'>
                  <img src={tokenOas} style={{width: "32px", height: "32px"}} alt="" />
                </div>
                <div className='aboutDayly'>
                Daily reward <br></br>
               
                </div>
                <div className='START' onClick={() => handlePopClick('activePop')}>
                  START
                </div>
             
              </div>
            </div>
            <div className='allTask'>
              <div  className='dayly'>
                 All Tasks
              </div>
              <div className='dayleRewardMain top'>
                <div className='dayleRewardImg'>
                  <img src={telegramLogo} style={{width: "32px", height: "32px"}} alt="" />
                </div>
                <div className='aboutDayly'>
                Join the telegram group <br></br>
                <div className='rewardPos'>
                  <img src={tokenOas} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" /> <span style={{marginTop: "1px"}}>+1.000 </span>
                  </div>
                </div>
                {
                  checkTg === '0' && (
                    <div className='START' onClick={sendLink}>
                    JOIN
                  </div>
                  )
                }
                {
                  checkTg === '1' && (
                    <div className='START' onClick={checkSubscription}>
                    CHECK
                  </div>
                  )
                }
                {
                  checkTg === '2' && (
                    <div className='START1' onClick={() => rewardOas(1)}>
                    CLAIM
                  </div>
                  )
                }
                {
                  checkTg === '3' && (
                    <div className='START2' >
                    CLAIMED
                  </div>
                  )
                }
               
              </div>
              <div className='dayleRewardMain'>
                <div className='dayleRewardImg'>
                  <img src={telegramLogo} style={{width: "32px", height: "32px"}} alt="" />
                </div>
                <div className='aboutDayly'>
                Join the telegram chat <br></br>
                <div className='rewardPos'>
                  <img src={tokenOas} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" /> <span style={{marginTop: "1px"}}>+1.000 </span>
                  </div>
                </div>
                
                {
                  checkTgChat === '0' && (
                    <div className='START' onClick={sendLinkChat}>
                  JOIN
                </div>
                  )
                }
                {
                  checkTgChat === '1' && (
                    <div className='START' onClick={checkSubscriptionChat}>
                    CHECK
                  </div>
                  )
                }
                {
                  checkTgChat === '2' && (
                    <div className='START1' onClick={() => rewardOas( 2)}>
                    CLAIM
                  </div>
                  )
                }
                {
                  checkTgChat === '3' && (
                    <div className='START2' >
                    CLAIMED
                  </div>
                  )
                }
              </div>
              <div className='dayleRewardMain'>
                <div className='dayleRewardImg'>
                  <img src={x} style={{width: "32px", height: "32px"}} alt="" />
                </div>
                <div className='aboutDayly'>
                <div style={{textAlign:'left'}}>Join X </div>
                <div className='rewardPos'>
                  <img src={tokenOas} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" /> <span style={{marginTop: "1px"}}>+1.000 </span>
                  </div>
                </div>
                 {
                  twitterCheck === '0' && (
                    <div className='START'  onClick={() => {
                      
                      setTwitter('1');
                  
                      
                      window.open('https://x.com/OasisEcosystem', '_blank');
                    }}>
                  JOIN
                </div>
                  )
                }
               
                {
                  twitterCheck === '1' && (
                    <div className='START1' onClick={() => setTwitter('2')}>
                    CLAIM
                  </div>
                  )
                }
                {
                  twitterCheck === '2' && (
                    <div className='START2' >
                    CLAIMED
                  </div>
                  )
                }
              </div>
              <div className='dayleRewardMain bot'>
                <div className='dayleRewardImg'>
                  <img src={tokenTon} style={{width: "32px", height: "32px"}} alt="" />
                </div>
                <div className='aboutDayly'>
                Connect wallet <br></br>
                <div className='rewardPos'>
                  <img src={tokenOas} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" /> <span style={{marginTop: "1px"}}>+1.000 </span>
                  </div>
                </div>
                {
                  connectedAddr === '1' && (
                    <div className='START' onClick={() => handleSetPage(5)}>
                  CONNECT
                </div>
                  )
                }
                {
                  connectedAddr === '2' && (
                    <div className='START1' onClick={() => setConnect('3')}>
                    CLAIM
                  </div>
                  )
                }
                {
                  connectedAddr === '3' && (
                    <div className='START2' >
                    CLAIMED
                  </div>
                  )
                }
              </div>
            </div>
              <div className={`popup1 ${activePop === 'activePop' ? 'activePop' : ''} ${activePop === 'closePop' ? 'inactivePop' : ''}`}>

              </div>
            <div className={`popup ${activePop === 'activePop' ? 'activePop' : ''} ${activePop === 'closePop' ? 'inactivePop' : ''} `}>
            <div className='closeBtn' onClick={() => handlePopClick('closePop')}>
                  
                </div>
              <div className='popupin'>
              <img src={lampDay} className='lampDay' alt="" />
                
              </div>
                <div className='mainDaylyReward'>
                <span className='spanMaindayly'>Daily reward
                  </span>
                  
                </div>



                  <div className='MainBoxDaily' >
                  
    {days.map(({ day, reward }) => (
      <div
        key={day}
        className={
          Number(dayNumber) === day && Number(dayNew) === 1
            ? 'allDay'
            : Number(dayNumber) === day && Number(dayNew) === 0
            ? 'allDay1'
            : Number(dayNumber) > day
            ? 'allDay'
            : 'allDay2'
        }
        
        onClick={newDayQuest}
      >
        <div style={{ marginTop: "9px", marginBottom: "5px", fontSize: "12px", fontWeight: "700" }}>
          Day {day}
        </div>
        <div>
          <img src={tokenOas} style={{ width: "24px", height: "24px" }} alt="" />
        </div>
        <div style={{ marginTop: "1px", fontSize: "12px", fontWeight: "700" }}>
          +{reward}
        </div>
      </div>
      
      
    ))}                
                  
                 </div>
            </div>
            <div className="bottom-menu">    
              <div className='bottomMenuSize'>
              <ul>
          
          <li onClick={() => handleSetPage(2)} style={{width: '110%'}}>
            <img src={quests} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "white", fontSize: "12px"}}>Quests</span>
          </li>
          
          <li onClick={() => handleSetPage(3)} style={{width: '110%'}}> 
          <img src={referal1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Referal</span>
          </li>
          <li className='mainsapn' onClick={() => handleSetPage(0)} style={{position: 'relative', top: '-15px', width: '110%'}}>
            <img src={main1} className='bottomMenuImg mainimg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}} >Main</span>
          </li>
          <li onClick={() => handleSetPage(4)} style={{width: '110%'}}>
            <img src={leaderboard1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Leaderboard</span>
          </li>
          <li onClick={() => handleSetPage(5)} style={{width: '110%'}}>
            <img src={profile1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Profile</span>
          </li>
      </ul>
              </div>
        
        </div> 
        </div>
           
          )

          
        case '3':
          return (
            
              <div className='scroller'>
           <div className='Container'>
            {/* <TonConnectButton /> */}
            {/* <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>My Lottie Animation</h1>
      <LottieAnimation animationData={animationData} width={200} height={200} />
    </div> */}
            <div className='mainProfile'> 

<div className='iconProf'>
      {accountName?.slice(0,1).toUpperCase()}
  </div> 
  <div className='profile'>
  {accountName?.slice(0,20)} 
  </div>
  <div className='balances' style={{marginRight:'8px'}}>

<div className='BalanceValue oasToken'>{balance !== null ? balance.toString().slice(0,5) : '0'} </div> 
<img src={tokenTon} alt="ton" className='tokenOasImg'/>

 </div>
 <div className='balances'>

 

<div className='BalanceValue oasToken'>{balanceToken !== null ? balanceToken.toString() : '0' } </div> 
<img src={tokenOas} alt="oas" className='tokenOasImgOas'/>
 </div>
</div>


          
            </div>
      
              <div style={{textAlign: 'center', width: '90%', margin: '0 auto'}}>
                 
             <div style={{fontSize: "24px", marginTop: "12px", fontWeight: "700"}}> Invite more friends </div>
             <div style={{fontSize: "15px", marginTop: "8px", color: "rgba(255, 255, 255, 0.5)"}}>
             ILorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
             </div>
              </div>
      {/* <button onClick={handleSetReferal}>
              clicl
       
      </button> */}


      {accountNames.length > 0 && (
       
         <ul className='dayleRewardMainRefUl '>

{accountNames.map((name: string, index) => (
  <li key={index}>
          <div className='dayleRewardMainRef ' style={{marginTop: "8px"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                <div className='dayleRewardImgRef1'>
                  {name.slice(0,1).toUpperCase()}
                </div>
                <div className='aboutDaylyRef'>
                
                      {name.slice(0,25)}
                      
                </div>
                </div>
                
                <div>
                <div className='rewardPosRef1'>
                  <img src={tokenOas} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" /> <span style={{marginTop: "1px"}}>+1.500 </span>
                  </div>
                </div>
               
              </div>
              </li>
            ))}
          </ul>
        
      )}
 
           <div className='inviteFriend' style={{display: "flex", position: "fixed", bottom: "130px"}}>
           <div className='shareTelegram' onClick={handleShareClick}>
           Invite friend
            </div>
      
     
      <div className='shareTelegramCopy' onClick={handleCopyClick}>
        <img src={copyPng} style={{width: "24px", height: "24px"}} alt="" />
      </div>
     
           </div>
            <div className="bottom-menu">    
              <div className='bottomMenuSize'>
              <ul>
          
            <li onClick={() => handleSetPage(2)} style={{width: '110%'}}>
              <img src={quests1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Quests</span>
            </li>
            
            <li onClick={() => handleSetPage(3)} style={{width: '110%'}}> 
            <img src={referal} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "white", fontSize: "12px"}}>Referal</span>
            </li>
            <li className='mainsapn' onClick={() => handleSetPage(0)} style={{position: 'relative', top: '-15px', width: '110%'}}>
              <img src={main1} className='bottomMenuImg mainimg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}} >Main</span>
            </li>
            <li onClick={() => handleSetPage(4)} style={{width: '110%'}}>
              <img src={leaderboard1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Leaderboard</span>
            </li>
            <li onClick={() => handleSetPage(5)} style={{width: '110%'}}>
              <img src={profile1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Profile</span>
            </li>
        </ul>
              </div>
        
        </div> 
        </div>
         
       
          )
          case '4':
          return (
            
               <div className='scroller'>
           <div className='Container'>
       
            {/* <TonConnectButton /> */}
            {/* <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>My Lottie Animation</h1>
      <LottieAnimation animationData={animationData} width={200} height={200} />
    </div> */}
            <div className='mainProfile'> 

<div className='iconProf'>
      {accountName?.slice(0,1).toUpperCase()}
  </div> 
  <div className='profile'>
  {accountName?.slice(0,20)} 
  </div>
  <div className='balances' style={{marginRight:'8px'}}>

<div className='BalanceValue oasToken'>{balance !== null ? balance.toString().slice(0,5) : '0'} </div> 
<img src={tokenTon} alt="ton" className='tokenOasImg'/>

 </div>
 <div className='balances'>

 

<div className='BalanceValue oasToken'>{balanceToken !== null ? balanceToken.toString() : '0' } </div> 
<img src={tokenOas} alt="oas" className='tokenOasImgOas'/>
 </div>
</div>



          
            </div>
            <div style={{marginTop: "8px", display: "flex", justifyContent: "center"}}>
                <div className='statsPlayer'>
                  <span style={{fontSize: "12px", marginBottom: '5px', color: "rgba(255, 255, 255, 0.5)"}}>Win
                    </span> 
                    <div> <img src={tokenOas} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" />{formatNumber(winOas)}
                      </div>
                      <div>
                      <img src={tokenTon} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" />{formatNumber(winTon)}
                      </div>
                </div>
                <div className='statsPlayer'>
                 <span style={{fontSize: "12px", color: "rgba(255, 255, 255, 0.5)"}}>Lost</span> 
                 <div> <img src={tokenOas} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" />{formatNumber(lostOas)}
                  </div>
                  <div>
                  <img src={tokenTon} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" />{formatNumber(lostTon)}
                  </div>
                </div>
                {/* <div className='statsPlayer'>
                  <span style={{fontSize: "12px", color: "rgba(255, 255, 255, 0.5)"}}>Taps</span> 
                  <div>
                    {formatNumber(taps)}
                  </div>
                </div> */}
             </div>
            
     
            <div className='playerStatsAll' >
              <div>
              <div>
             Total players:
              </div>
              <div>
              My Taps:
              </div>
              <div>
              My ranks:
              </div>
             
             
              </div>
             
              <div style={{fontSize: "14px", fontWeight: "700", color: "white"}}>
              <div>
                  {accounts.length}
                </div>
                <div>
                {formatNumber(taps)} 
                </div>
                
                <div>
                {rank} 
                </div>
                
              </div>
           
             </div>
      {/* <button onClick={handleSetReferal}>
              clicl
       
      </button> */}
      <div style={{fontSize: "24px", fontWeight: "700", display: "flex", justifyContent: "center"}}>
      Leaderboard
      </div>
        
      {accounts.length > 0 && (
       
       <ul className='dayleRewardMainRefUl '>

{accounts.map((account, index) => (
       <div className='dayleRewardMainRef ' style={{marginTop: "8px"}}>
            
             <div >
               <div style={{position: "relative", top: "-8px"}}>
                 # {index + 1}
               </div>
               <div style={{display: "flex", alignItems: 'center'}}>
               <div className='dayleRewardImgRef1'>
               {account.accountname.slice(0,1).toUpperCase() ? account.accountname.slice(0,1).toUpperCase() : "U"}
             </div>
             <div className='aboutDaylyRef1'>
               
             <li style={{ fontWeight: '300' }}>
                      {account.accountname ? account.accountname.slice(0,15) : 'Unnamed'}
                    </li>
                   
             </div>
               </div>
             
             </div>
             
             <div style={{width: '170px'  }}>
               <div style={{display: "flex" , justifyContent: 'space-around'}}>
               
             <div className='rewardPosRef'>
             <div style={{ marginBottom: "8px"}}>
                 Win
               </div>
               <div style={{ marginBottom: "8px", textAlign:'left'}}>
               <img src={tokenOas} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" /><span >{formatNumber(account.winsoas)} </span>
               </div>
           
                 
                 <div style={{textAlign:'left'}}> 
               <img src={tokenTon} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" /><span >{formatNumber((account.winton / 1_000_000_000))} </span>
              </div>
              
                   
               
               </div>
               
               <div className='rewardPosRef'>
               <div style={{ marginBottom: "8px"}}>
                 Lost
               </div>
               <div style={{ marginBottom: "8px", textAlign:'left'}}>
               <img src={tokenOas} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" /><span style={{marginTop: "1px"}}>{formatNumber(account.lostoas)} </span>
               </div>
           
                 
                 <div style={{textAlign:'left'}}> 
               <img src={tokenTon} style={{width: "16px", height: "16px", marginRight: "5px"}} alt="" /><span style={{marginTop: "1px"}}>{formatNumber(account.lostton / 1_000_000_000)}</span>
              </div>
              
                   
               
               </div>
               </div>
             
             </div>
            
           </div>
       
      ))}
       </ul>
       
        
      )}
 
           
            <div className="bottom-menu">    
              <div className='bottomMenuSize'>
              <ul>
          
            <li onClick={() => handleSetPage(2)} style={{width: '110%'}}>
              <img src={quests1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Quests</span>
            </li>
            
            <li onClick={() => handleSetPage(3)} style={{width: '110%'}}> 
            <img src={referal1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Referal</span>
            </li>
            <li className='mainsapn' onClick={() => handleSetPage(0)} style={{position: 'relative', top: '-15px', width: '110%'}}>
              <img src={main1} className='bottomMenuImg mainimg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}} >Main</span>
            </li>
            <li onClick={() => handleSetPage(4)} style={{width: '110%'}}>
              <img src={leaderboard} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "white", fontSize: "12px"}}>Leaderboard</span>
            </li>
            <li onClick={() => handleSetPage(5)} style={{width: '110%'}}>
              <img src={profile1} className='bottomMenuImg' alt="image" />
              <br></br>
              <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Profile</span>
            </li>
        </ul>
              </div>
        
        </div> 
           </div>
         
        
        )
        case '5':
          return (
          
               <div className='scroller'>
           <div className='Container'>
       
            {/* <TonConnectButton /> */}
            {/* <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>My Lottie Animation</h1>
      <LottieAnimation animationData={animationData} width={200} height={200} />
    </div> */}
            <div className='mainProfile'> 

<div className='iconProf'>
      {accountName?.slice(0,1).toUpperCase()}
  </div> 
  <div className='profile'>
  {accountName?.slice(0,20)} 
  </div>
  <div className='balances' style={{marginRight:'8px'}}>

<div className='BalanceValue oasToken'>{balance !== null ? balance.toString().slice(0,5) : '0'} </div> 
<img src={tokenTon} alt="ton" className='tokenOasImg'/>
 
 </div>
 <div className='balances'>

 
<div className='BalanceValue oasToken'>{balanceToken !== null ? balanceToken.toString(): '0' } </div> 
<img src={tokenOas} alt="oas" className='tokenOasImgOas'/>
 </div>
</div>
 
            </div>
            <div className="carousel-container" {...swipeHandlers}>
            
            <div className="carousel"  style={{
            transform: `translateX(${currentIndex * 70}%)`,
            transition: 'transform 0.5s ease',
          }}>
            
            <div className="blockWalletTOn" >
              <div className="walletTon">
              <div>
                  <div style={{ fontSize: '14px' }}>0.00 TON </div>
                  <div style={{ fontSize: '20px', marginTop: '8px' }}>
                      0.00 $
                  </div>
                </div>
                <div>
                  <img
                    src={tokenTon}
                    alt=""
                    style={{ width: '37px', height: '37px' }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginTop: '16px',
                }}
              >
                <div className="depositdef" >+Deposit</div>
                  <div>
             
                  </div>
                
                <div className="Withdrawdef" >Withdraw</div>
              </div>
            </div>
       
            <div className="blockWalletTOn">
  <div className={`walletTon ${activeDep === 'activeDep' || activeDep === 'activeDep1' ? 'activeDep' : ''} ${activeDep === 'closeDep' ? 'inactiveDep' : ''}`}>
    <div>
      <div style={{ fontSize: '14px' }}>{balance !== null ? balance.toString() : '0.00 TON'}</div>
      <div style={{ fontSize: '20px', marginTop: '8px' }}>
        {priceUsdt !== null ? Number(priceUsdt).toFixed(2) + ' $' : '0.00 $'}
      </div>
    </div>
    <div>
      <img
        src={tokenTon}
        alt="TON Token"
        style={{ width: '37px', height: '37px' }}
      />
    </div>
  </div>

  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
    <div
      className={`deposit ${activeDep === 'activeDep' ? 'activeDep' : ''} ${activeDep === 'closeDep' ? 'inactiveDep' : ''}`}
      onClick={() => handleDepClick('activeDep')}
    >
      +Deposit
    </div>

    <input 
      type="tel" 
      inputMode="decimal" 
      pattern="[0-9]*[.]?[0-9]*" 
      placeholder="0,00 TON"
      onChange={handleAmountChange}
      style={{ fontSize: '16px', padding: '8px' }}
      className={`inputMain ${activeDep === 'activeDep' || activeDep === 'activeDep1' ? 'activeDep' : ''}  ${activeDep === 'closeDep' ? 'inactiveDep' : ''}`}
    />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div
        className={`depositPlus ${activeDep === 'activeDep' ? 'activeDep' : ''} ${activeDep === 'closeDep' ? 'inactiveDep' : ''}`}
        onClick={handleSendMoney}
      >
        +Deposit
      </div>
      <div
        className={`backPlus ${activeDep === 'activeDep' ? 'activeDep' : ''} ${activeDep === 'closeDep' ? 'inactiveDep' : ''}`}
        onClick={() => handleDepClick('closeDep')}
      >
        Back
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , position: 'absolute'}}>
      <div
        className={`depositPlus ${activeDep === 'activeDep1' ? 'activeDep1' : ''} ${activeDep === 'closeDep' ? 'inactiveDep' : ''}`}
        onClick={handleSendOutMoney}
      >
        Withdraw
      </div>
      <div
        className={`backPlus ${activeDep === 'activeDep1' ? 'activeDep' : ''} ${activeDep === 'closeDep' ? 'inactiveDep' : ''}`}
        onClick={() => handleDepClick('closeDep')}
      >
        Back
      </div>
    </div>
    <div
      className={`withdraw ${activeDep === 'activeDep1' ? 'activeDep' : ''} ${activeDep === 'closeDep' ? 'inactiveDep' : ''}`}
      onClick={() => handleDepClick('activeDep1')}
    >
      Withdraw
    </div>
  </div>
</div>
{/* <button onClick={checkFInd}>
checkFindLt
</button> */}
            <div className="blockWalletTOn" >
              <div className="walletTon">
              <div>
                  <div style={{ fontSize: '14px' }}>0.00 TON </div>
                  <div style={{ fontSize: '20px', marginTop: '8px' }}>
                      0.00 $
                  </div>
                </div>
                <div>
                  <img
                    src={tokenTon}
                    alt=""
                    style={{ width: '37px', height: '37px' }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginTop: '16px',
                }}
              >
                <div className="depositdef" >+Deposit</div>
                  <div>
                 
        
                  </div>
                
                <div className="Withdrawdef" >Withdraw</div>
              </div>
            </div>
         
        </div>
      
      </div>
        <div style={{display: "flex" , justifyContent: "center", marginTop: "12px"}}>
          <div className={`swapT ${currentIndex === 1 ? 'activeT' : ''}`} style={{marginRight: "8px"}}>

          </div>
          <div className={`swapT ${currentIndex === 0 ? 'activeT' : ''}`} style={{marginRight: "8px"}}>

          </div>
          <div className={`swapT ${currentIndex === -1 ? 'activeT' : ''}`}>

          </div>
        </div>
        <div style={{width: "100%", display: "flex", marginTop: "15px"}}>
        <div className='coonnectWalletBtn'>
        <TonConnectButton />
        </div>
        </div>
        
          


        <div className='allTask'>
              <div  className='dayly'>
                 
              <div className='dayleRewardMain' style={{borderRadius: '15px', marginTop: '20px'}}>
                <div className='dayleRewardImg'>
                  <img src={tokenTon} style={{width: "32px", height: "32px"}} alt="" />
                </div>
                <div className='aboutDayly' style={{fontSize: '16px'}}>
                Transaction history
                
                </div>
                
               
                    <div className='START' onClick={sendLinkChat}>
                  -
                </div>
                
              </div>


              </div>
              <div className='dayleRewardMain top'>
                <div className='dayleRewardImg1'>
                  <img src={contact} style={{width: "24px", height: "24px"}} alt="" />
                </div>
                <div className='aboutDayly'>
                Contact Support
                
                </div>
              
                    <div className='START' onClick={sendLink}>
                    -
                  </div>
                  
              </div>
              <div className='dayleRewardMain'>
                <div className='dayleRewardImg1'>
                  <img src={term} style={{width: "24px", height: "24px"}} alt="" />
                </div>
                <div className='aboutDayly'>
                Term of Use
                
                </div>
                
               
                    <div className='START' onClick={sendLinkChat}>
                  -
                </div>
                
              </div>
            
              <div className='dayleRewardMain bot'>
                <div className='dayleRewardImg2'>
                  <img src={news} style={{width: "20px", height: "20px"}} alt="" />
                </div>
                <div className='aboutDayly'>
                Project News
                
                </div>
                <div className='START'>
                  -
                </div>
              </div>
            </div>
      
      
 
           
            <div className="bottom-menu">    
              <div className='bottomMenuSize'>
              <ul>
          
          <li onClick={() => handleSetPage(2)} style={{width: '110%'}}>
            <img src={quests1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Quests</span>
          </li>
          
          <li onClick={() => handleSetPage(3)} style={{width: '110%'}}> 
          <img src={referal1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Referal</span>
          </li>
          <li className='mainsapn' onClick={() => handleSetPage(0)} style={{position: 'relative', top: '-15px', width: '110%'}}>
            <img src={main1}  className='bottomMenuImg mainimg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}} >Main</span>
          </li>
          <li onClick={() => handleSetPage(4)} style={{width: '110%'}}>
            <img src={leaderboard1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Leaderboard</span>
          </li>
          <li onClick={() => handleSetPage(5)} style={{width: '110%'}}>
            <img src={profile} className='bottomMenuImg'  alt="image" />
            <br></br>
            <span style={{color: "white", fontSize: "12px"}}>Profile</span>
          </li>
      </ul>
              </div>
        
        </div> 
           </div>
         
           
        )
        case '6':
          return (
          
               <div className='scroller1'>
                <div className='undeScroll'>
            <div className='Container cont'>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1'}}>
<div className='timer'>
  <div className='timerName'> TIMER</div>
      <span className='spanTimer'>{timer !== null ? timer : '0:00'}</span> 
        </div>


 <div className='balances bal'>

 
<div className='BalanceValue oasToken g'>{balanceToken !== null ? balanceToken : '0' } </div> 
<img src={tokenOas} alt="oas" className='tokenOasImgOas tok'/>
 </div>
</div>
<div style={{display: 'flex', flex: '1'}}>
<div className='mainProfile1'> 
<div className='iconProf1'>
 {accountName?.slice(0,1).toUpperCase()}
</div> 

<div className='profile1'>
{accountName?.slice(0,20)}
</div>
</div>  
</div>

       </div>
   
        

           
    <div className='InfoSection'>
       <img src={gameJinMain} style={{width:'365px', height: '168px', marginTop: '20px'}} alt="" />
       <div className={`reveal-container ${isVisible ? 'visible' : ''}`}>
       <img src={gold} className={`gameGold ${isVisible ? 'visible' : ''}`} alt="" />
       </div> 
      
       <img src={gameLamp} className='gameLamp' style={{width:'296px', height: '296px'}} alt="" />
       <div className='styleGame'>

       </div>
       <div>

       </div>
    </div>
    <div style={{position: 'relative', top:'-260px', textAlign: 'center', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {totalBalanceBet} <img src={tokenOas} style={{marginLeft: '5px', width: '30px', height: '30px'}} alt="" />
    </div>
 
    <ul>
        {images.map((index) => (
          <li key={index} className={`moving-object ${isAnimating? 'animate' : ''} `}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
        {images1.map((index) => (
          <li key={index} className={`moving-object ${isAnimating1? 'animate1' : ''}`}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
      </ul>
    <div className='bettersCont'>
      <ul className='betters'>
     
    {balanceChanges.map((change, index) => (
          <li key={index}>{change}</li>
        ))}
      </ul>
    
    </div>
    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '140px'}}>
    <div className={`Button ${zone}`} onClick={handleClick}>
            <img src={btn} className={`btngame ${zone}`}  alt="" />
            
             </div>
             <div style={{position: 'fixed', bottom: '25px'}}>Bet 20 <span style={{color:'#A7A7C8'}}>OAS</span> 
              </div>
    </div>

    <div className={`popup1 ${isEnd}`}>

</div>
<div className={`popup ${isEnd} `}>
<div className='closeBtn' onClick={() => setIsEnd('dis')}>
    
        
  </div>
<div className='popupin'>
<img src={winGame} className='lampDay' alt="" />
  
</div>
  <div className='mainDaylyReward'>
  <span className='spanMaindayly1'>Congratulations to the winner
    </span>
    
  </div>



    <div className='MainBoxDaily1' >
        <div className='topText'>
        <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
        Username <div style={{fontSize: '16px', color: 'white'}}>
          {lastBetter !== null ? lastBetter : '0'}
          </div> 
        </div>
        <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
        Total bank: <div style={{fontSize: '16px', color: 'white'}}>{totalBalanceBet !== null ? totalBalanceBet : '0'}
          </div>
        </div>
        <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
        Player's bet: <div style={{fontSize: '16px', color: 'white'}}>
        {maxBet !== null ? maxBet : '0'}
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
        Number of clicks:  
        <div style={{fontSize: '16px', color: 'white'}}>
        {totalTaps !== null ? totalTaps : '0'}
          </div>
        </div>
        </div>
        
       {/* <div>
       <div style={{marginBottom: '8px'}}>
       {lastBetter !== null ? lastBetter : '0'}
        </div>
        <div style={{marginBottom: '8px'}}>
        {totalBalanceBet !== null ? totalBalanceBet : '0'}
        </div>
        <div style={{marginBottom: '8px'}}>
      {maxBet !== null ? maxBet : '0'}
        </div>
        <div>
        {totalTaps !== null ? totalTaps : '0'}
        </div>
       </div> */}
    
   </div>
   <div style={{display: 'flex', justifyContent:'center'}}>
   <div className='isWinner' onClick={() => setIsEnd('dis')}>
   {textWin}
   </div>

   </div>
 
</div>
            
             {/* handleDecreaseBalance */}
          <div style={{width: '100%' , display: 'flex', justifyContent: 'center', zIndex: '6'}}>
          <div className={`Card ${actTime}`}>
            <div>
             <div style={{fontSize: '40px'}}>
             START
              </div> 
              <div style={{textAlign: 'center', fontSize: '60px'}}>
              {timerColl !== null ? timerColl : '0'}
              </div>
              
            </div>
            
       {/* <ul> {lastBetter?.slice(0,10) }
         
       </ul>  */}
     </div>
          </div>
          {/* <div onClick={() => setIsEnd('act')}> 
            vdvd
          </div> */}
    
   </div>
   </div>
       
       
          )

          case '60':
          return (
          
            <div className='scroller1'>
              <div className='undeScroll'>
         <div className='Container cont'>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1'}}>
<div className='timer'>
<div className='timerName'> TIMER</div>
   <span className='spanTimer'>{timer !== null ? timer : '0:00'}</span> 
     </div>

     <div className='balances bal' style={{marginRight:'8px'}}>

      <div className='BalanceValue oasToken g'> {balance !== null ? balance : '0'} </div> 
      <img src={tokenTon} alt="ton" className='tokenOasImg tok'/>
 
      </div>


</div>
<div style={{display: 'flex', flex: '1'}}>
<div className='mainProfile1'> 
<div className='iconProf1'>
{accountName?.slice(0,1).toUpperCase()}
</div> 

<div className='profile1'>
{accountName?.slice(0,20)}
</div>
</div>  
</div>

    </div>
   

        
 <div className='InfoSection'>
    <img src={gameJinMain} style={{width:'365px', height: '168px', marginTop: '20px'}} alt="" />
    <div className={`reveal-container ${isVisible ? 'visible' : ''}`}>
    <img src={gold} className={`gameGold ${isVisible ? 'visible' : ''}`} alt="" />
    </div> 
   
    <img src={gameLamp} className='gameLamp' style={{width:'296px', height: '296px'}} alt="" />
    <div className='styleGame'>

    </div>
    <div>

    </div>
 </div>
 <div style={{position: 'relative', top:'-260px', textAlign: 'center', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {totalBalanceBet} <img src={tokenTon} style={{marginLeft: '5px', width: '30px', height: '30px'}} alt="" />
    </div>
    <ul>
        {images.map((index) => (
          <li key={index} className={`moving-object ${isAnimating? 'animate' : ''} `}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
        {images1.map((index) => (
          <li key={index} className={`moving-object ${isAnimating1? 'animate1' : ''}`}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
      </ul>
 <div className='bettersCont'>
   <ul className='betters'>
  
 {balanceChanges.map((change, index) => (
       <li key={index}>{change}</li>
     ))}
   </ul>
 
 </div>
 <div style={{display: 'flex', justifyContent: 'center'}}>
 <div className={`Button1 ${zone}`} onClick={handleClick}>
         <img src={tokenTonCent} className={`btngame1 ${zone}`}  alt="" />
         
          </div>
          <div style={{position: 'fixed', bottom: '25px'}}>Bet 0.001 <span style={{color:'#0088CC'}}>TON</span> </div>
 </div>

 <div className={`popup1 ${isEnd}`}>

</div>
<div className={`popup ${isEnd} `}>
<div className='closeBtn' onClick={() => setIsEnd('dis')}>
 
     
</div>
<div className='popupin'>
<img src={winGame} className='lampDay' alt="" />

</div>
<div className='mainDaylyReward'>
<span className='spanMaindayly1'>Congratulations to the winner
 </span>
 
</div>



 <div className='MainBoxDaily1' >
     <div className='topText'>
     <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
     Username <div style={{fontSize: '16px', color: 'white'}}>
       {lastBetter !== null ? lastBetter : '0'}
       </div> 
     </div>
     <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
     Total bank: <div style={{fontSize: '16px', color: 'white'}}>{totalBalanceBet !== null ? totalBalanceBet : '0'}
       </div>
     </div>
     <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
     Player's bet: <div style={{fontSize: '16px', color: 'white'}}>
     {maxBet !== null ? maxBet : '0'}
       </div>
     </div>
     <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
     Number of clicks:  
     <div style={{fontSize: '16px', color: 'white'}}>
     {totalTaps !== null ? totalTaps : '0'}
       </div>
     </div>
     </div>
     
    {/* <div>
    <div style={{marginBottom: '8px'}}>
    {lastBetter !== null ? lastBetter : '0'}
     </div>
     <div style={{marginBottom: '8px'}}>
     {totalBalanceBet !== null ? totalBalanceBet : '0'}
     </div>
     <div style={{marginBottom: '8px'}}>
   {maxBet !== null ? maxBet : '0'}
     </div>
     <div>
     {totalTaps !== null ? totalTaps : '0'}
     </div>
    </div> */}
 
</div>
<div style={{display: 'flex', justifyContent:'center'}}>
<div className='isWinner' onClick={() => setIsEnd('dis')}>
{textWin}
</div>

</div>

</div>
         
          {/* handleDecreaseBalance */}
       <div style={{width: '100%' , display: 'flex', justifyContent: 'center', zIndex: '6'}}>
       <div className={`Card ${actTime}`}>
         <div>
         <div style={{fontSize: '40px'}}>
             START
              </div> 
              <div style={{textAlign: 'center', fontSize: '60px'}}>
              {timerColl !== null ? timerColl : '0'}
              </div>
           
         </div>
         
    {/* <ul> {lastBetter?.slice(0,10) }
      
    </ul>  */}
  </div>
       </div>
       {/* <div onClick={() => setIsEnd('act')}> 
         vdvd
       </div> */}
 </div>

 </div>
       
       
          )
          case '7':
            return (
              
                 <div className='scroller1'>
                   <div className='undeScroll'>
              <div className='Container cont'>
  
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1'}}>
  <div className='timer'>
    <div className='timerName'> TIMER</div>
        <span className='spanTimer'>{timer !== null ? timer : '0:00'}</span> 
          </div>
  
  
   <div className='balances bal'>
  
   
  <div className='BalanceValue oasToken g'>{balanceToken !== null ? balanceToken : '0' } </div> 
  <img src={tokenOas} alt="oas" className='tokenOasImgOas tok'/>
   </div>
  </div>
  <div style={{display: 'flex', flex: '1'}}>
  <div className='mainProfile1'> 
  <div className='iconProf1'>
   {accountName?.slice(0,1).toUpperCase()}
  </div> 
  
  <div className='profile1'>
  {accountName?.slice(0,20)}
  </div>
  </div>  
  </div>
  
         </div>
        
  
             
      <div className='InfoSection'>
         <img src={gameJinMain} style={{width:'365px', height: '168px', marginTop: '20px'}} alt="" />
         <div className={`reveal-container ${isVisible ? 'visible' : ''}`}>
         <img src={gold} className={`gameGold ${isVisible ? 'visible' : ''}`} alt="" />
         </div> 
        
         <img src={gameLamp} className='gameLamp' style={{width:'296px', height: '296px'}} alt="" />
         <div className='styleGame'>
  
         </div>
         <div>
  
         </div>
      </div>
      <div style={{position: 'relative', top:'-260px', textAlign: 'center', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {totalBalanceBet} <img src={tokenOas} style={{marginLeft: '5px', width: '30px', height: '30px'}} alt="" />
    </div>
    <ul>
        {images.map((index) => (
          <li key={index} className={`moving-object ${isAnimating? 'animate' : ''} `}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
        {images1.map((index) => (
          <li key={index} className={`moving-object ${isAnimating1? 'animate1' : ''}`}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
      </ul>
      <div className='bettersCont'>
        <ul className='betters'>
       
      {balanceChanges.map((change, index) => (
            <li key={index}>{change}</li>
          ))}
        </ul>
      
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <div className={`Button ${zone}`} onClick={handleClick}>
              <img src={btn} className={`btngame ${zone}`}  alt="" />

               </div>
               <div style={{position: 'fixed', bottom: '25px'}}>Bet 50 <span style={{color:'#A7A7C8'}}>OAS</span> </div>
      </div>
  
      <div className={`popup1 ${isEnd}`}>
  
  </div>
  <div className={`popup ${isEnd} `}>
  <div className='closeBtn' onClick={() => setIsEnd('dis')}>
      
          
    </div>
  <div className='popupin'>
  <img src={winGame} className='lampDay' alt="" />
    
  </div>
    <div className='mainDaylyReward'>
    <span className='spanMaindayly1'>Congratulations to the winner
      </span>
      
    </div>
  
  
  
      <div className='MainBoxDaily1' >
          <div className='topText'>
          <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          Username <div style={{fontSize: '16px', color: 'white'}}>
            {lastBetter !== null ? lastBetter : '0'}
            </div> 
          </div>
          <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          Total bank: <div style={{fontSize: '16px', color: 'white'}}>{totalBalanceBet !== null ? totalBalanceBet : '0'}
            </div>
          </div>
          <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          Player's bet: <div style={{fontSize: '16px', color: 'white'}}>
          {maxBet !== null ? maxBet : '0'}
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          Number of clicks:  
          <div style={{fontSize: '16px', color: 'white'}}>
          {totalTaps !== null ? totalTaps : '0'}
            </div>
          </div>
          </div>
          
         {/* <div>
         <div style={{marginBottom: '8px'}}>
         {lastBetter !== null ? lastBetter : '0'}
          </div>
          <div style={{marginBottom: '8px'}}>
          {totalBalanceBet !== null ? totalBalanceBet : '0'}
          </div>
          <div style={{marginBottom: '8px'}}>
        {maxBet !== null ? maxBet : '0'}
          </div>
          <div>
          {totalTaps !== null ? totalTaps : '0'}
          </div>
         </div> */}
      
     </div>
     <div style={{display: 'flex', justifyContent:'center'}}>
     <div className='isWinner' onClick={() => setIsEnd('dis')}>
     {textWin}
     </div>
  
     </div>
   
  </div>
              
               {/* handleDecreaseBalance */}
            <div style={{width: '100%' , display: 'flex', justifyContent: 'center', zIndex: '6'}}>
            <div className={`Card ${actTime}`}>
              <div>
              <div style={{fontSize: '40px'}}>
             START
              </div> 
              <div style={{textAlign: 'center', fontSize: '60px'}}>
              {timerColl !== null ? timerColl : '0'}
              </div>
                
              </div>
              
         {/* <ul> {lastBetter?.slice(0,10) }
           
         </ul>  */}
       </div>
            </div>
            {/* <div onClick={() => setIsEnd('act')}> 
              vdvd
            </div> */}
      
     </div>
     
         </div>
            )
  
            case '70':
            return (
             
              <div className='scroller1'>
                 <div className='undeScroll'>
           <div className='Container cont'>
  
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1'}}>
  <div className='timer'>
  <div className='timerName'> TIMER</div>
     <span className='spanTimer'>{timer !== null ? timer : '0:00'}</span> 
       </div>
  
       <div className='balances bal' style={{marginRight:'8px'}}>
  
  <div className='BalanceValue oasToken g'> {balance !== null ? balance : '0'} </div> 
  <img src={tokenTon} alt="ton" className='tokenOasImg tok'/>
   
   </div>
  </div>
  <div style={{display: 'flex', flex: '1'}}>
  <div className='mainProfile1'> 
  <div className='iconProf1'>
  {accountName?.slice(0,1).toUpperCase()}
  </div> 
  
  <div className='profile1'>
  {accountName?.slice(0,20)}
  </div>
  </div>  
  </div>
  
      </div>
     
  
          
   <div className='InfoSection'>
      <img src={gameJinMain} style={{width:'365px', height: '168px', marginTop: '20px'}} alt="" />
      <div className={`reveal-container ${isVisible ? 'visible' : ''}`}>
      <img src={gold} className={`gameGold ${isVisible ? 'visible' : ''}`} alt="" />
      </div> 
     
      <img src={gameLamp} className='gameLamp' style={{width:'296px', height: '296px'}} alt="" />
      <div className='styleGame'>
  
      </div>
      <div>
  
      </div>
   </div>

   <div style={{position: 'relative', top:'-260px', textAlign: 'center', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {totalBalanceBet} <img src={tokenTon} style={{marginLeft: '5px', width: '30px', height: '30px'}} alt="" />
    </div>
    <ul>
        {images.map((index) => (
          <li key={index} className={`moving-object ${isAnimating? 'animate' : ''} `}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
        {images1.map((index) => (
          <li key={index} className={`moving-object ${isAnimating1? 'animate1' : ''}`}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
      </ul>
   <div className='bettersCont'>
     <ul className='betters'>
    
   {balanceChanges.map((change, index) => (
         <li key={index}>{change}</li>
       ))}
     </ul>
   
   </div>
   <div style={{display: 'flex', justifyContent: 'center'}}>
   <div className={`Button1 ${zone}`} onClick={handleClick}>
         <img src={tokenTonCent} className={`btngame1 ${zone}`}  alt="" />
         
          </div>
          <div style={{position: 'fixed', bottom: '25px'}}>Bet 0.05 <span style={{color:'#0088CC'}}>TON</span> </div>
   </div>
  
   <div className={`popup1 ${isEnd}`}>
  
  </div>
  <div className={`popup ${isEnd} `}>
  <div className='closeBtn' onClick={() => setIsEnd('dis')}>
   
       
  </div>
  <div className='popupin'>
  <img src={winGame} className='lampDay' alt="" />
  
  </div>
  <div className='mainDaylyReward'>
  <span className='spanMaindayly1'>Congratulations to the winner
   </span>
   
  </div>
  
  
  
   <div className='MainBoxDaily1' >
       <div className='topText'>
       <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
       Username <div style={{fontSize: '16px', color: 'white'}}>
         {lastBetter !== null ? lastBetter : '0'}
         </div> 
       </div>
       <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
       Total bank: <div style={{fontSize: '16px', color: 'white'}}>{totalBalanceBet !== null ? totalBalanceBet : '0'}
         </div>
       </div>
       <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
       Player's bet: <div style={{fontSize: '16px', color: 'white'}}>
       {maxBet !== null ? maxBet : '0'}
         </div>
       </div>
       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
       Number of clicks:  
       <div style={{fontSize: '16px', color: 'white'}}>
       {totalTaps !== null ? totalTaps : '0'}
         </div>
       </div>
       </div>
       
      {/* <div>
      <div style={{marginBottom: '8px'}}>
      {lastBetter !== null ? lastBetter : '0'}
       </div>
       <div style={{marginBottom: '8px'}}>
       {totalBalanceBet !== null ? totalBalanceBet : '0'}
       </div>
       <div style={{marginBottom: '8px'}}>
     {maxBet !== null ? maxBet : '0'}
       </div>
       <div>
       {totalTaps !== null ? totalTaps : '0'}
       </div>
      </div> */}
   
  </div>
  <div style={{display: 'flex', justifyContent:'center'}}>
  <div className='isWinner' onClick={() => setIsEnd('dis')}>
  {textWin}
  </div>
  
  </div>
  
  </div>
           
            {/* handleDecreaseBalance */}
         <div style={{width: '100%' , display: 'flex', justifyContent: 'center', zIndex: '6'}}>
         <div className={`Card ${actTime}`}>
           <div>
           <div style={{fontSize: '40px'}}>
             START
              </div> 
              <div style={{textAlign: 'center', fontSize: '60px'}}>
              {timerColl !== null ? timerColl : '0'}
              </div>
             
           </div>
           
      {/* <ul> {lastBetter?.slice(0,10) }
        
      </ul>  */}
    </div>
         </div>
         {/* <div onClick={() => setIsEnd('act')}> 
           vdvd
         </div> */}
   
  </div>
  
         </div>
            )
            case '8':
              return (
               
                   <div className='scroller1'>
                    <div className='undeScroll'>
                <div className='Container cont'>
    
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1'}}>
    <div className='timer'>
      <div className='timerName'> TIMER</div>
          <span className='spanTimer'>{timer !== null ? timer : '0:00'}</span> 
            </div>
    
    
     <div className='balances bal'>
    
     
    <div className='BalanceValue oasToken g'>{balanceToken !== null ? balanceToken : '0' } </div> 
    <img src={tokenOas} alt="oas" className='tokenOasImgOas tok'/>
     </div>
    </div>
    <div style={{display: 'flex', flex: '1'}}>
    <div className='mainProfile1'> 
    <div className='iconProf1'>
     {accountName?.slice(0,1).toUpperCase()}
    </div> 
    
    <div className='profile1'>
    {accountName?.slice(0,20)}
    </div>
    </div>  
    </div>
    
           </div>
          
    
               
        <div className='InfoSection'>
           <img src={gameJinMain} style={{width:'365px', height: '168px', marginTop: '20px'}} alt="" />
           <div className={`reveal-container ${isVisible ? 'visible' : ''}`}>
           <img src={gold} className={`gameGold ${isVisible ? 'visible' : ''}`} alt="" />
           </div> 
          
           <img src={gameLamp} className='gameLamp' style={{width:'296px', height: '296px'}} alt="" />
           <div className='styleGame'>
    
           </div>
           <div>
    
           </div>
        </div>
        <div style={{position: 'relative', top:'-260px', textAlign: 'center', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {totalBalanceBet} <img src={tokenOas} style={{marginLeft: '5px', width: '30px', height: '30px'}} alt="" />
    </div>
    <ul>
        {images.map((index) => (
          <li key={index} className={`moving-object ${isAnimating? 'animate' : ''} `}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
        {images1.map((index) => (
          <li key={index} className={`moving-object ${isAnimating1? 'animate1' : ''}`}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
      </ul>
        <div className='bettersCont'>
          <ul className='betters'>
         
        {balanceChanges.map((change, index) => (
              <li key={index}>{change}</li>
            ))}
          </ul>
        
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <div className={`Button ${zone}`} onClick={handleClick}>
                <img src={btn} className={`btngame ${zone}`}  alt="" />
                
                 </div>
                 <div style={{position: 'fixed', bottom: '25px'}}>Bet 100 <span style={{color:'#A7A7C8'}}>OAS</span>  </div>
        </div>
    
        <div className={`popup1 ${isEnd}`}>
    
    </div>
    <div className={`popup ${isEnd} `}>
    <div className='closeBtn' onClick={() => setIsEnd('dis')}>
        
            
      </div>
    <div className='popupin'>
    <img src={winGame} className='lampDay' alt="" />
      
    </div>
      <div className='mainDaylyReward'>
      <span className='spanMaindayly1'>Congratulations to the winner
        </span>
        
      </div>
    
    
    
        <div className='MainBoxDaily1' >
            <div className='topText'>
            <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
            Username <div style={{fontSize: '16px', color: 'white'}}>
              {lastBetter !== null ? lastBetter : '0'}
              </div> 
            </div>
            <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
            Total bank: <div style={{fontSize: '16px', color: 'white'}}>{totalBalanceBet !== null ? totalBalanceBet : '0'}
              </div>
            </div>
            <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
            Player's bet: <div style={{fontSize: '16px', color: 'white'}}>
            {maxBet !== null ? maxBet : '0'}
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
            Number of clicks:  
            <div style={{fontSize: '16px', color: 'white'}}>
            {totalTaps !== null ? totalTaps : '0'}
              </div>
            </div>
            </div>
            
           {/* <div>
           <div style={{marginBottom: '8px'}}>
           {lastBetter !== null ? lastBetter : '0'}
            </div>
            <div style={{marginBottom: '8px'}}>
            {totalBalanceBet !== null ? totalBalanceBet : '0'}
            </div>
            <div style={{marginBottom: '8px'}}>
          {maxBet !== null ? maxBet : '0'}
            </div>
            <div>
            {totalTaps !== null ? totalTaps : '0'}
            </div>
           </div> */}
        
       </div>
       <div style={{display: 'flex', justifyContent:'center'}}>
       <div className='isWinner' onClick={() => setIsEnd('dis')}>
       {textWin}
       </div>
    
       </div>
     
    </div>
                
                 {/* handleDecreaseBalance */}
              <div style={{width: '100%' , display: 'flex', justifyContent: 'center', zIndex: '6'}}>
              <div className={`Card ${actTime}`}>
                <div>
                <div style={{fontSize: '40px'}}>
             START
              </div> 
              <div style={{textAlign: 'center', fontSize: '60px'}}>
              {timerColl !== null ? timerColl : '0'}
              </div>
                  
                </div>
                
           {/* <ul> {lastBetter?.slice(0,10) }
             
           </ul>  */}
         </div>
              </div>
              {/* <div onClick={() => setIsEnd('act')}> 
                vdvd
              </div> */}
        
       </div>
      </div>
           
              )
    
              case '80':
              return (
                
                <div className='scroller1'>
                  <div className='undeScroll'>
             <div className='Container cont'>
    
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1'}}>
    <div className='timer'>
    <div className='timerName'> TIMER</div>
       <span className='spanTimer'>{timer !== null ? timer : '0:00'}</span> 
         </div>
    
         <div className='balances bal' style={{marginRight:'8px'}}>
    
    <div className='BalanceValue oasToken g'> {balance !== null ? balance : '0'} </div> 
    <img src={tokenTon} alt="ton" className='tokenOasImg tok'/>
     
     </div>
    </div>
    <div style={{display: 'flex', flex: '1'}}>
    <div className='mainProfile1'> 
    <div className='iconProf1'>
    {accountName?.slice(0,1).toUpperCase()}
    </div> 
    
    <div className='profile1'>
    {accountName?.slice(0,20)}
    </div>
    </div>  
    </div>
    
        </div>
       
    
            
     <div className='InfoSection'>
        <img src={gameJinMain} style={{width:'365px', height: '168px', marginTop: '20px'}} alt="" />
        <div className={`reveal-container ${isVisible ? 'visible' : ''}`}>
        <img src={gold} className={`gameGold ${isVisible ? 'visible' : ''}`} alt="" />
        </div> 
       
        <img src={gameLamp} className='gameLamp' style={{width:'296px', height: '296px'}} alt="" />
        <div className='styleGame'>
    
        </div>
        <div>
    
        </div>
     </div>
     <div style={{position: 'relative', top:'-260px', textAlign: 'center', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {totalBalanceBet} <img src={tokenTon} style={{marginLeft: '5px', width: '30px', height: '30px'}} alt="" />
    </div>
    <ul>
        {images.map((index) => (
          <li key={index} className={`moving-object ${isAnimating? 'animate' : ''} `}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
        {images1.map((index) => (
          <li key={index} className={`moving-object ${isAnimating1? 'animate1' : ''}`}>
            {/* <img  style={{width: '30px', height: '30px'}} src={src} alt={`Image ${index + 1}`} /> */}
          </li>
          
        ))}
      </ul>
     <div className='bettersCont'>
       <ul className='betters'>
      
     {balanceChanges.map((change, index) => (
           <li key={index}>{change}</li>
         ))}
       </ul>
     
     </div>
     <div style={{display: 'flex', justifyContent: 'center'}}>
      <div className={`Button1 ${zone}`} onClick={handleClick}>
         <img src={tokenTonCent} className={`btngame1 ${zone}`}  alt="" />
         
          </div>
          <div style={{position: 'fixed', bottom: '25px'}}>Bet 0.1 <span style={{color:'#0088CC'}}>TON</span> </div>
     </div>
    
     <div className={`popup1 ${isEnd}`}>
    
    </div>
    <div className={`popup ${isEnd} `}>
    <div className='closeBtn' onClick={() => setIsEnd('dis')}>
     
         
    </div>
    <div className='popupin'>
    <img src={winGame} className='lampDay' alt="" />
    
    </div>
    <div className='mainDaylyReward'>
    <span className='spanMaindayly1'>Congratulations to the winner
     </span>
     
    </div>
    
    
    
     <div className='MainBoxDaily1' >
         <div className='topText'>
         <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
         Username <div style={{fontSize: '16px', color: 'white'}}>
           {lastBetter !== null ? lastBetter : '0'}
           </div> 
         </div>
         <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
         Total bank: <div style={{fontSize: '16px', color: 'white'}}>{totalBalanceBet !== null ? totalBalanceBet : '0'}
           </div>
         </div>
         <div style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
         Player's bet: <div style={{fontSize: '16px', color: 'white'}}>
         {maxBet !== null ? maxBet : '0'}
           </div>
         </div>
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
         Number of clicks:  
         <div style={{fontSize: '16px', color: 'white'}}>
         {totalTaps !== null ? totalTaps : '0'}
           </div>
         </div>
         </div>
         
        {/* <div>
        <div style={{marginBottom: '8px'}}>
        {lastBetter !== null ? lastBetter : '0'}
         </div>
         <div style={{marginBottom: '8px'}}>
         {totalBalanceBet !== null ? totalBalanceBet : '0'}
         </div>
         <div style={{marginBottom: '8px'}}>
       {maxBet !== null ? maxBet : '0'}
         </div>
         <div>
         {totalTaps !== null ? totalTaps : '0'}
         </div>
        </div> */}
     
    </div>
    <div style={{display: 'flex', justifyContent:'center'}}>
    <div className='isWinner' onClick={() => setIsEnd('dis')}>
    {textWin}
    </div>
    
    </div>
    
    </div>
             
              {/* handleDecreaseBalance */}
           <div style={{width: '100%' , display: 'flex', justifyContent: 'center', zIndex: '6'}}>
           <div className={`Card ${actTime}`}>
             <div>
             <div style={{fontSize: '40px'}}>
             START
              </div> 
              <div style={{textAlign: 'center', fontSize: '60px'}}>
              {timerColl !== null ? timerColl : '0'}
              </div>
               
             </div>
             
        {/* <ul> {lastBetter?.slice(0,10) }
          
        </ul>  */}
      </div>
           </div>
           {/* <div onClick={() => setIsEnd('act')}> 
             vdvd
           </div> */}
     
    </div>
   
          </div> 
           
              )

        case '0':
          return (  
           
            <div className='scroller'>
            <div className='Container'>
            
          {/* <TonConnectButton /> */}
          


          <div className='mainProfile' > 

          <div className='iconProf'>
                {accountName?.slice(0,1).toUpperCase()}
            </div> 
            <div className='profile'>
            {accountName?.slice(0,20)} 
            </div>
            <div className='balances' style={{marginRight:'8px'}}>
          
          <div className='BalanceValue oasToken'>{balance !== null ? balance.toString().slice(0,5) : '0'} </div> 
          <img src={tokenTon} alt="ton" className='tokenOasImg'/>
        
           </div>
           <div className='balances'>
         
           
        
          <div className='BalanceValue oasToken'>{balanceToken !== null ? balanceToken.toString() : '0' } </div> 
          <img src={tokenOas} alt="oas" className='tokenOasImgOas'/>
           </div>
          </div>
           

          


          
           
          </div>
            {/* <div onClick={checkTx}>
              vevrtb
            </div> */}
         

  {/* <TonConnectButton /> */}

          <div className='littleOas'  style={{marginTop: '50px'}}>
            
         
                  
            <div className='textLittleOas'>
                  <div className='playingNow '>
                    Playing Now {onlineCounts[0] + onlineCounts[1] + onlineCounts[2]}
                  </div>
                
                  <p className='textOasName'>
                Tap Combat 
                  </p>
                  <div className='bet'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                     </div>

                <div className='buttonGame5' onClick={() => handleSetPage(1)}>
                Join the Game
                </div>
             
                  
        
                 

                    {/* <div className={`buttonGame2 ${activeIcon === 'iconSwap2' ? 'active1' : ''} ${activeIcon && activeIcon !== 'iconSwap2' ? 'inactive1' : ''}`}>
                    Join for 0.005 OAS
                  </div> */}

                 

            </div>
            <div className={`qqqqqq ${inact === 'on' ? 'activ' : ''}`}>
            <div onClick={setIninact} className={`quested ${inact === 'on' ? 'activ' : ''}`} >
                ?
              </div>
            </div>
          
 
            <img src={menuStart} alt="" className="littleOasImage1"/>
           
            <div className="corner-1"></div>
           <div className="corner-2"></div>
          </div>

         
          <div onClick={setIninact} className={`popup1 ${activePop === 'activePop' ? 'activePop' : ''} ${activePop === 'closePop' ? 'inactivePop' : ''} ${inact === 'on' ? 'active' : 'inactivePop'}`}>

              </div>
            <div className={`popup ${activePop === 'activePop' ? 'activePop' : ''} ${activePop === 'closePop' ? 'inactivePop' : ''} `}>
            <div className='closeBtn' onClick={() => handlePopClick('closePop')}>
                  
                </div>
              <div className='popupin'>
              <img src={lampDay} className='lampDay' alt="" />
                
              </div>
                <div className='mainDaylyReward'>
                <span className='spanMaindayly'>Daily reward
                  </span>
                  
                </div>



                  <div className='MainBoxDaily' >
                  
    {days.map(({ day, reward }) => (
      <div
        key={day}
        className={
          Number(dayNumber) === day && Number(dayNew) === 1
            ? 'allDay'
            : Number(dayNumber) === day && Number(dayNew) === 0
            ? 'allDay1'
            : Number(dayNumber) > day
            ? 'allDay'
            : 'allDay2'
        }
        
        onClick={newDayQuest}
      >
        <div style={{ marginTop: "9px", marginBottom: "5px", fontSize: "12px", fontWeight: "700" }}>
          Day {day}
        </div>
        <div>
          <img src={tokenOas} style={{ width: "24px", height: "24px" }} alt="" />
        </div>
        <div style={{ marginTop: "1px", fontSize: "12px", fontWeight: "700" }}>
          +{reward}
        </div>
      </div>
      
      
    ))}                
                  
                 </div>
            </div>
          <div className="bottom-menu">    
            <div className='bottomMenuSize'>
            <ul>
        
          <li onClick={() => handleSetPage(2)} style={{width: '110%'}}>
            <img src={quests1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Quests</span>
          </li>
          
          <li onClick={() => handleSetPage(3)} style={{width: '110%'}}> 
          <img src={referal1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Referal</span>
          </li>
          <li className='mainsapn' onClick={() => handleSetPage(1)} style={{position: 'relative', top: '-15px', width: '110%'}}>
            <img src={main} className='bottomMenuImg mainimg' alt="image" />
            <br></br>
            <span style={{color: "white", fontSize: "12px"}} >Main</span>
          </li>
          <li onClick={() => handleSetPage(4)} style={{width: '110%'}}>
            <img src={leaderboard1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Leaderboard</span>
          </li>
          <li onClick={() => handleSetPage(5)} style={{width: '110%'}}>
            <img src={profile1} className='bottomMenuImg' alt="image" />
            <br></br>
            <span style={{color: "rgba(72, 72, 107, 1)", fontSize: "12px"}}>Profile</span>
          </li>
      </ul>
            </div>
      
      </div> 
          
          
            </div>
    
        );
      }
    }
      return (
        <div className={`App ${activePop === 'activePop' ? 'activePop' : ''} ${activePop === 'closePop' ? 'inactivePop' : ''}`}>
             
          {isLoading ? (
            <div className='loading'>
              
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>Better Luck</div>
                
              <div>
                <img src={starting2} style={{width: '297px', height: '297px', margin: '50px auto', display: 'flex'}} alt="" />
              </div>
              <div style={{fontSize: '14px', textAlign: 'center'}}>
              loading...
                </div>                
              </div> // Показываем загрузочный экран
          ) : (
            renderContent() // Показываем контент страницы
          )}
        </div>
      );
    
}

export default App;