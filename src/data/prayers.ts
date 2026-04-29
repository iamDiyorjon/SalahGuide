export type PrayerKey = "bomdod" | "peshin" | "asr" | "shom" | "xufton";
export type Position = "qiyom" | "ruku";

export interface Prayer {
	nom: string;
	rakatSoni: number;
	ovozChiqarib: boolean;
}

export const prayers: Record<PrayerKey, Prayer> = {
	bomdod: { nom: "Bomdod", rakatSoni: 2, ovozChiqarib: true },
	peshin: { nom: "Peshin", rakatSoni: 4, ovozChiqarib: false },
	asr: { nom: "Asr", rakatSoni: 4, ovozChiqarib: false },
	shom: { nom: "Shom", rakatSoni: 3, ovozChiqarib: true },
	xufton: { nom: "Xufton", rakatSoni: 4, ovozChiqarib: true },
};

export const prayerKeys: readonly PrayerKey[] = [
	"bomdod",
	"peshin",
	"asr",
	"shom",
	"xufton",
];

export const positionLabels: Record<Position, string> = {
	qiyom: "Rukudan oldin qo'shildim",
	ruku: "Rukudan keyin qo'shildim",
};

export function isPrayerKey(value: string): value is PrayerKey {
	return value in prayers;
}

export function isPosition(value: string): value is Position {
	return value === "qiyom" || value === "ruku";
}
