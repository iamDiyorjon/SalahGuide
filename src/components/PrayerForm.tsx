import {
	type PrayerKey,
	type Position,
	prayers,
	prayerKeys,
} from "../data/prayers";
import type { Locale } from "../i18n/locales";
import type { Translations } from "../i18n/translations";

interface Props {
	prayer: PrayerKey | "";
	joinedRakat: number | null;
	position: Position | "";
	locale: Locale;
	t: Translations;
	onPrayerChange: (value: PrayerKey | "") => void;
	onJoinedRakatChange: (value: number | null) => void;
	onPositionChange: (value: Position | "") => void;
}

export function PrayerForm({
	prayer,
	joinedRakat,
	position,
	locale,
	t,
	onPrayerChange,
	onJoinedRakatChange,
	onPositionChange,
}: Props) {
	const rakatCount = prayer ? prayers[prayer].rakatSoni : 0;

	return (
		<div className="space-y-6">
			<div>
				<label
					htmlFor="prayer-select"
					className="block text-sm font-medium mb-2 opacity-80"
				>
					{t.form.prayerLabel}
				</label>
				<select
					id="prayer-select"
					value={prayer}
					onChange={(e) => onPrayerChange(e.target.value as PrayerKey | "")}
					className="w-full p-3 rounded-lg border border-[var(--sg-border)] bg-[var(--sg-input-bg)] text-[var(--sg-text)] focus:ring-2 focus:ring-[var(--sg-accent)] focus:border-transparent"
				>
					<option value="">{t.form.prayerPlaceholder}</option>
					{prayerKeys.map((key) => (
						<option key={key} value={key}>
							{t.form.prayerOption(
								prayers[key].nom[locale],
								prayers[key].rakatSoni,
							)}
						</option>
					))}
				</select>
			</div>

			{prayer && (
				<div>
					<label
						htmlFor="rakat-select"
						className="block text-sm font-medium mb-2 opacity-80"
					>
						{t.form.rakatLabel}
					</label>
					<select
						id="rakat-select"
						value={joinedRakat ?? ""}
						onChange={(e) =>
							onJoinedRakatChange(
								e.target.value ? Number(e.target.value) : null,
							)
						}
						className="w-full p-3 rounded-lg border border-[var(--sg-border)] bg-[var(--sg-input-bg)] text-[var(--sg-text)] focus:ring-2 focus:ring-[var(--sg-accent)] focus:border-transparent"
					>
						<option value="">{t.form.rakatPlaceholder}</option>
						{Array.from({ length: rakatCount }, (_, i) => (
							<option key={i + 1} value={i + 1}>
								{t.form.rakatOption(i + 1)}
							</option>
						))}
					</select>
				</div>
			)}

			{joinedRakat !== null && (
				<fieldset>
					<legend className="block text-sm font-medium mb-2 opacity-80">
						{t.form.positionLabel}
					</legend>
					<div className="space-y-2">
						{(["qiyom", "ruku"] as const).map((key) => (
							<label key={key} className="flex items-center cursor-pointer">
								<input
									type="radio"
									name="position"
									value={key}
									checked={position === key}
									onChange={(e) => onPositionChange(e.target.value as Position)}
									className="mr-3 accent-[var(--sg-accent)]"
								/>
								<span>
									{key === "qiyom" ? t.form.positionQiyom : t.form.positionRuku}
								</span>
							</label>
						))}
					</div>
				</fieldset>
			)}
		</div>
	);
}
