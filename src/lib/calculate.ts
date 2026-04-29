import {
	type PrayerKey,
	type Position,
	prayers,
	positionLabels,
} from "../data/prayers";

export interface Instruction {
	rakatRaqami: number;
	personalRakatCount: number;
	qiroat: string;
	otirish: boolean;
}

export interface CalculationInput {
	prayer: PrayerKey;
	joinedRakat: number;
	position: Position;
}

export interface CalculationResult {
	namozNomi: string;
	imomBilanOqildi: number;
	qolganRakatlar: number;
	tugallangan: boolean;
	qoshilganHolat: string;
	yoriqnomalar: Instruction[];
}

const QIROAT_F_S = "Fotiha + Sura";
const QIROAT_F_S_OVOZ = "Fotiha + Sura (ovoz chiqarib)";
const QIROAT_F_ONLY = "Faqat Fotiha";

export function calculate(input: CalculationInput): CalculationResult {
	const prayer = prayers[input.prayer];
	const { joinedRakat, position } = input;

	const imomBilanOqildi =
		position === "qiyom"
			? prayer.rakatSoni - joinedRakat + 1
			: prayer.rakatSoni - joinedRakat;

	const qolganRakatlar = Math.max(0, prayer.rakatSoni - imomBilanOqildi);
	const qoshilganHolat = `${joinedRakat}-rakatda ${positionLabels[position]}`;

	if (qolganRakatlar === 0) {
		return {
			namozNomi: prayer.nom,
			imomBilanOqildi,
			qolganRakatlar: 0,
			tugallangan: true,
			qoshilganHolat,
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
		namozNomi: prayer.nom,
		imomBilanOqildi,
		qolganRakatlar,
		tugallangan: false,
		qoshilganHolat,
		yoriqnomalar,
	};
}

function qiroatFor(
	prayer: PrayerKey,
	i: number,
	personalRakatCount: number,
): string {
	if (prayer === "bomdod") return QIROAT_F_S_OVOZ;
	if (prayer === "shom") {
		return personalRakatCount <= 2 ? QIROAT_F_S : QIROAT_F_ONLY;
	}
	return i <= 2 ? QIROAT_F_S : QIROAT_F_ONLY;
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
