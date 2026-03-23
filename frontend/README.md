# Actio AI Frontend

React + Vite frontend for the Actio AI support bot.

## What it does

- Auth flow for login and signup
- Chat UI with persistent conversations
- Sidebar for loading and deleting previous chats
- Agent-style commands for actions like rename, delete, export, and settings
- Settings page for profile updates, password changes, clearing chats, and account deletion
- Markdown rendering for bot responses
- Export chat as `.txt` or `.pdf`

## Stack

- React 19
- Vite
- Axios
- React Markdown
- React Router DOM
- jsPDF

## Project structure

```text
src/
  App.jsx
  App.css
  main.jsx
  index.css
  components/
    ChatSidebar.jsx
  pages/
    Login.jsx
    Signup.jsx
    Settings.jsx
```

## Development

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The app expects the backend API to be running at `http://localhost:5000`.

## Notes

- Axios is configured in `src/main.jsx` with a global `baseURL` and JWT request interceptor.
- The main application flow currently lives mostly in `src/App.jsx`.
