import type { Locale } from "../i18n/locales";

export type PrayerKey = "bomdod" | "peshin" | "asr" | "shom" | "xufton";
export type Position = "qiyom" | "ruku";

export interface Prayer {
	nom: Record<Locale, string>;
	rakatSoni: number;
	ovozChiqarib: boolean;
}

export const prayers: Record<PrayerKey, Prayer> = {
	bomdod: {
		nom: { uz: "Bomdod", ru: "Фаджр", en: "Fajr" },
		rakatSoni: 2,
		ovozChiqarib: true,
	},
	peshin: {
		nom: { uz: "Peshin", ru: "Зухр", en: "Dhuhr" },
		rakatSoni: 4,
		ovozChiqarib: false,
	},
	asr: {
		nom: { uz: "Asr", ru: "Аср", en: "Asr" },
		rakatSoni: 4,
		ovozChiqarib: false,
	},
	shom: {
		nom: { uz: "Shom", ru: "Магриб", en: "Maghrib" },
		rakatSoni: 3,
		ovozChiqarib: true,
	},
	xufton: {
		nom: { uz: "Xufton", ru: "Иша", en: "Isha" },
		rakatSoni: 4,
		ovozChiqarib: true,
	},
};

export const prayerKeys: readonly PrayerKey[] = [
	"bomdod",
	"peshin",
	"asr",
	"shom",
	"xufton",
];

export function isPrayerKey(value: string): value is PrayerKey {
	return value in prayers;
}

export function isPosition(value: string): value is Position {
	return value === "qiyom" || value === "ruku";
}
