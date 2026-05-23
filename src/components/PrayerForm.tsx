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

// Arabic display names — kept alongside the localized names.
const arabic: Record<PrayerKey, string> = {
	bomdod: "الفجر",
	peshin: "الظهر",
	asr: "العصر",
	shom: "المغرب",
	xufton: "العشاء",
};

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
		<div className="space-y-7">
			{/* Step 1 — prayer cards */}
			<div className="space-y-3">
				<SectionHead index="1" label={t.form.prayerLabel} done={!!prayer} />
				<div
					role="group"
					aria-label={t.form.prayerLabel}
					data-testid="prayer-group"
					className="grid grid-cols-5 gap-1.5"
				>
					{prayerKeys.map((key) => {
						const p = prayers[key];
						const selected = prayer === key;
						return (
							<button
								key={key}
								type="button"
								aria-pressed={selected}
								data-testid={`prayer-${key}`}
								onClick={() => onPrayerChange(selected ? "" : key)}
								className={
									"sg-card flex flex-col items-center gap-1.5 py-3 px-1 cursor-pointer" +
									(selected ? " is-on" : "")
								}
							>
								<span className="font-display text-base leading-none font-medium tracking-tight">
									{p.nom[locale]}
								</span>
								<span className="font-arabic text-[11px] leading-none opacity-70">
									{arabic[key]}
								</span>
								<span className="flex gap-[3px] mt-0.5" aria-hidden="true">
									{Array.from({ length: p.rakatSoni }).map((_, i) => (
										<span
											key={i}
											className={
												"w-1 h-1 rounded-full border " +
												(selected
													? "bg-[var(--sg-accent)] border-[var(--sg-accent)]"
													: "border-current opacity-50")
											}
										/>
									))}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Step 2 — rakat chips */}
			{prayer && (
				<div className="space-y-3 sg-anim-fade-up">
					<SectionHead
						index="2"
						label={t.form.rakatLabel}
						done={joinedRakat !== null}
					/>
					<div
						role="group"
						aria-label={t.form.rakatLabel}
						data-testid="rakat-group"
						className="grid gap-2"
						style={{
							gridTemplateColumns: `repeat(${rakatCount}, minmax(0, 1fr))`,
						}}
					>
						{Array.from({ length: rakatCount }, (_, i) => i + 1).map((n) => {
							const selected = joinedRakat === n;
							return (
								<button
									key={n}
									type="button"
									aria-pressed={selected}
									data-testid={`rakat-${n}`}
									onClick={() => onJoinedRakatChange(selected ? null : n)}
									className={
										"sg-card flex items-center justify-center h-[60px] cursor-pointer" +
										(selected ? " is-on" : "")
									}
								>
									<span className="font-display text-2xl font-medium leading-none tabular-nums">
										{n}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			)}

			{/* Step 3 — position cards */}
			{joinedRakat !== null && (
				<fieldset className="space-y-3 sg-anim-fade-up">
					<legend className="sr-only">{t.form.positionLabel}</legend>
					<SectionHead
						index="3"
						label={t.form.positionLabel}
						done={!!position}
					/>
					<div
						role="group"
						aria-label={t.form.positionLabel}
						data-testid="position-group"
						className="grid grid-cols-2 gap-2"
					>
						{(["qiyom", "ruku"] as const).map((key) => {
							const selected = position === key;
							const label =
								key === "qiyom" ? t.form.positionQiyom : t.form.positionRuku;
							return (
								<button
									key={key}
									type="button"
									aria-pressed={selected}
									data-testid={`position-${key}`}
									onClick={() => onPositionChange(selected ? "" : key)}
									className={
										"sg-card text-left px-4 py-4 min-h-[68px] flex items-center cursor-pointer" +
										(selected ? " is-on" : "")
									}
								>
									<span className="font-display text-[17px] font-medium leading-snug tracking-tight">
										{label}
									</span>
								</button>
							);
						})}
					</div>
				</fieldset>
			)}
		</div>
	);
}

function SectionHead({
	index,
	label,
	done,
}: {
	index: string;
	label: string;
	done: boolean;
}) {
	return (
		<div className="flex items-center gap-2.5">
			<span className="font-mono text-[10px] font-medium opacity-60 w-4">
				{index}
			</span>
			<span className="sg-eyebrow">{label}</span>
			<span className="sg-rule" />
			{done && (
				<span
					className="text-[11px] font-bold"
					style={{ color: "var(--sg-accent)" }}
					aria-hidden="true"
				>
					✓
				</span>
			)}
		</div>
	);
}
