import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [symbol, setSymbol] = useState("");
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState("");
  const [symbols, setSymbols] = useState([]);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchSymbols = async () => {
      const API_URL = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`;
      try {
        const response = await axios.get(API_URL);
        const allSymbols = response.data.map(item => item.symbol);
        setSymbols(allSymbols);
      } catch (error) {
        setError("Failed to fetch stock symbols.");
        console.error("Error fetching symbols:", error);
      }
    };
    fetchSymbols();
  }, [API_KEY]);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSymbol(value);

    if (value === "" || symbols.includes(value)) {
      setError("");
      setStockPrice(null);
    } else {
      setError("Stock symbol not found or invalid.");
      setStockPrice(null);
    }
  };

  const fetchStockPrice = async () => {
    if (!symbol) {
      setError("Please enter a stock symbol.");
      return;
    }
    
    if (!symbols.includes(symbol)) {
      setError("Stock symbol not found.");
      setStockPrice(null);
      return;
    }

    const API_URL = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
    try {
      const response = await axios.get(API_URL);
      setStockPrice(response.data.c);
      setError("");
    } catch (error) {
      setError("Failed to fetch stock price.");
      setStockPrice(null);
      console.error("Error fetching stock price:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={4} p={3} border={1} borderRadius={4}>
        <Typography variant="h4" gutterBottom>
          Stock Price Checker
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          value={symbol}
          onChange={handleInputChange}
          placeholder="Enter Stock Symbol (e.g., AAPL)"
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchStockPrice}
          className="mt-2"
        >
          Get Stock Price
        </Button>
        {stockPrice !== null && (
          <Typography variant="h5" color="success" className="mt-3">
            Current Price: ${stockPrice}
          </Typography>
        )}
        {error && (
          <Alert severity="error" className="mt-3">
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default App;
