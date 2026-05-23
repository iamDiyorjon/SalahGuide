import { prayers, type PrayerKey } from "../data/prayers";
import type { Locale } from "../i18n/locales";
import type { Translations } from "../i18n/translations";
import type { CalculationResult } from "../lib/calculate";

interface Props {
	result: CalculationResult;
	locale: Locale;
	t: Translations;
}

const arabic: Record<PrayerKey, string> = {
	bomdod: "الفجر",
	peshin: "الظهر",
	asr: "العصر",
	shom: "المغرب",
	xufton: "العشاء",
};

export function Result({ result, locale, t }: Props) {
	const prayerName = prayers[result.prayer].nom[locale];

	return (
		<section
			data-testid="result"
			className="sg-anim-fade-up overflow-hidden -mx-4 sm:mx-0 sm:rounded-2xl border-y sm:border"
			style={{
				background: "var(--sg-card-bg)",
				color: "var(--sg-text)",
				borderColor: "var(--sg-border)",
			}}
		>
			{/* Header */}
			<header
				className="text-center px-6 pt-7 pb-5 border-b"
				style={{ borderColor: "var(--sg-border)" }}
			>
				<div className="flex items-center justify-center gap-2 mb-2">
					<Dot />
					<span
						className="text-[10px] uppercase font-semibold tracking-[0.22em]"
						style={{ color: "var(--sg-accent)" }}
					>
						{t.result.heading}
					</span>
					<Dot />
				</div>
				<h2 className="font-display text-[34px] font-medium tracking-tight leading-none">
					{prayerName}
				</h2>
				<div
					className="font-arabic text-[22px] mt-2"
					style={{ color: "var(--sg-text-mid)", direction: "rtl" }}
				>
					{arabic[result.prayer]}
				</div>
			</header>

			{/* Stats */}
			<div className="px-6 py-5">
				<div className="flex items-stretch">
					<Stat
						label={t.result.imomLabel}
						value={result.imomBilanOqildi}
						unit={t.result.rakatUnit}
					/>
					<div
						className="w-px self-stretch"
						style={{ background: "var(--sg-border)" }}
					/>
					<Stat
						label={t.result.qoldiLabel}
						value={result.qolganRakatlar}
						unit={t.result.rakatUnit}
						accent={result.qolganRakatlar > 0}
						align="right"
					/>
				</div>
			</div>

			{/* Body */}
			<div className="px-6 pb-7">
				{result.tugallangan ? (
					<CompleteState t={t} />
				) : (
					<>
						<MakeupSteps result={result} t={t} />
						<Notes t={t} />
					</>
				)}
			</div>
		</section>
	);
}

function Dot() {
	return (
		<span
			className="w-[3px] h-[3px] rounded-full"
			style={{ background: "var(--sg-accent)" }}
			aria-hidden="true"
		/>
	);
}

function Stat({
	label,
	value,
	unit,
	accent = false,
	align = "left",
}: {
	label: string;
	value: number;
	unit: string;
	accent?: boolean;
	align?: "left" | "right";
}) {
	return (
		<div
			className={`flex-1 flex flex-col gap-1.5 py-1 ${
				align === "right" ? "items-end pl-5 text-right" : "pr-5"
			}`}
		>
			<span className="sg-eyebrow">{label}</span>
			<span className="flex items-baseline gap-1.5">
				<span
					className={
						"font-display text-[44px] leading-none tabular-nums tracking-tight " +
						(accent ? "font-medium" : "font-normal")
					}
					style={accent ? { color: "var(--sg-accent)" } : undefined}
				>
					{value}
				</span>
				<span
					className="text-[11px] lowercase"
					style={{ color: "var(--sg-text-soft)" }}
				>
					{unit}
				</span>
			</span>
		</div>
	);
}

function CompleteState({ t }: { t: Translations }) {
	return (
		<div data-testid="complete-state" className="text-center py-10">
			<div className="inline-flex mb-4" style={{ color: "var(--sg-accent)" }}>
				<svg
					width="56"
					height="56"
					viewBox="0 0 56 56"
					fill="none"
					aria-hidden="true"
				>
					<circle
						cx="28"
						cy="28"
						r="26"
						stroke="currentColor"
						strokeWidth="0.8"
						opacity="0.3"
					/>
					<circle
						cx="28"
						cy="28"
						r="20"
						stroke="currentColor"
						strokeWidth="0.8"
						opacity="0.5"
					/>
					<path
						d="M18 28.5 L25 35 L39 19"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
			<h3 className="font-display text-[26px] font-medium mb-2 tracking-tight">
				{t.result.complete.title}
			</h3>
			<p
				className="text-sm leading-relaxed max-w-[30ch] mx-auto"
				style={{ color: "var(--sg-text-mid)" }}
			>
				{t.result.complete.body1}. {t.result.complete.body2}.
			</p>
		</div>
	);
}

function MakeupSteps({
	result,
	t,
}: {
	result: CalculationResult;
	t: Translations;
}) {
	const last = result.yoriqnomalar.length - 1;
	return (
		<>
			<div className="flex items-center gap-3 my-6">
				<span className="sg-rule" />
				<span
					className="text-[11px] uppercase tracking-[0.18em] font-semibold whitespace-nowrap"
					style={{ color: "var(--sg-text-mid)" }}
				>
					{t.result.makeup.heading(result.qolganRakatlar)}
				</span>
				<span className="sg-rule" />
			</div>

			<ol data-testid="instruction-list" className="space-y-5">
				{result.yoriqnomalar.map((step, idx) => {
					const isFinal = idx === last;
					return (
						<li
							key={step.rakatRaqami}
							data-testid="instruction-item"
							className="grid gap-3.5"
							style={{ gridTemplateColumns: "32px 1fr" }}
						>
							<span className="flex flex-col items-center">
								<span
									className="w-7 h-7 rounded-full inline-flex items-center justify-center font-mono text-xs font-medium tabular-nums border"
									style={
										isFinal
											? {
													background: "var(--sg-accent)",
													color: "var(--sg-accent-text)",
													borderColor: "var(--sg-accent)",
												}
											: {
													borderColor: "var(--sg-text-soft)",
													color: "var(--sg-text)",
												}
									}
								>
									{step.rakatRaqami}
								</span>
								{idx < last && (
									<span
										className="w-px flex-1 min-h-[20px] mt-1.5"
										style={{ background: "var(--sg-border)" }}
									/>
								)}
							</span>

							<div className="pt-0.5">
								<div className="flex items-baseline gap-2.5 mb-2.5">
									<h4 className="font-display text-lg font-medium tracking-tight">
										{t.result.makeup.rakatLabel(step.rakatRaqami)}
									</h4>
									{isFinal && (
										<span
											className="text-[9px] uppercase tracking-[0.18em] font-bold"
											style={{ color: "var(--sg-accent)" }}
										>
											{t.result.makeup.finalBadge}
										</span>
									)}
								</div>

								<dl className="flex flex-col gap-2.5">
									<Field
										label={t.result.makeup.qiroatLabel}
										value={t.result.qiroat[step.qiroat]}
									/>
									{step.otirish && (
										<Field
											label={
												isFinal
													? t.result.makeup.yakunLabel
													: t.result.makeup.otirishLabel
											}
											value={
												isFinal
													? t.result.makeup.tashahhudFinal
													: t.result.makeup.tashahhudMiddle
											}
											accent={isFinal}
										/>
									)}
								</dl>
							</div>
						</li>
					);
				})}
			</ol>
		</>
	);
}

function Field({
	label,
	value,
	accent = false,
}: {
	label: string;
	value: string;
	accent?: boolean;
}) {
	return (
		<div>
			<dt className="sg-eyebrow mb-1">{label}</dt>
			<dd
				className="text-sm leading-relaxed"
				style={
					accent
						? { color: "var(--sg-accent-deep)", fontWeight: 500 }
						: undefined
				}
			>
				{value}
			</dd>
		</div>
	);
}

function Notes({ t }: { t: Translations }) {
	return (
		<div
			className="mt-7 pt-5 border-t"
			style={{ borderColor: "var(--sg-border)" }}
		>
			<p className="sg-eyebrow mb-3.5">{t.result.makeup.notesTitle}</p>
			<ol className="flex flex-col gap-3">
				{t.result.makeup.notes.map((note, idx) => (
					<li key={note} className="flex gap-3.5">
						<span
							className="font-mono text-[10px] font-medium tabular-nums pt-[3px] shrink-0 w-5"
							style={{ color: "var(--sg-text-soft)", opacity: 0.75 }}
						>
							{String(idx + 1).padStart(2, "0")}
						</span>
						<p
							className="text-[13px] leading-relaxed flex-1"
							style={{ color: "var(--sg-text-mid)" }}
						>
							{note}
						</p>
					</li>
				))}
			</ol>
		</div>
	);
}
