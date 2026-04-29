import {
	type PrayerKey,
	type Position,
	isPrayerKey,
	isPosition,
	prayers,
} from "../data/prayers";

const STORAGE_KEY = "salahguide.lastSelection.v1";

export interface PersistedSelection {
	prayer: PrayerKey | "";
	joinedRakat: number | null;
	position: Position | "";
}

export const emptySelection: PersistedSelection = {
	prayer: "",
	joinedRakat: null,
	position: "",
};

export function loadSelection(): PersistedSelection {
	if (typeof window === "undefined") return emptySelection;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return emptySelection;
		const parsed = JSON.parse(raw) as Partial<PersistedSelection>;

		const prayer =
			typeof parsed.prayer === "string" && isPrayerKey(parsed.prayer)
				? parsed.prayer
				: "";

		const maxRakat = prayer ? prayers[prayer].rakatSoni : 0;
		const joinedRakat =
			typeof parsed.joinedRakat === "number" &&
			Number.isInteger(parsed.joinedRakat) &&
			parsed.joinedRakat >= 1 &&
			parsed.joinedRakat <= maxRakat
				? parsed.joinedRakat
				: null;

		const position =
			typeof parsed.position === "string" && isPosition(parsed.position)
				? parsed.position
				: "";

		return { prayer, joinedRakat, position };
	} catch {
		return emptySelection;
	}
}

export function saveSelection(selection: PersistedSelection): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
	} catch {
		/* quota or privacy mode — ignore */
	}
}

export function clearSelection(): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch {
		/* ignore */
	}
}
