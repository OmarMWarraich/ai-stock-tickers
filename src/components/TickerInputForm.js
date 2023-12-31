import React, { useState } from 'react';
import { fetchStockData } from '../api';

const TickerInputForm = () => {
  const [ticker, setTicker] = useState('');
  const [displayArr, setDisplayArr] = useState([]);

  const handleInputChange = (event) => {
    setTicker(event.target.value.toUpperCase());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisplayArr((prevArr) => [...prevArr, ticker]);
    setTicker('');
  };

  const handleGenerateReport = () => {
    fetchStockData(displayArr);
  }

  return (
    <div className="ticker-input-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="ticker-input">
          Add up to three stock tickers to get a super accurate stock predictions report
        </label>
        <br />
        <div className="form-input-control">
          <input
            type="text"
            id="ticker-input"
            placeholder="MSFT"
            value={ticker}
            onChange={handleInputChange}
          />
          <button type="submit">+</button>
        </div>
      </form>
      <p>{displayArr.map((item, index) => <span key={index}>{item} </span>)}</p>
      <button
        type="submit"
        onClick={handleGenerateReport}
      >
        Generate Report
      </button>
    </div>
  );
};

export default TickerInputForm;
