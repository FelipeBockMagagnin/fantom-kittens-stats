import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [trans, setTrans ] = useState([]);

  useEffect(() => {
    // axios.get('https://api.ftmscan.com/api?module=account&action=txlist&address=0xfd211f3b016a75bc8d73550ac5adc2f1cae780c0&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken').then(data =>{
    //   console.log(data.data.result.filter(x => x.isError != '1' && x.txreceipt_status == '1'));
    //   setTrans(data.data.result.filter(x => x.isError != '1' && x.txreceipt_status == '1'));
    // })

    axios.get('https://api.ftmscan.com/api?module=account&action=tokentx&address=0xc748e6de30222f4e9bc01812860ff005a82543e6&startblock=0&endblock=999999999&sort=desc&apikey=YourApiKeyToken').then(data =>{
      console.log(data.data.result);

      if(!data.data.result) return;

      setTrans(data.data.result);
    })
  }, [])

  return (
    <div className="App">
      Fantom kittens Stats
      {trans && trans.map(mint => {
        return <div>{new Date(mint.timeStamp * 1000).toLocaleDateString() + ' ' + new Date(mint.timeStamp * 1000).toLocaleTimeString() + ' - ' +  (100 *(mint.value/(1000000000000000000)/7.5)).toFixed(2) + ' ' + mint.tokenSymbol} </div>
      })}
    </div>
  );
}

export default App;
