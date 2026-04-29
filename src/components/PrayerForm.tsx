import {
	type PrayerKey,
	type Position,
	prayers,
	prayerKeys,
	positionLabels,
} from "../data/prayers";

interface Props {
	prayer: PrayerKey | "";
	joinedRakat: number | null;
	position: Position | "";
	onPrayerChange: (value: PrayerKey | "") => void;
	onJoinedRakatChange: (value: number | null) => void;
	onPositionChange: (value: Position | "") => void;
}

export function PrayerForm({
	prayer,
	joinedRakat,
	position,
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
					Namoz turini tanlang:
				</label>
				<select
					id="prayer-select"
					value={prayer}
					onChange={(e) => onPrayerChange(e.target.value as PrayerKey | "")}
					className="w-full p-3 rounded-lg border border-[var(--sg-border)] bg-[var(--sg-input-bg)] text-[var(--sg-text)] focus:ring-2 focus:ring-[var(--sg-accent)] focus:border-transparent"
				>
					<option value="">Namoz turini tanlang...</option>
					{prayerKeys.map((key) => (
						<option key={key} value={key}>
							{prayers[key].nom} namozi ({prayers[key].rakatSoni} rakat)
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
						Qaysi rakatda qo'shildingiz?
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
						<option value="">Rakatni tanlang...</option>
						{Array.from({ length: rakatCount }, (_, i) => (
							<option key={i + 1} value={i + 1}>
								{i + 1}-rakat
							</option>
						))}
					</select>
				</div>
			)}

			{joinedRakat !== null && (
				<fieldset>
					<legend className="block text-sm font-medium mb-2 opacity-80">
						Qaysi holatda qo'shildingiz?
					</legend>
					<div className="space-y-2">
						{(Object.entries(positionLabels) as [Position, string][]).map(
							([key, label]) => (
								<label key={key} className="flex items-center cursor-pointer">
									<input
										type="radio"
										name="position"
										value={key}
										checked={position === key}
										onChange={(e) =>
											onPositionChange(e.target.value as Position)
										}
										className="mr-3 accent-[var(--sg-accent)]"
									/>
									<span>{label}</span>
								</label>
							),
						)}
					</div>
				</fieldset>
			)}
		</div>
	);
}
