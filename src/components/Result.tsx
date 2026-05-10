import { prayers } from "../data/prayers";
import type { Locale } from "../i18n/locales";
import type { Translations } from "../i18n/translations";
import type { CalculationResult } from "../lib/calculate";

interface Props {
	result: CalculationResult;
	locale: Locale;
	t: Translations;
}

export function Result({ result, locale, t }: Props) {
	const prayerName = prayers[result.prayer].nom[locale];
	const positionLabel =
		result.position === "qiyom" ? t.form.positionQiyom : t.form.positionRuku;

	return (
		<section
			data-testid="result"
			className="bg-[var(--sg-card-bg)] text-[var(--sg-text)] rounded-2xl shadow-lg border border-[var(--sg-border)] overflow-hidden"
		>
			<SummaryHeader
				prayerName={prayerName}
				rakatLabel={t.form.rakatOption(result.joinedRakat)}
				positionLabel={positionLabel}
				heading={t.result.heading}
			/>

			<div className="px-6 sm:px-8 pb-6 sm:pb-8">
				<StatRow
					withImam={result.imomBilanOqildi}
					remaining={result.qolganRakatlar}
					t={t}
				/>

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

function SummaryHeader({
	prayerName,
	rakatLabel,
	positionLabel,
	heading,
}: {
	prayerName: string;
	rakatLabel: string;
	positionLabel: string;
	heading: string;
}) {
	return (
		<header className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-[var(--sg-border)]">
			<p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2">
				{heading}
			</p>
			<h2 className="text-3xl font-semibold tracking-tight leading-tight">
				{prayerName}
			</h2>
			<p className="mt-2 text-sm opacity-65">
				<span className="tabular-nums">{rakatLabel}</span>
				<span className="mx-2 opacity-40">·</span>
				<span>{positionLabel}</span>
			</p>
		</header>
	);
}

function StatRow({
	withImam,
	remaining,
	t,
}: {
	withImam: number;
	remaining: number;
	t: Translations;
}) {
	return (
		<div className="grid grid-cols-2 gap-4 mt-6 mb-2">
			<Stat
				label={t.result.imomLabel}
				value={withImam}
				unit={t.result.rakatUnit}
				accent={false}
			/>
			<Stat
				label={t.result.qoldiLabel}
				value={remaining}
				unit={t.result.rakatUnit}
				accent={remaining > 0}
			/>
		</div>
	);
}

function Stat({
	label,
	value,
	unit,
	accent,
}: {
	label: string;
	value: number;
	unit: string;
	accent: boolean;
}) {
	return (
		<div
			className={
				accent
					? "border-l-2 border-[var(--sg-accent)] pl-4 py-1"
					: "border-l-2 border-[var(--sg-border)] pl-4 py-1"
			}
		>
			<p className="text-[10px] uppercase tracking-[0.18em] opacity-55 mb-1.5">
				{label}
			</p>
			<p className="flex items-baseline gap-1.5">
				<span
					className={
						accent
							? "text-4xl font-light tabular-nums text-[var(--sg-accent)]"
							: "text-4xl font-light tabular-nums"
					}
				>
					{value}
				</span>
				<span className="text-xs opacity-55">{unit}</span>
			</p>
		</div>
	);
}

function CompleteState({ t }: { t: Translations }) {
	return (
		<div data-testid="complete-state" className="mt-8 py-10 text-center">
			<div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-[var(--sg-accent)] mb-5">
				<svg
					className="w-6 h-6 text-[var(--sg-accent)]"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</div>
			<h3 className="text-2xl font-semibold mb-3 tracking-tight">
				{t.result.complete.title}
			</h3>
			<p className="text-base opacity-85 mb-1.5 max-w-sm mx-auto leading-relaxed">
				{t.result.complete.body1}
			</p>
			<p className="text-sm opacity-60 max-w-sm mx-auto leading-relaxed">
				{t.result.complete.body2}
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
	const lastIdx = result.yoriqnomalar.length - 1;
	return (
		<div className="mt-10">
			<h3 className="text-lg font-medium tracking-tight mb-7">
				{t.result.makeup.heading(result.qolganRakatlar)}
			</h3>

			<ol data-testid="instruction-list" className="relative space-y-7">
				{result.yoriqnomalar.map((step, idx) => {
					const isFinal = idx === lastIdx;
					const showConnector = idx < lastIdx;
					return (
						<li
							key={step.rakatRaqami}
							data-testid="instruction-item"
							className="relative pl-12"
						>
							{showConnector && (
								<span
									aria-hidden="true"
									className="absolute left-[15px] top-9 -bottom-7 w-px bg-[var(--sg-border)]"
								/>
							)}
							<span
								className={
									isFinal
										? "absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm tabular-nums font-semibold bg-[var(--sg-accent)] text-[var(--sg-accent-text)]"
										: "absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm tabular-nums font-medium border border-[var(--sg-border)] bg-[var(--sg-card-bg)]"
								}
							>
								{step.rakatRaqami}
							</span>

							<div className="pt-1">
								<div className="flex items-baseline gap-2.5 mb-3.5">
									<h4 className="text-base font-semibold tracking-tight">
										{t.result.makeup.rakatLabel(step.rakatRaqami)}
									</h4>
									{isFinal && (
										<span className="text-[10px] uppercase tracking-[0.2em] text-[var(--sg-accent)] font-medium">
											{t.result.makeup.finalBadge}
										</span>
									)}
								</div>

								<dl className="space-y-3">
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
		</div>
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
			<dt className="text-[10px] uppercase tracking-[0.18em] opacity-55 mb-1">
				{label}
			</dt>
			<dd
				className={
					accent
						? "text-[var(--sg-accent)] font-medium leading-relaxed"
						: "leading-relaxed"
				}
			>
				{value}
			</dd>
		</div>
	);
}

function Notes({ t }: { t: Translations }) {
	return (
		<div className="mt-10 pt-7 border-t border-[var(--sg-border)]">
			<p className="text-[10px] uppercase tracking-[0.2em] opacity-55 mb-4">
				{t.result.makeup.notesTitle}
			</p>
			<ol className="space-y-4">
				{t.result.makeup.notes.map((note, idx) => (
					<li key={note} className="flex gap-4">
						<span className="text-[11px] tabular-nums opacity-45 font-medium pt-[3px] shrink-0 w-5">
							{String(idx + 1).padStart(2, "0")}
						</span>
						<p className="text-sm leading-relaxed opacity-90 flex-1">{note}</p>
					</li>
				))}
			</ol>
		</div>
	);
}
