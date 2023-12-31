import React, { useState } from 'react';
import { fetchStockData } from '../api';

const TickerInputForm = () => {
  const [ticker, setTicker] = useState('');
  const [displayArr, setDisplayArr] = useState([]);
  const [report, setReport] = useState(null);

  const handleInputChange = (event) => {
    setTicker(event.target.value.toUpperCase());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisplayArr((prevArr) => [...prevArr, ticker]);
    setTicker('');
  };

  const handleGenerateReport = () => {
    fetchStockData(displayArr)
      .then((result) => {
        setReport(result);
      })
      .catch((error) => {
        console.error('Error in handleGenerateReport:', error);
        // Handle the error, e.g., display an error message
      });
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
        className="generate-button"
        onClick={handleGenerateReport}
      >
        Generate Report
      </button>
      {report && <p>Report: {report}</p>}
    </div>
  );
};

export default TickerInputForm;
