import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function App() {
  const [chart, setChart] = useState({})

  useEffect(() => {
    //Get all tranx from royalties adress
    axios.get('https://api.ftmscan.com/api?module=account&action=tokentx&address=0xc748e6de30222f4e9bc01812860ff005a82543e6&startblock=0&endblock=999999999&sort=desc&apikey=4U6J2QNXT1YWESGVETQJZ86YT2MP4MUG2M').then(data => {
      kittenSoldDayChart(data.data.result);
    })
  }, [])

  function kittenSoldDayChart(data){
    const DAY_RANGE = 15;

    let days = [];
    let dataset = []

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - DAY_RANGE);

    for (let i = 0; i <= DAY_RANGE; i++) {
      days.push(new Date(currentDate).toLocaleDateString());

      dataset.push(data.filter(x => {
        console.log(new Date(x.timeStamp * 1000).toLocaleDateString(), currentDate.toLocaleDateString(), new Date(x.timeStamp * 1000).toLocaleDateString() == currentDate.toLocaleDateString());
        return new Date(x.timeStamp * 1000).toLocaleDateString() === currentDate.toLocaleDateString();
      }).length)

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const chartData = {
      labels: days,
      datasets: [
        {
          label: 'Transactions',
          data: dataset,
          borderColor: 'red',
          backgroundColor: 'white',
          yAxisID: 'y',
        }
      ]
    };

    setChart(chartData);
  }

  return (
    <div className="App">
      <div className='header'>
        Fantom kittens Stats
      </div>
      <br />

      {
        chart && <div className='graph-container'>
          <p style={{fontWeight: 700, fontSize: 20, margin: 5}}>Kittens sold per day</p>
          <Line data={chart} />
        </div>
      }
    </div>
  );
}

function timeStampToDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

function royaltiesToFullValue(royalties, decimals) {
  let value = royalties / Math.pow(10, decimals);
  value = (100 * value) / 7.5;
  return value.toFixed(2);
}

export default App;
