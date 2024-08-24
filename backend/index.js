const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/translate', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        messages: [
          {
            role: 'user',
            content: `Translate the following Japanese text to English. If the text contains kanji, provide the hiragana reading in parentheses: "${text}"`,
          },
        ],
        model: 'llama3-8b-8192',
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ translation: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Error translating text.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
