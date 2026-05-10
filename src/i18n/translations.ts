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
		imomLabel: string;
		qoldiLabel: string;
		rakatUnit: string;
		complete: {
			title: string;
			body1: string;
			body2: string;
		};
		makeup: {
			heading: (n: number) => string;
			rakatLabel: (n: number) => string;
			qiroatLabel: string;
			tashahhudMiddle: string;
			tashahhudFinal: string;
			otirishLabel: string;
			yakunLabel: string;
			finalBadge: string;
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
		subtitle: "Qolgan rakatlarni hisoblab, namozingizni to'g'ri yakunlang",
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
		positionQiyom: "Ruku'dan oldin qo'shildim",
		positionRuku: "Ruku'dan keyin qo'shildim",
		reset: "Qaytadan",
		prayerOption: (name, count) => `${name} namozi (${count} rakat)`,
	},
	result: {
		heading: "Sizning Yo'riqnomangiz",
		summary: (name, rakat, pos) => `${name} namozi: ${rakat}-rakatda ${pos}`,
		imamSummary: (w, r) => `Imom bilan: ${w} rakat — qoladi: ${r} rakat`,
		imomLabel: "Imom bilan",
		qoldiLabel: "Sizdan qoladi",
		rakatUnit: "rakat",
		complete: {
			title: "Tabriklaymiz!",
			body1: "Siz imom bilan barcha rakatlarni o'qib bo'lgansiz",
			body2:
				"Imom salom berganidan keyin boshqa hech narsa qilishingiz shart emas",
		},
		makeup: {
			heading: (n) => `${n} rakat mustaqil o'qing`,
			rakatLabel: (n) => `${n}-rakat`,
			qiroatLabel: "Qiroat",
			tashahhudMiddle: "Tashahhud o'qiladi",
			tashahhudFinal: "Tashahhud, salavotlar va duo o'qib salom beriladi",
			otirishLabel: "O'tirish",
			yakunLabel: "Yakun",
			finalBadge: "yakuniy",
			notesTitle: "Eslatma",
			notes: [
				"Barcha rakatlarni yakunlaganingizdan keyin tashahhud, salavotlar va duo o'qib salom bering",
				"Agar rakatlar soni haqida shubha qilsangiz: bu ilk marta bo'lsa, namozni qaytadan o'qing; takror sodir bo'layotgan bo'lsa, gumoningizga ko'ra ado qiling",
				"Namozingizni Alloh roziligi uchun ado qiling!",
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
		positionQiyom: "Присоединился до руку'",
		positionRuku: "Присоединился после руку'",
		reset: "Сбросить",
		prayerOption: (name, count) => `${name} (${count} ракаата)`,
	},
	result: {
		heading: "Ваше руководство",
		summary: (name, rakat, pos) =>
			`${name}: ${rakat}-й ракаат, ${pos.toLowerCase()}`,
		imamSummary: (w, r) => `С имамом: ${w} ракаат — осталось: ${r} ракаат`,
		imomLabel: "С имамом",
		qoldiLabel: "Осталось",
		rakatUnit: "ракаат",
		complete: {
			title: "Поздравляем!",
			body1: "Вы прочитали все ракааты с имамом",
			body2: "После приветствия имама вам ничего больше делать не нужно",
		},
		makeup: {
			heading: (n) => `Прочитайте ${n} ракаат самостоятельно`,
			rakatLabel: (n) => `${n}-й ракаат`,
			qiroatLabel: "Чтение",
			tashahhudMiddle: "Читается ташаххуд",
			tashahhudFinal: "Читаются ташаххуд, салаваты и дуа, затем даётся салам",
			otirishLabel: "Сидение",
			yakunLabel: "Завершение",
			finalBadge: "финал",
			notesTitle: "Примечание",
			notes: [
				"После завершения всех ракаатов прочитайте ташаххуд, салаваты и дуа, затем сделайте салам",
				"Если у вас сомнения в количестве ракаатов: если это впервые — повторите намаз; если такое уже бывало — следуйте своему предположению",
				"Совершайте намаз ради довольства Аллаха!",
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
		positionQiyom: "Joined before Ruku'",
		positionRuku: "Joined after Ruku'",
		reset: "Reset",
		prayerOption: (name, count) => `${name} (${count} rakats)`,
	},
	result: {
		heading: "Your Guide",
		summary: (name, rakat, pos) =>
			`${name}: rakat ${rakat}, ${pos.toLowerCase()}`,
		imamSummary: (w, r) => `With imam: ${w} rakats — remaining: ${r} rakats`,
		imomLabel: "With imam",
		qoldiLabel: "Remaining",
		rakatUnit: "rakat",
		complete: {
			title: "Congratulations!",
			body1: "You completed all rakats with the imam",
			body2: "Nothing more to do after the imam's salam",
		},
		makeup: {
			heading: (n) => `Pray ${n} more rakat on your own`,
			rakatLabel: (n) => `Rakat ${n}`,
			qiroatLabel: "Recitation",
			tashahhudMiddle: "Recite Tashahhud",
			tashahhudFinal: "Recite Tashahhud, Salawat and Du'a, then give Salam",
			otirishLabel: "Sitting",
			yakunLabel: "Conclusion",
			finalBadge: "final",
			notesTitle: "Notes",
			notes: [
				"After finishing all rakats, recite Tashahhud, Salawat and Du'a, then give Salam",
				"If you doubt the rakat count: if it's the first time, repeat the prayer; if it has happened before, act on your strongest assumption",
				"Perform your prayer for the pleasure of Allah!",
			],
		},
		qiroat: {
			F_S: "Fatiha + Sura",
			F_S_AUDIBLE: "Fatiha + Sura (audibly)",
			F_ONLY: "Fatiha only",
		},
	},
};

const uzCyrl: Translations = {
	app: {
		title: "Намозга кеч қўшилганлар учун йўриқнома",
		subtitle: "Қолган ракатларни ҳисоблаб, намозингизни тўғри якунланг",
		footer: "Аллоҳ таоло намозимизни қабул қилсин!",
	},
	form: {
		sectionTitle: "Танловлар",
		prayerLabel: "Намоз турини танланг:",
		prayerPlaceholder: "Намоз турини танланг...",
		rakatLabel: "Қайси ракатда қўшилдингиз?",
		rakatPlaceholder: "Ракатни танланг...",
		rakatOption: (n) => `${n}-ракат`,
		positionLabel: "Қайси ҳолатда қўшилдингиз?",
		positionQiyom: "Рукуъдан олдин қўшилдим",
		positionRuku: "Рукуъдан кейин қўшилдим",
		reset: "Қайтадан",
		prayerOption: (name, count) => `${name} намози (${count} ракат)`,
	},
	result: {
		heading: "Сизнинг йўриқномангиз",
		summary: (name, rakat, pos) => `${name} намози: ${rakat}-ракатда ${pos}`,
		imamSummary: (w, r) => `Имом билан: ${w} ракат — қолади: ${r} ракат`,
		imomLabel: "Имом билан",
		qoldiLabel: "Сиздан қолади",
		rakatUnit: "ракат",
		complete: {
			title: "Табриклаймиз!",
			body1: "Сиз имом билан барча ракатларни ўқиб бўлгансиз",
			body2: "Имом салом берганидан кейин бошқа ҳеч нарса қилишингиз шарт эмас",
		},
		makeup: {
			heading: (n) => `${n} ракат мустақил ўқинг`,
			rakatLabel: (n) => `${n}-ракат`,
			qiroatLabel: "Қироат",
			tashahhudMiddle: "Ташаҳҳуд ўқилади",
			tashahhudFinal: "Ташаҳҳуд, салавотлар ва дуо ўқиб салом берилади",
			otirishLabel: "Ўтириш",
			yakunLabel: "Якун",
			finalBadge: "якуний",
			notesTitle: "Эслатма",
			notes: [
				"Барча ракатларни якунлаганингиздан кейин ташаҳҳуд, салавотлар ва дуо ўқиб салом беринг",
				"Агар ракатлар сони ҳақида шубҳа қилсангиз: бу илк марта бўлса, намозни қайтадан ўқинг; такрор содир бўлаётган бўлса, гумонингизга кўра адо қилинг",
				"Намозингизни Аллоҳ розилиги учун адо қилинг!",
			],
		},
		qiroat: {
			F_S: "Фотиҳа + Сура",
			F_S_AUDIBLE: "Фотиҳа + Сура (овоз чиқариб)",
			F_ONLY: "Фақат Фотиҳа",
		},
	},
};

export const translations: Record<Locale, Translations> = {
	uz,
	"uz-cyrl": uzCyrl,
	ru,
	en,
};
