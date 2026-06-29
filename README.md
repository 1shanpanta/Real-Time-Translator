# Real-Time Translator

A mobile app that translates **Japanese to English as you type**. Enter Japanese text and the translation appears live, with hiragana readings provided in parentheses for any kanji.

Built with React Native (Expo) on the front end and a small Express backend that calls the Groq API (Llama 3) for fast, streaming-speed translations.

## How it works

```
React Native app  ──debounced POST (text)──>  Express backend on Vercel  ──>  Groq API (llama3-8b-8192)
       ▲                                                                              │
       └───────────────────────  { translation }  ◀──────────────────────────────────┘
```

- Input is **debounced (500ms)** so it translates as you pause typing, not on every keystroke.
- The backend prompts the model to translate Japanese to English and to add the **hiragana reading in parentheses** whenever the text contains kanji.

## Tech

- **App:** React Native + Expo, `axios`, `lodash.debounce`
- **Backend:** Express + `cors`, deployed on Vercel
- **Translation:** Groq API, `llama3-8b-8192` model

## Run locally

### Backend
```bash
cd backend
npm install
export GROQ_API_KEY=your_groq_api_key   # get one at console.groq.com
node index.js                            # serves POST /translate on :3000
```

### App
```bash
npm install
npx expo start                           # then open in Expo Go, an emulator, or the web
```

Point the app at your backend by setting `BACKEND_URL` in `App.js` (defaults to the deployed Vercel URL).

## Notes

- A `GROQ_API_KEY` is required for the backend; it is read from the environment and never committed.
- The translation model and prompt live in `backend/index.js`, so swapping models or tweaking the prompt is a one-line change.
