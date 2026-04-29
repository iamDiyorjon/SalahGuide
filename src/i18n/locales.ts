export const SUPPORTED_LOCALES = ["uz", "ru", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uz";

export function isLocale(value: string): value is Locale {
	return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
	uz: "O'zbekcha",
	ru: "Русский",
	en: "English",
};

export const localeShortLabels: Record<Locale, string> = {
	uz: "UZ",
	ru: "RU",
	en: "EN",
};
