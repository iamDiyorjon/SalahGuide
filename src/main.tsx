import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const tg = window.Telegram?.WebApp;
if (tg) {
	tg.ready();
	tg.expand();
	try {
		tg.requestFullscreen?.();
	} catch {
		/* unsupported Telegram version */
	}
	try {
		tg.disableVerticalSwipes?.();
	} catch {
		/* unsupported Telegram version */
	}
	document.documentElement.dataset.telegram = "true";
	document.documentElement.dataset.colorScheme = tg.colorScheme;
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
