import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Line } from "react-chartjs-2";

function App() {
  const [chartSold, setChartSold] = useState({});
  const [chartVolume, setChartVolume] = useState({});
  const [chartVolumeFTM, setChartVolumeFTM] = useState({});
  const [chartVolumeFTMDaily, setChartVolumeFTMDaily] = useState({});
  const [fantomPrice, setFantomPrice] = useState("");
  const [brushPrice, setBrushPrice] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=paint-swap%2Cfantom&vs_currencies=usd"
      )
      .then((coins) => {
        setBrushPrice(coins.data["paint-swap"].usd);
        setFantomPrice(coins.data.fantom.usd);

        //Get all tranx from royalties adress
        axios
          .get(
            "https://api.ftmscan.com/api?module=account&action=tokentx&address=0xc748e6de30222f4e9bc01812860ff005a82543e6&startblock=0&endblock=999999999&sort=desc&apikey=4U6J2QNXT1YWESGVETQJZ86YT2MP4MUG2M"
          )
          .then((data) => {
            kittenSoldDayChart(data.data.result);
            kittenVolumeChart(data.data.result, coins.data);
            kittenVolumeChartFTM(data.data.result, coins.data);
            kittenVolumeChartFTMDaily(data.data.result, coins.data);
          });
      });
  }, []);

  function kittenSoldDayChart(data) {
    const DAY_RANGE = 15;

    let days = [];
    let dataset = [];

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - DAY_RANGE);

    for (let i = 0; i <= DAY_RANGE; i++) {
      days.push(new Date(currentDate).toLocaleDateString());

      dataset.push(
        data.filter((x) => {
          return (
            new Date(x.timeStamp * 1000).toLocaleDateString() ===
            currentDate.toLocaleDateString()
          );
        }).length
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const chartData = {
      labels: days,
      datasets: [
        {
          label: "Transactions",
          data: dataset,
          borderColor: "red",
          backgroundColor: "white",
          yAxisID: "y",
        },
      ],
    };

    setChartSold(chartData);
  }

  function kittenVolumeChart(data, coins) {
    const DAY_RANGE = 15;

    let days = [];
    let dataset = [];

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - DAY_RANGE);

    var totalPrice = 0;

    for (let i = 0; i <= DAY_RANGE; i++) {
      days.push(new Date(currentDate).toLocaleDateString());

      const currentData = data.filter((x) => {
        return (
          new Date(x.timeStamp * 1000).toLocaleDateString() ===
          currentDate.toLocaleDateString()
        );
      });

      if (currentData) {
        currentData.forEach((element) => {
          switch (element.tokenSymbol) {
            case "WFTM":
              totalPrice +=
                parseFloat(
                  royaltiesToFullValue(element.value, element.tokenDecimal)
                ) * coins["fantom"].usd;
              break;

            case "BRUSH":
              totalPrice +=
                parseFloat(
                  royaltiesToFullValue(element.value, element.tokenDecimal)
                ) * coins["paint-swap"].usd;
              break;

            case "USDC":
              totalPrice += parseFloat(
                royaltiesToFullValue(element.value, element.tokenDecimal)
              );
              break;
            default:
              break;
          }
        });
      }

      dataset.push(totalPrice);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const chartData = {
      labels: days,
      datasets: [
        {
          label: "USDC",
          data: dataset,
          borderColor: "green",
          backgroundColor: "white",
          yAxisID: "y",
        },
      ],
    };

    setChartVolume(chartData);
  }

  function kittenVolumeChartFTM(data, coins) {
    const DAY_RANGE = 15;

    let days = [];
    let dataset = [];

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - DAY_RANGE);

    var totalPrice = 0;

    for (let i = 0; i <= DAY_RANGE; i++) {
      days.push(new Date(currentDate).toLocaleDateString());

      const currentData = data.filter((x) => {
        return (
          new Date(x.timeStamp * 1000).toLocaleDateString() ===
          currentDate.toLocaleDateString()
        );
      });

      if (currentData) {
        currentData.forEach((element) => {
          switch (element.tokenSymbol) {
            case "WFTM":
              totalPrice += parseFloat(
                royaltiesToFullValue(element.value, element.tokenDecimal)
              );
              break;

            case "BRUSH":
              totalPrice +=
                (parseFloat(
                  royaltiesToFullValue(element.value, element.tokenDecimal)
                ) *
                  coins["paint-swap"].usd) /
                coins["fantom"].usd;
              break;

            case "USDC":
              totalPrice +=
                parseFloat(
                  royaltiesToFullValue(element.value, element.tokenDecimal)
                ) / coins["fantom"].usd;
              break;
            default:
              break;
          }
        });
      }

      dataset.push(totalPrice);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const chartData = {
      labels: days,
      datasets: [
        {
          label: "FTM",
          data: dataset,
          borderColor: "blue",
          backgroundColor: "white",
          yAxisID: "y",
        },
      ],
    };

    setChartVolumeFTM(chartData);
  }

  function kittenVolumeChartFTMDaily(data, coins) {
    const DAY_RANGE = 15;

    let days = [];
    let dataset = [];

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - DAY_RANGE);

    var totalPrice = 0;

    for (let i = 0; i <= DAY_RANGE; i++) {
      totalPrice = 0;
      days.push(new Date(currentDate).toLocaleDateString());

      const currentData = data.filter((x) => {
        return (
          new Date(x.timeStamp * 1000).toLocaleDateString() ===
          currentDate.toLocaleDateString()
        );
      });

      if (currentData) {
        currentData.forEach((element) => {
          switch (element.tokenSymbol) {
            case "WFTM":
              totalPrice += parseFloat(
                royaltiesToFullValue(element.value, element.tokenDecimal)
              );
              break;

            case "BRUSH":
              totalPrice +=
                (parseFloat(
                  royaltiesToFullValue(element.value, element.tokenDecimal)
                ) *
                  coins["paint-swap"].usd) /
                coins["fantom"].usd;
              break;

            case "USDC":
              totalPrice +=
                parseFloat(
                  royaltiesToFullValue(element.value, element.tokenDecimal)
                ) / coins["fantom"].usd;
              break;
            default:
              break;
          }
        });
      }

      dataset.push(totalPrice);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const chartData = {
      labels: days,
      datasets: [
        {
          label: "FTM",
          data: dataset,
          borderColor: "blue",
          backgroundColor: "white",
          yAxisID: "y",
        },
      ],
    };

    setChartVolumeFTMDaily(chartData);
  }

  return (
    <div className="App">
      <h1>Fantom kittens Stats</h1>

      <div className="graphs">
        {chartSold && (
          <div className="graph-container">
            <p style={{ fontWeight: 700, fontSize: 20, margin: 5 }}>
              Kittens sold per day
            </p>
            <Line data={chartSold} height="100px" />
          </div>
        )}

        {chartVolume && (
          <div className="graph-container">
            <p style={{ fontWeight: 700, fontSize: 20, margin: 5 }}>
              Total Volume (USDC)
            </p>
            <Line data={chartVolume} height="100px" />
          </div>
        )}

        {chartVolumeFTMDaily && (
          <div className="graph-container">
            <p style={{ fontWeight: 700, fontSize: 20, margin: 5 }}>
              Volume per day (FTM)
            </p>
            <Line data={chartVolumeFTMDaily} height="100px" />
          </div>
        )}

        {chartVolumeFTM && (
          <div className="graph-container">
            <p style={{ fontWeight: 700, fontSize: 20, margin: 5 }}>
              Total Volume (FTM)
            </p>
            <Line data={chartVolumeFTM} height="100px" />
          </div>
        )}
      </div>

      <div className="prices">
        Fantom: ${fantomPrice}
        <br />
        Brush: ${brushPrice}
      </div>
    </div>
  );
}

function timeStampToDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

function royaltiesToFullValue(royalties, decimals) {
  let value = royalties / Math.pow(10, decimals);
  value = (100 * value) / 7.5;
  return value.toFixed(2);
}

export default App;
