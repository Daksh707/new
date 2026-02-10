const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: process.env.OFFICIAL_EMAIL
  });
});




const getFibonacci = (n) => {
  if (n <= 0) return [];
  let fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib.slice(0, n);
};

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

const hcf = (arr) => arr.reduce((a, b) => gcd(a, b));

const lcm = (arr) => {
  const lcmTwo = (a, b) => (a * b) / gcd(a, b);
  return arr.reduce((a, b) => lcmTwo(a, b));
};




const getAIAnswer = async (question) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: question }] }]
  });

  return response.data.candidates[0].content.parts[0].text.split(" ")[0];
};




app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: process.env.OFFICIAL_EMAIL,
        error: "Invalid request structure"
      });
    }

    let data;

    if (body.fibonacci !== undefined) {
      if (!Number.isInteger(body.fibonacci)) throw "Invalid Fibonacci input";
      data = getFibonacci(body.fibonacci);

    } else if (body.prime) {
      if (!Array.isArray(body.prime)) throw "Invalid Prime input";
      data = body.prime.filter(isPrime);

    } else if (body.lcm) {
      data = lcm(body.lcm);

    } else if (body.hcf) {
      data = hcf(body.hcf);

    } else if (body.AI) {
      data = await getAIAnswer(body.AI);

    } else {
      throw "Invalid key";
    }

    res.status(200).json({
      is_success: true,
      official_email: process.env.OFFICIAL_EMAIL,
      data
    });

  } catch (err) {
    res.status(500).json({
      is_success: false,
      official_email: process.env.OFFICIAL_EMAIL,
      error: err.toString()
    });
  }
});



app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});



