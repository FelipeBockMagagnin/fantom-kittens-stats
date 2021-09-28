import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [trans, setTrans ] = useState([]);
  const [transPerDay, setTransPerDAy] = useState([]);

  useEffect(() => {
    // get all mint events
    // axios.get('https://api.ftmscan.com/api?module=account&action=txlist&address=0xfd211f3b016a75bc8d73550ac5adc2f1cae780c0&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken').then(data =>{
    //   console.log(data.data.result.filter(x => x.isError != '1' && x.txreceipt_status == '1'));
    //   setTrans(data.data.result.filter(x => x.isError != '1' && x.txreceipt_status == '1'));
    // })

    //Get all tranx from royalties adress
    axios.get('https://api.ftmscan.com/api?module=account&action=tokentx&address=0xc748e6de30222f4e9bc01812860ff005a82543e6&startblock=0&endblock=999999999&sort=desc&apikey=4U6J2QNXT1YWESGVETQJZ86YT2MP4MUG2M').then(data =>{
      console.log(data.data.result);
      setTrans(data.data.result);
    })
  }, [])

  return (
    <div className="App">
      Fantom kittens Stats
      {trans && trans.map(mint => {
        return <div>{timeStampToDate(mint.timeStamp) + ' - ' +  royaltiesToFullValue(mint.value, mint.tokenDecimal) + ' ' + mint.tokenSymbol} </div>
      })}


      <br/>

      Transactions per day
      {trans && trans.map(mint => {
        return <div>{timeStampToDate(mint.timeStamp) + ' - ' +  royaltiesToFullValue(mint.value, mint.tokenDecimal) + ' ' + mint.tokenSymbol} </div>
      })}
    </div>
  );
}

function timeStampToDate(timestamp){
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

function royaltiesToFullValue(royalties, decimals){
  let value = royalties / Math.pow(10, decimals);
  value = (100 * value) / 7.5;
  return value.toFixed(2);
}

export default App;
