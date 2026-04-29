/**
 * Telegram bot webhook for @rakat_guide_bot.
 *
 * Vercel auto-detects files under /api as serverless functions.
 * Set the webhook once with:
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://salah-guide.vercel.app/api/telegram"
 */

export const config = { runtime: "edge" };

const MINI_APP_URL = "https://salah-guide.vercel.app";

type BotLocale = "uz" | "ru" | "en";

interface BotMessages {
	welcome: string;
	help: string;
	about: string;
	unknown: string;
	openButton: string;
}

const messages: Record<BotLocale, BotMessages> = {
	uz: {
		welcome: `Assalomu alaykum! 🕌

Bu bot — *Namozga kech qo'shilganlar uchun yo'riqnoma*. Imom bilan namozga kech qo'shilganingizda nechta rakat qolganini va qanday o'qish kerakligini ko'rsatadi.

Pastdagi tugma orqali ilovani oching 👇`,
		help: `*Buyruqlar:*
/start — botni boshlash
/help — yordam
/about — ilova haqida

Yoki pastdagi *Menu* tugmasidan ilovani oching.`,
		about: `*Rakāt — Namoz Yo'riqnomasi*

Imom bilan kech qo'shilganda nechta rakat qolganini hisoblaydi va har bir rakatda Fotiha + Sura yoki faqat Fotiha o'qishni, qachon tashahhud o'tirishni ko'rsatadi.

Open source: github.com/iamDiyorjon/SalahGuide
Alloh taolo namozimizni qabul qilsin!`,
		unknown: "Noma'lum buyruq. /help orqali buyruqlar ro'yxatini ko'ring.",
		openButton: "🕌 Ilovani ochish",
	},
	ru: {
		welcome: `Ассаламу алайкум! 🕌

Этот бот — *руководство для опоздавших на намаз*. Подскажет, сколько ракаатов осталось и как правильно их завершить.

Откройте приложение по кнопке ниже 👇`,
		help: `*Команды:*
/start — начать
/help — помощь
/about — о приложении

Или нажмите кнопку *Menu* внизу.`,
		about: `*Rakāt — Руководство по намазу*

Считает оставшиеся ракааты для опоздавших и показывает, что читать (Фатиха + сура или только Фатиха) и когда сидеть на ташаххуд.

Open source: github.com/iamDiyorjon/SalahGuide
Да примет Аллах наш намаз!`,
		unknown: "Неизвестная команда. Введите /help, чтобы увидеть список команд.",
		openButton: "🕌 Открыть приложение",
	},
	en: {
		welcome: `Assalamu alaykum! 🕌

This bot is a *late-joiner's prayer guide*. It tells you how many rakats remain and how to complete them correctly.

Open the app using the button below 👇`,
		help: `*Commands:*
/start — start the bot
/help — help
/about — about the app

Or tap the *Menu* button below.`,
		about: `*Rakāt — Prayer Guide*

Calculates remaining rakats for late joiners and shows what to recite (Fatiha + Sura or Fatiha only) and when to sit for Tashahhud.

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
	const c = code?.slice(0, 2).toLowerCase();
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
