/**
 * Telegram bot webhook for @rakat_guide_bot.
 *
 * Vercel auto-detects files under /api as serverless functions.
 * Set the webhook once with:
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://salah-guide.vercel.app/api/telegram"
 */

export const config = { runtime: "edge" };

const MINI_APP_URL = "https://salah-guide.vercel.app";

type BotLocale = "uz" | "uz-cyrl" | "ru" | "en";

interface BotMessages {
	welcome: string;
	help: string;
	about: string;
	unknown: string;
	openButton: string;
}

const SOURCES_UZ =
	'Shayx Muhammad Sodiq Muhammad Yusuf hazratlarining "Mo\'minning me\'roji" va "Ibodati Islomiya" asarlari';
const SOURCES_UZ_CYRL =
	'Шайх Муҳаммад Содиқ Муҳаммад Юсуф ҳазратларининг "Мўъминнинг меърожи" ва "Ибодати исломия" асарлари';
const SOURCES_RU =
	'трудов шейха Мухаммада Содика Мухаммада Юсуфа: "Мўъминнинг меърожи" и "Ибодати Исломия"';
const SOURCES_EN =
	'the works of Shaykh Muhammad Sodiq Muhammad Yusuf: "Mo\'minning Me\'roji" and "Ibodati Islomiya"';

const messages: Record<BotLocale, BotMessages> = {
	uz: {
		welcome: `Assalomu alaykum! 🕌

*Rakāt* — jamoat namoziga kech qo'shilganlar uchun qolgan rakatlar bo'yicha yo'riqnoma.

Hisob-kitob va ko'rsatmalar ${SOURCES_UZ} asosida tuzilgan.

Pastdagi tugma orqali ilovani oching 👇`,
		help: `*Buyruqlar:*
/start — botni boshlash
/help — yordam
/about — ilova haqida

Ushbu yo'riqnoma ${SOURCES_UZ} asosida tuzilgan.

Yoki pastdagi *Menu* tugmasidan ilovani oching.`,
		about: `*Rakāt — Namoz Yo'riqnomasi*

Jamoat namoziga kech qo'shilganlar uchun qolgan rakatlar bo'yicha yo'riqnoma.

Ushbu bot ${SOURCES_UZ} asosida tuzilgan.

Open source: github.com/iamDiyorjon/SalahGuide
Alloh taolo namozimizni qabul qilsin!`,
		unknown: "Noma'lum buyruq. /help orqali buyruqlar ro'yxatini ko'ring.",
		openButton: "🕌 Ilovani ochish",
	},
	"uz-cyrl": {
		welcome: `Ассалому алайкум! 🕌

*Rakāt* — жамоат намозига кеч қўшилганлар учун қолган ракатлар бўйича йўриқнома.

Ҳисоб-китоб ва кўрсатмалар ${SOURCES_UZ_CYRL} асосида тузилган.

Пастдаги тугма орқали иловани очинг 👇`,
		help: `*Буйруқлар:*
/start — ботни бошлаш
/help — ёрдам
/about — илова ҳақида

Ушбу йўриқнома ${SOURCES_UZ_CYRL} асосида тузилган.

Ёки пастдаги *Menu* тугмасидан иловани очинг.`,
		about: `*Rakāt — Намоз йўриқномаси*

Жамоат намозига кеч қўшилганлар учун қолган ракатлар бўйича йўриқнома.

Ушбу бот ${SOURCES_UZ_CYRL} асосида тузилган.

Open source: github.com/iamDiyorjon/SalahGuide
Аллоҳ таоло намозимизни қабул қилсин!`,
		unknown: "Номаълум буйруқ. /help орқали буйруқлар рўйхатини кўринг.",
		openButton: "🕌 Иловани очиш",
	},
	ru: {
		welcome: `Ассаламу алайкум! 🕌

*Rakāt* — руководство по оставшимся ракаатам для тех, кто опоздал на коллективный намаз.

Расчёты и указания основаны на ${SOURCES_RU}.

Откройте приложение по кнопке ниже 👇`,
		help: `*Команды:*
/start — начать
/help — помощь
/about — о приложении

Это руководство основано на ${SOURCES_RU}.

Или нажмите кнопку *Menu* внизу.`,
		about: `*Rakāt — Руководство по намазу*

Руководство по оставшимся ракаатам для тех, кто опоздал на коллективный намаз.

Бот составлен на основе ${SOURCES_RU}.

Open source: github.com/iamDiyorjon/SalahGuide
Да примет Аллах наш намаз!`,
		unknown: "Неизвестная команда. Введите /help, чтобы увидеть список команд.",
		openButton: "🕌 Открыть приложение",
	},
	en: {
		welcome: `Assalamu alaykum! 🕌

*Rakāt* — a guide to the remaining rakats for those who joined the congregational prayer late.

Calculations and rulings are based on ${SOURCES_EN}.

Open the app using the button below 👇`,
		help: `*Commands:*
/start — start the bot
/help — help
/about — about the app

This guide is based on ${SOURCES_EN}.

Or tap the *Menu* button below.`,
		about: `*Rakāt — Prayer Guide*

A guide to the remaining rakats for those who joined the congregational prayer late.

This bot is based on ${SOURCES_EN}.

Open source: github.com/iamDiyorjon/SalahGuide
May Allah accept our prayers!`,
		unknown: "Unknown command. Use /help to see available commands.",
		openButton: "🕌 Open app",
	},
};

interface TelegramUpdate {
	message?: {
		chat: { id: number };
		text?: string;
		from?: {
			first_name?: string;
			language_code?: string;
		};
	};
}

function pickLocale(code: string | undefined): BotLocale {
	const lower = code?.toLowerCase() ?? "";
	// Forward-compatible: if Telegram ever sends `uz-Cyrl-UZ` we honor it.
	// In practice Telegram only sends `uz`, so Cyrillic users currently
	// see Latin from the bot and pick Cyrillic manually in the WebApp.
	if (lower.startsWith("uz") && lower.includes("cyrl")) return "uz-cyrl";
	const c = lower.slice(0, 2);
	if (c === "ru") return "ru";
	if (c === "en") return "en";
	return "uz";
}

export default async function handler(req: Request): Promise<Response> {
	if (req.method !== "POST") {
		return new Response("OK", { status: 200 });
	}

	const token = (globalThis as { process?: { env: Record<string, string> } })
		.process?.env?.BOT_TOKEN;
	if (!token) {
		return new Response("BOT_TOKEN not set", { status: 500 });
	}

	let update: TelegramUpdate;
	try {
		update = (await req.json()) as TelegramUpdate;
	} catch {
		return new Response("Bad request", { status: 400 });
	}

	const message = update.message;
	if (!message?.text) {
		return new Response("OK");
	}

	const locale = pickLocale(message.from?.language_code);
	const m = messages[locale];
	const text = message.text.trim();
	const chatId = message.chat.id;

	if (text.startsWith("/start")) {
		await sendWithButton(token, chatId, m.welcome, m.openButton);
	} else if (text.startsWith("/help")) {
		await sendWithButton(token, chatId, m.help, m.openButton);
	} else if (text.startsWith("/about")) {
		await sendWithButton(token, chatId, m.about, m.openButton);
	} else if (text.startsWith("/")) {
		await sendWithButton(token, chatId, m.unknown, m.openButton);
	}

	return new Response("OK");
}

async function sendWithButton(
	token: string,
	chatId: number,
	text: string,
	buttonText: string,
): Promise<void> {
	await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			chat_id: chatId,
			text,
			parse_mode: "Markdown",
			reply_markup: {
				inline_keyboard: [
					[{ text: buttonText, web_app: { url: MINI_APP_URL } }],
				],
			},
		}),
	});
}
