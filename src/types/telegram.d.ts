export {};

declare global {
	interface TelegramSafeAreaInset {
		top: number;
		bottom: number;
		left: number;
		right: number;
	}

	interface TelegramWebApp {
		ready: () => void;
		expand: () => void;
		close: () => void;
		requestFullscreen?: () => void;
		disableVerticalSwipes?: () => void;
		colorScheme: "light" | "dark";
		platform?: string;
		themeParams: Record<string, string>;
		initData: string;
		initDataUnsafe: Record<string, unknown>;
		safeAreaInset?: TelegramSafeAreaInset;
		contentSafeAreaInset?: TelegramSafeAreaInset;
		onEvent?: (event: string, handler: () => void) => void;
		offEvent?: (event: string, handler: () => void) => void;
		MainButton?: {
			text: string;
			show: () => void;
			hide: () => void;
			onClick: (cb: () => void) => void;
			offClick: (cb: () => void) => void;
			setText: (text: string) => void;
		};
		HapticFeedback?: {
			impactOccurred: (style: "light" | "medium" | "heavy") => void;
			selectionChanged: () => void;
			notificationOccurred: (type: "success" | "warning" | "error") => void;
		};
	}

	interface Window {
		Telegram?: {
			WebApp?: TelegramWebApp;
		};
	}
}
