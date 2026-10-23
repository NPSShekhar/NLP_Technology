import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { loadRecaptcha } from "./lib/recaptcha";

// Load the badge early; create fresh action tokens only on submission.
loadRecaptcha().catch(error => console.error(error.message));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);