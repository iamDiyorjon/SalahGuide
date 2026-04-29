import { type PrayerKey, type Position, prayers } from "../data/prayers";

export type QiroatType = "F_S" | "F_S_AUDIBLE" | "F_ONLY";

export interface Instruction {
	rakatRaqami: number;
	personalRakatCount: number;
	qiroat: QiroatType;
	otirish: boolean;
}

export interface CalculationInput {
	prayer: PrayerKey;
	joinedRakat: number;
	position: Position;
}

export interface CalculationResult {
	prayer: PrayerKey;
	joinedRakat: number;
	position: Position;
	imomBilanOqildi: number;
	qolganRakatlar: number;
	tugallangan: boolean;
	yoriqnomalar: Instruction[];
}

export function calculate(input: CalculationInput): CalculationResult {
	const prayer = prayers[input.prayer];
	const { joinedRakat, position } = input;

	const imomBilanOqildi =
		position === "qiyom"
			? prayer.rakatSoni - joinedRakat + 1
			: prayer.rakatSoni - joinedRakat;

	const qolganRakatlar = Math.max(0, prayer.rakatSoni - imomBilanOqildi);

	if (qolganRakatlar === 0) {
		return {
			prayer: input.prayer,
			joinedRakat,
			position,
			imomBilanOqildi,
			qolganRakatlar: 0,
			tugallangan: true,
			yoriqnomalar: [],
		};
	}

	const yoriqnomalar: Instruction[] = [];
	for (let i = 1; i <= qolganRakatlar; i++) {
		const personalRakatCount = i + imomBilanOqildi;
		yoriqnomalar.push({
			rakatRaqami: i,
			personalRakatCount,
			qiroat: qiroatFor(input.prayer, i, personalRakatCount),
			otirish: shouldSit({
				prayer: input.prayer,
				i,
				personalRakatCount,
				qolganRakatlar,
			}),
		});
	}

	return {
		prayer: input.prayer,
		joinedRakat,
		position,
		imomBilanOqildi,
		qolganRakatlar,
		tugallangan: false,
		yoriqnomalar,
	};
}

function qiroatFor(
	prayer: PrayerKey,
	i: number,
	personalRakatCount: number,
): QiroatType {
	if (prayer === "bomdod") return "F_S_AUDIBLE";
	if (prayer === "shom") {
		return personalRakatCount <= 2 ? "F_S" : "F_ONLY";
	}
	return i <= 2 ? "F_S" : "F_ONLY";
}

function shouldSit(args: {
	prayer: PrayerKey;
	i: number;
	personalRakatCount: number;
	qolganRakatlar: number;
}): boolean {
	const { prayer, i, personalRakatCount, qolganRakatlar } = args;
	if (i === qolganRakatlar) return true;
	if (prayer === "bomdod") return false;
	return personalRakatCount === 2 && qolganRakatlar > 1;
}
