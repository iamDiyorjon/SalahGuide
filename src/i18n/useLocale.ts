import { useCallback, useEffect, useState } from "react";
import {
	DEFAULT_LOCALE,
	type Locale,
	SUPPORTED_LOCALES,
	isLocale,
} from "./locales";
import { translations, type Translations } from "./translations";

const STORAGE_KEY = "salahguide.locale.v1";

function detectLocale(): Locale {
	if (typeof window === "undefined") return DEFAULT_LOCALE;

	try {
		const saved = window.localStorage.getItem(STORAGE_KEY);
		if (saved && isLocale(saved)) return saved;
	} catch {
		/* localStorage unavailable */
	}

	const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user as
		| { language_code?: string }
		| undefined;
	const tgCode = tgLang?.language_code?.slice(0, 2).toLowerCase();
	if (tgCode && isLocale(tgCode)) return tgCode;

	const navLang = window.navigator.language.slice(0, 2).toLowerCase();
	if (isLocale(navLang)) return navLang;

	return DEFAULT_LOCALE;
}

export function useLocale(): {
	locale: Locale;
	setLocale: (l: Locale) => void;
	t: Translations;
	supported: typeof SUPPORTED_LOCALES;
} {
	const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

	useEffect(() => {
		setLocaleState(detectLocale());
	}, []);

	const setLocale = useCallback((next: Locale) => {
		setLocaleState(next);
		try {
			window.localStorage.setItem(STORAGE_KEY, next);
		} catch {
			/* ignore */
		}
	}, []);

	useEffect(() => {
		document.documentElement.lang = locale;
	}, [locale]);

	return {
		locale,
		setLocale,
		t: translations[locale],
		supported: SUPPORTED_LOCALES,
	};
}
