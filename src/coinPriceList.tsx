import React, { useState, useEffect } from "react";

interface Cryptocurrency {
  name: string;
  symbol: string;
  price: number;
  change: number;
}

const App1 = () => {
  const [cryptocurrencies1h, setCryptocurrencies1h] = useState<Cryptocurrency[]>([]);
  const [cryptocurrencies24h, setCryptocurrencies24h] = useState<Cryptocurrency[]>([]);
  const [notification, setNotification] = useState(false);

  const fetchCryptocurrencies = async (timePeriod: string) => {
    const response = await fetch(
      `https://api.coinranking.com/v2/coins?timePeriod=${timePeriod}&orderBy=change&x-access-token=coinrankinge1eb4ccabd91750f39bfcba9fd576003782276bbd78d9a39`
    );
    const responseJson = await response.json();
    const data = responseJson["data"];
    const coins = data["coins"];
    if (timePeriod === "1h") {
      setCryptocurrencies1h(coins);
      checkNotification(coins);
    }else{
      setCryptocurrencies24h(coins);
    }
  };

  const checkNotification = (coins: Cryptocurrency[]) => {
    let shouldNotify = false;
    coins.forEach((coin) => {
      if (coin.change > 5) {
        shouldNotify = true;
        setNotification(true);
        showNotification(coin);
      }
    });
  };

  const showNotification = (coin: Cryptocurrency) => {
    if (Notification.permission === "granted") {
      new Notification("Price alert", {
        body: `Price of ${coin.name} (${coin.symbol}) has increased by over 5% in the last hour! Current price: ${coin.price}`,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Price alert", {
            body: `Price of ${coin.name} (${coin.symbol}) has increased by over 10% in the last hour! Current price: ${coin.price}`,
          });
        }
      });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => fetchCryptocurrencies("1h"), 60000); // 60000 milliseconds = 1 minute
    return () => clearInterval(intervalId);
  }, []);

  const handleChangeTimePeriod = async (timePeriod: string) => {
    fetchCryptocurrencies(timePeriod);
  };

  return (
    <div>
      <h1>Cryptocurrencies</h1>
      <h2>1 Hour Time Period</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {cryptocurrencies1h.map((cryptocurrency, index) => (
            <tr key={index}>
              <td>{cryptocurrency.name}</td>
              <td>{cryptocurrency.symbol}</td>
              <td>{cryptocurrency.price}</td>
              <td>{cryptocurrency.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleChangeTimePeriod("1h")}>Fetch Cryptocurrencies 1h</button>

      <h2>24 Hour Time Period</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {cryptocurrencies24h.map((cryptocurrency, index) => (
            <tr key={index}>
              <td>{cryptocurrency.name}</td>
              <td>{cryptocurrency.symbol}</td>
              <td>{cryptocurrency.price}</td>
              <td>{cryptocurrency.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleChangeTimePeriod("24h")}>Fetch Cryptocurrencies 24h</button>

    </div>
  );
};

export default App1;
