import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Eres un tutor de idiomas paciente y motivador." },
          { role: "user", content: message }
        ]
      })
    });
    const data = await r.json();
    res.json({ reply: data.choices?.[0]?.message?.content ?? "Sin respuesta" });
  } catch (e) {
    res.status(500).json({ error: "Error IA" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log("Server on", PORT));