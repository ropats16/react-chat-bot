// backend will run on port 8000
const PORT = 8000;
const express = require("express");
// cors helps facilitate accessing restricted domains
const cors = require("cors");
require("dotenv").config();

const app = express();

// initializing express and cors
//  express helps connect and pass values from frontend to backend
app.use(express.json());
app.use(cors());

// route will GET result
app.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      // sending role as well as message from frontend to openai
      messages: [
        {
          role: "user",
          content: req.body.message,
        },
      ],
      max_tokens: 100,
    }),
  };
  try {
    // makes a fetch request to the openai end-point with options
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    // error handling
    console.error(error);
  }
});

// initializing port
app.listen(PORT, () => console.log("Your server is running on PORT" + PORT));
