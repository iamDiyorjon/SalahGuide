import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const MOBILE_TG_PLATFORMS = new Set(["android", "android_x", "ios"]);

const tg = window.Telegram?.WebApp;
if (tg) {
	tg.ready();
	tg.expand();
	// Fullscreen makes sense on phones (reclaims the chat header) but on
	// Telegram Desktop / Web it just stretches the WebApp window edge-to-edge
	// and leaves the form floating in a sea of whitespace.
	if (MOBILE_TG_PLATFORMS.has(tg.platform ?? "")) {
		try {
			tg.requestFullscreen?.();
		} catch {
			/* unsupported Telegram version */
		}
	}
	try {
		tg.disableVerticalSwipes?.();
	} catch {
		/* unsupported Telegram version */
	}
	document.documentElement.dataset.telegram = "true";
	document.documentElement.dataset.colorScheme = tg.colorScheme;

	// In fullscreen mode Telegram draws its header (close/menu) over the page.
	// env(safe-area-inset-*) only covers the device notch, so we mirror
	// Telegram's safeAreaInset + contentSafeAreaInset into CSS variables
	// and re-apply on every change event the WebApp emits.
	const syncInsets = () => {
		const root = document.documentElement;
		const sa = tg.safeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 };
		const csa = tg.contentSafeAreaInset ?? {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		};
		root.style.setProperty("--tg-safe-top", `${sa.top + csa.top}px`);
		root.style.setProperty("--tg-safe-bottom", `${sa.bottom + csa.bottom}px`);
		root.style.setProperty("--tg-safe-left", `${sa.left + csa.left}px`);
		root.style.setProperty("--tg-safe-right", `${sa.right + csa.right}px`);
	};
	syncInsets();
	for (const evt of [
		"safeAreaChanged",
		"contentSafeAreaChanged",
		"viewportChanged",
		"fullscreenChanged",
	]) {
		try {
			tg.onEvent?.(evt, syncInsets);
		} catch {
			/* unsupported event in this Telegram version */
		}
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
