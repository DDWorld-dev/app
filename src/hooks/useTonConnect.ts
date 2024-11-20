import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

import { THEME } from '@tonconnect/ui';


interface UseTonConnectResult {
  sender: Sender;
  connected: boolean;
  sended: boolean | null;
  sended1: boolean;
  setSend: () => void;
  setSendS: (val: boolean) => void;
}


export function useTonConnect(): UseTonConnectResult {
  const [tonConnectUI] = useTonConnectUI();
  const [sendTx, setSendTx] = useState<boolean | null>(null);
  const [sendTxS, setSendTxS] = useState<boolean>(false);
  const setSend = () => {
    
    
    setSendTx(null);
    
  }
  const setSendS = (val: boolean) =>{
   
    setSendTxS(val)
  }
  tonConnectUI.uiOptions = {
    uiPreferences: {
        theme: THEME.DARK,
        borderRadius: 'm',
        colorsSet: {
            [THEME.DARK]: {
                connectButton: {
                    background: 'white',
                    foreground: 'black'
                    
                },
                background: {
                  primary: 'white'  
                },
                icon: {
                  primary: 'red'
                },
                text: {
                  primary: 'black',
                  secondary: 'black'
                }
              

            }
           
        }
    }
};

  const sendTransaction = async (args: SenderArguments) => {
    
    setSendTx(null);
   
    try {
      const result = await tonConnectUI.sendTransaction(
        {
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000,
        },
        {
          modals: ['before'],
          notifications: ['before', 'success', 'error'],
        }
      );
      
      console.log('Transaction sent successfully', result.boc);
      setSendTxS(true);
      setSendTx(true)
       
    } catch (e) {
      // const error = e as Error;
      // if (error.message.includes('Transaction was rejected')) {
      //   console.error('Transaction was rejected:', error);
        setSendTx(false);
      // } else if (error.message.includes('Transaction was not sent')) {
      //   console.error('Tpuss:',);
      //   setSendTx(false);
      // } else {
      //   setSendTx(false);
      //   console.error('An unexpected error occurred:', error);
        
      // }
    }
  };

  // useEffect(() => {
  //   if (!sendTx) {
  //     const timer = setTimeout(() => {
  //       setSendTx(true);
  //     }, 10); // Adjust the delay as needed

  //     return () => clearTimeout(timer);
  //   }
  // }, [sendTx]);

  return {
    sender: {
      send: sendTransaction,
    },
    connected: tonConnectUI.connected,
    sended: sendTx,
    sended1: sendTxS,
    setSend,
    setSendS
  };
}
