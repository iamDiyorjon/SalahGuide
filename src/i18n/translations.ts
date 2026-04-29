import type { Locale } from "./locales";

export interface Translations {
	app: {
		title: string;
		subtitle: string;
		footer: string;
	};
	form: {
		sectionTitle: string;
		prayerLabel: string;
		prayerPlaceholder: string;
		rakatLabel: string;
		rakatPlaceholder: string;
		rakatOption: (n: number) => string;
		positionLabel: string;
		positionQiyom: string;
		positionRuku: string;
		reset: string;
		prayerOption: (name: string, count: number) => string;
	};
	result: {
		heading: string;
		summary: (
			prayerName: string,
			joinedRakat: number,
			position: string,
		) => string;
		imamSummary: (withImam: number, remaining: number) => string;
		complete: {
			title: string;
			body1: string;
			body2: string;
		};
		makeup: {
			heading: (n: number) => string;
			rakatLabel: (n: number) => string;
			qiroatLabel: string;
			tashahhud: string;
			notesTitle: string;
			notes: readonly string[];
		};
		qiroat: {
			F_S: string;
			F_S_AUDIBLE: string;
			F_ONLY: string;
		};
	};
}

const uz: Translations = {
	app: {
		title: "Namozga Kech Qo'shilganlar Uchun Yo'riqnoma",
		subtitle:
			"Namozga kech qo'shilganingizdan keyin qanday davom etishni bilib oling",
		footer: "Alloh taolo namozimizni qabul qilsin!",
	},
	form: {
		sectionTitle: "Tanlovlar",
		prayerLabel: "Namoz turini tanlang:",
		prayerPlaceholder: "Namoz turini tanlang...",
		rakatLabel: "Qaysi rakatda qo'shildingiz?",
		rakatPlaceholder: "Rakatni tanlang...",
		rakatOption: (n) => `${n}-rakat`,
		positionLabel: "Qaysi holatda qo'shildingiz?",
		positionQiyom: "Rukudan oldin qo'shildim",
		positionRuku: "Rukudan keyin qo'shildim",
		reset: "Qaytadan",
		prayerOption: (name, count) => `${name} namozi (${count} rakat)`,
	},
	result: {
		heading: "Sizning Yo'riqnomangiz",
		summary: (name, rakat, pos) => `${name} namozi: ${rakat}-rakatda ${pos}`,
		imamSummary: (w, r) => `Imom bilan: ${w} rakat — qoladi: ${r} rakat`,
		complete: {
			title: "Tabriklaymiz!",
			body1: "Siz imom bilan barcha rakatlarni o'qib bo'lgansiz",
			body2:
				"Imom salom berganidan keyin boshqa hech narsa qilishingiz shart emas",
		},
		makeup: {
			heading: (n) =>
				`Imom salom berganidan keyin ${n} rakat o'qishingiz kerak:`,
			rakatLabel: (n) => `${n}-rakat:`,
			qiroatLabel: "Qiroat:",
			tashahhud: "Tashahhud o'qib o'tiring",
			notesTitle: "Eslatma:",
			notes: [
				"Barcha rakatlarni yakunlaganingizdan keyin tashahhud va salom bering",
				"Agar shubhangiz bo'lsa, namozni qaytadan o'qing",
				"Doimo Alloh taoloning roziligi uchun namoz o'qing",
			],
		},
		qiroat: {
			F_S: "Fotiha + Sura",
			F_S_AUDIBLE: "Fotiha + Sura (ovoz chiqarib)",
			F_ONLY: "Faqat Fotiha",
		},
	},
};

const ru: Translations = {
	app: {
		title: "Руководство для опоздавших на намаз",
		subtitle:
			"Узнайте, как правильно завершить намаз, если вы присоединились с опозданием",
		footer: "Да примет Аллах наш намаз!",
	},
	form: {
		sectionTitle: "Параметры",
		prayerLabel: "Выберите намаз:",
		prayerPlaceholder: "Выберите намаз...",
		rakatLabel: "На каком ракаате вы присоединились?",
		rakatPlaceholder: "Выберите ракаат...",
		rakatOption: (n) => `${n}-й ракаат`,
		positionLabel: "В каком положении вы присоединились?",
		positionQiyom: "Присоединился до руку",
		positionRuku: "Присоединился после руку",
		reset: "Сбросить",
		prayerOption: (name, count) => `${name} (${count} ракаата)`,
	},
	result: {
		heading: "Ваше руководство",
		summary: (name, rakat, pos) =>
			`${name}: ${rakat}-й ракаат, ${pos.toLowerCase()}`,
		imamSummary: (w, r) => `С имамом: ${w} ракаат — осталось: ${r} ракаат`,
		complete: {
			title: "Поздравляем!",
			body1: "Вы прочитали все ракааты с имамом",
			body2: "После приветствия имама вам ничего больше делать не нужно",
		},
		makeup: {
			heading: (n) =>
				`После приветствия имама вам нужно прочитать ${n} ракаат:`,
			rakatLabel: (n) => `${n}-й ракаат:`,
			qiroatLabel: "Чтение:",
			tashahhud: "Сядьте и прочитайте ташаххуд",
			notesTitle: "Примечание:",
			notes: [
				"После завершения всех ракаатов прочитайте ташаххуд и сделайте таслим",
				"Если у вас есть сомнения, прочитайте намаз заново",
				"Всегда совершайте намаз ради довольства Аллаха",
			],
		},
		qiroat: {
			F_S: "Фатиха + сура",
			F_S_AUDIBLE: "Фатиха + сура (вслух)",
			F_ONLY: "Только Фатиха",
		},
	},
};

const en: Translations = {
	app: {
		title: "Late-Joiner's Prayer Guide",
		subtitle:
			"Find out how to complete your prayer correctly when you join the congregation late",
		footer: "May Allah accept our prayers!",
	},
	form: {
		sectionTitle: "Selections",
		prayerLabel: "Choose the prayer:",
		prayerPlaceholder: "Choose a prayer...",
		rakatLabel: "Which rakat did you join?",
		rakatPlaceholder: "Choose a rakat...",
		rakatOption: (n) => `Rakat ${n}`,
		positionLabel: "Which position when you joined?",
		positionQiyom: "Joined before Ruku",
		positionRuku: "Joined after Ruku",
		reset: "Reset",
		prayerOption: (name, count) => `${name} (${count} rakats)`,
	},
	result: {
		heading: "Your Guide",
		summary: (name, rakat, pos) =>
			`${name}: rakat ${rakat}, ${pos.toLowerCase()}`,
		imamSummary: (w, r) => `With imam: ${w} rakats — remaining: ${r} rakats`,
		complete: {
			title: "Congratulations!",
			body1: "You completed all rakats with the imam",
			body2: "Nothing more to do after the imam's salam",
		},
		makeup: {
			heading: (n) => `After the imam's salam, you need to pray ${n} rakats:`,
			rakatLabel: (n) => `Rakat ${n}:`,
			qiroatLabel: "Recitation:",
			tashahhud: "Sit and recite Tashahhud",
			notesTitle: "Notes:",
			notes: [
				"After finishing all rakats, recite Tashahhud and give Salam",
				"If you are unsure, repeat the prayer",
				"Always pray seeking the pleasure of Allah",
			],
		},
		qiroat: {
			F_S: "Fatiha + Sura",
			F_S_AUDIBLE: "Fatiha + Sura (audibly)",
			F_ONLY: "Fatiha only",
		},
	},
};

export const translations: Record<Locale, Translations> = { uz, ru, en };
