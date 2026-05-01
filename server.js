const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const API_KEY = "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"; // 🔴 paste here

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto", // FREE model
        messages: [
          { role: "system", content: "You are a safe and ethical AI assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log(data); // debug

    if (data.error) {
  console.log("API ERROR:", data.error.message);

  return res.json({
    reply: "⚠️ AI service error: " + data.error.message
    });
    }

    if (!data.choices || !data.choices.length) {
      return res.json({
        reply: "⚠️ No response from AI."
      });
    }

    res.json({
      reply: data.choices[0].message.content
    });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error." });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});