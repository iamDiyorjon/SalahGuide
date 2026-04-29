/**
 * Telegram bot webhook for @rakat_guide_bot.
 *
 * Vercel auto-detects files under /api as serverless functions.
 * Set the webhook once with:
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://salah-guide.vercel.app/api/telegram"
 */

export const config = { runtime: "edge" };

const MINI_APP_URL = "https://salah-guide.vercel.app";

const WELCOME = `Assalomu alaykum! 🕌

Bu bot — *Namozga kech qo'shilganlar uchun yo'riqnoma*. Imom bilan namozga kech qo'shilganingizda nechta rakat qolganini va qanday o'qish kerakligini ko'rsatadi.

Pastdagi tugma orqali ilovani oching 👇`;

const HELP = `*Buyruqlar:*
/start — botni boshlash
/help — yordam
/about — ilova haqida

Yoki pastdagi *Menu* tugmasidan ilovani oching.`;

const ABOUT = `*Rakāt — Namoz Yo'riqnomasi*

Imom bilan kech qo'shilganda nechta rakat qolganini hisoblaydi va har bir rakatda Fotiha + Sura yoki faqat Fotiha o'qishni, qachon tashahhud o'tirishni ko'rsatadi.

Open source: github.com/iamDiyorjon/SalahGuide
Alloh taolo namozimizni qabul qilsin!`;

interface TelegramUpdate {
	message?: {
		chat: { id: number };
		text?: string;
		from?: { first_name?: string };
	};
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

	const text = message.text.trim();
	const chatId = message.chat.id;

	if (text.startsWith("/start")) {
		await sendWelcome(token, chatId);
	} else if (text.startsWith("/help")) {
		await sendMessage(token, chatId, HELP);
	} else if (text.startsWith("/about")) {
		await sendMessage(token, chatId, ABOUT);
	} else if (text.startsWith("/")) {
		await sendMessage(
			token,
			chatId,
			"Noma'lum buyruq. /help orqali buyruqlar ro'yxatini ko'ring.",
		);
	}

	return new Response("OK");
}

async function sendWelcome(token: string, chatId: number): Promise<void> {
	await tg(token, "sendMessage", {
		chat_id: chatId,
		text: WELCOME,
		parse_mode: "Markdown",
		reply_markup: {
			inline_keyboard: [
				[{ text: "🕌 Ilovani ochish", web_app: { url: MINI_APP_URL } }],
			],
		},
	});
}

async function sendMessage(
	token: string,
	chatId: number,
	text: string,
): Promise<void> {
	await tg(token, "sendMessage", {
		chat_id: chatId,
		text,
		parse_mode: "Markdown",
		reply_markup: {
			inline_keyboard: [
				[{ text: "🕌 Ilovani ochish", web_app: { url: MINI_APP_URL } }],
			],
		},
	});
}

async function tg(
	token: string,
	method: string,
	body: Record<string, unknown>,
): Promise<void> {
	await fetch(`https://api.telegram.org/bot${token}/${method}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}
