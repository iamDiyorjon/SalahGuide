import { describe, expect, it } from "vitest";
import { calculate } from "./calculate";
import type { PrayerKey, Position } from "../data/prayers";

describe("calculate — Bomdod (2 rakats)", () => {
	it("rakat 1 qiyom → joined for both rakats, prayer complete", () => {
		const r = calculate({
			prayer: "bomdod",
			joinedRakat: 1,
			position: "qiyom",
		});
		expect(r.tugallangan).toBe(true);
		expect(r.imomBilanOqildi).toBe(2);
		expect(r.qolganRakatlar).toBe(0);
		expect(r.yoriqnomalar).toEqual([]);
	});

	it("rakat 1 ruku → 1 makeup, audible recitation, sit on final", () => {
		const r = calculate({ prayer: "bomdod", joinedRakat: 1, position: "ruku" });
		expect(r.tugallangan).toBe(false);
		expect(r.imomBilanOqildi).toBe(1);
		expect(r.qolganRakatlar).toBe(1);
		expect(r.yoriqnomalar).toHaveLength(1);
		expect(r.yoriqnomalar[0]).toMatchObject({
			rakatRaqami: 1,
			qiroat: "F_S_AUDIBLE",
			otirish: true,
		});
	});

	it("rakat 2 ruku → 2 makeups, no mid-sit (bomdod), final-sit only", () => {
		const r = calculate({ prayer: "bomdod", joinedRakat: 2, position: "ruku" });
		expect(r.imomBilanOqildi).toBe(0);
		expect(r.qolganRakatlar).toBe(2);
		expect(r.yoriqnomalar.map((x) => x.qiroat)).toEqual([
			"F_S_AUDIBLE",
			"F_S_AUDIBLE",
		]);
		expect(r.yoriqnomalar.map((x) => x.otirish)).toEqual([false, true]);
	});
});

describe("calculate — Shom (3 rakats)", () => {
	it("rakat 1 qiyom → fully joined", () => {
		const r = calculate({ prayer: "shom", joinedRakat: 1, position: "qiyom" });
		expect(r.tugallangan).toBe(true);
	});

	it("rakat 2 ruku → 2 makeups, mid-sit at first, final-sit at second", () => {
		const r = calculate({ prayer: "shom", joinedRakat: 2, position: "ruku" });
		expect(r.qolganRakatlar).toBe(2);
		expect(r.yoriqnomalar.map((x) => x.qiroat)).toEqual(["F_S", "F_ONLY"]);
		expect(r.yoriqnomalar.map((x) => x.otirish)).toEqual([true, true]);
	});

	it("rakat 3 ruku → 3 makeups, sit at 2nd cumulative and final", () => {
		const r = calculate({ prayer: "shom", joinedRakat: 3, position: "ruku" });
		expect(r.qolganRakatlar).toBe(3);
		expect(r.yoriqnomalar.map((x) => x.qiroat)).toEqual([
			"F_S",
			"F_S",
			"F_ONLY",
		]);
		expect(r.yoriqnomalar.map((x) => x.otirish)).toEqual([false, true, true]);
	});

	it("rakat 3 qiyom → 2 makeups, identical to rakat 2 ruku", () => {
		const a = calculate({ prayer: "shom", joinedRakat: 3, position: "qiyom" });
		const b = calculate({ prayer: "shom", joinedRakat: 2, position: "ruku" });
		expect(a.yoriqnomalar).toEqual(b.yoriqnomalar);
	});
});

describe("calculate — 4-rakat prayers (peshin/asr/xufton)", () => {
	const prayers: PrayerKey[] = ["peshin", "asr", "xufton"];

	for (const prayer of prayers) {
		describe(prayer, () => {
			it("rakat 1 qiyom → fully joined", () => {
				const r = calculate({ prayer, joinedRakat: 1, position: "qiyom" });
				expect(r.tugallangan).toBe(true);
			});

			it("rakat 3 ruku → 3 makeups, sit after personal-2 and final", () => {
				const r = calculate({ prayer, joinedRakat: 3, position: "ruku" });
				expect(r.qolganRakatlar).toBe(3);
				expect(r.yoriqnomalar.map((x) => x.qiroat)).toEqual([
					"F_S",
					"F_S",
					"F_ONLY",
				]);
				expect(r.yoriqnomalar.map((x) => x.otirish)).toEqual([
					true,
					false,
					true,
				]);
			});

			it("rakat 4 ruku → 4 makeups, sit at personal-2 and final", () => {
				const r = calculate({ prayer, joinedRakat: 4, position: "ruku" });
				expect(r.qolganRakatlar).toBe(4);
				expect(r.yoriqnomalar.map((x) => x.qiroat)).toEqual([
					"F_S",
					"F_S",
					"F_ONLY",
					"F_ONLY",
				]);
				expect(r.yoriqnomalar.map((x) => x.otirish)).toEqual([
					false,
					true,
					false,
					true,
				]);
			});

			it("rakat 2 ruku → 2 makeups, only final-sit", () => {
				const r = calculate({ prayer, joinedRakat: 2, position: "ruku" });
				expect(r.qolganRakatlar).toBe(2);
				expect(r.yoriqnomalar.map((x) => x.qiroat)).toEqual(["F_S", "F_S"]);
				expect(r.yoriqnomalar.map((x) => x.otirish)).toEqual([false, true]);
			});

			it("rakat 1 ruku → 1 makeup, treated as fresh first rakat (Fotiha+Sura)", () => {
				const r = calculate({ prayer, joinedRakat: 1, position: "ruku" });
				expect(r.qolganRakatlar).toBe(1);
				expect(r.yoriqnomalar[0]).toMatchObject({
					qiroat: "F_S",
					otirish: true,
				});
			});
		});
	}
});

describe("calculate — result contains language-neutral identifiers", () => {
	it("returns prayer key, joinedRakat, and position for downstream rendering", () => {
		const r = calculate({ prayer: "shom", joinedRakat: 2, position: "ruku" });
		expect(r.prayer).toBe("shom");
		expect(r.joinedRakat).toBe(2);
		expect(r.position).toBe("ruku");
	});
});

describe("calculate — exhaustive smoke (every legal input)", () => {
	const all: Array<[PrayerKey, number]> = [
		["bomdod", 2],
		["peshin", 4],
		["asr", 4],
		["shom", 3],
		["xufton", 4],
	];
	const positions: Position[] = ["qiyom", "ruku"];

	for (const [prayer, count] of all) {
		for (let rakat = 1; rakat <= count; rakat++) {
			for (const position of positions) {
				it(`${prayer} rakat=${rakat} ${position} returns consistent shape`, () => {
					const r = calculate({ prayer, joinedRakat: rakat, position });
					expect(r.qolganRakatlar).toBeGreaterThanOrEqual(0);
					expect(r.qolganRakatlar).toBeLessThanOrEqual(count);
					expect(r.yoriqnomalar).toHaveLength(r.qolganRakatlar);
					if (r.qolganRakatlar > 0) {
						expect(r.yoriqnomalar[r.qolganRakatlar - 1].otirish).toBe(true);
					}
				});
			}
		}
	}
});
