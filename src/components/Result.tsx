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
			className="bg-[var(--sg-card-bg)] text-[var(--sg-text)] rounded-lg shadow-lg p-6 border border-[var(--sg-border)]"
		>
			<h2 className="text-2xl font-bold mb-6">{t.result.heading}</h2>

			<div className="bg-[var(--sg-info-bg)] border-l-4 border-[var(--sg-accent)] p-4 mb-6 rounded">
				<p>{t.result.summary(prayerName, result.joinedRakat, positionLabel)}</p>
				<p className="text-sm opacity-80 mt-1">
					{t.result.imamSummary(result.imomBilanOqildi, result.qolganRakatlar)}
				</p>
			</div>

			{result.tugallangan ? (
				<CompleteState t={t} />
			) : (
				<MakeupSteps result={result} t={t} />
			)}
		</section>
	);
}

function CompleteState({ t }: { t: Translations }) {
	return (
		<div
			data-testid="complete-state"
			className="bg-[var(--sg-success-bg)] border border-[var(--sg-success-border)] rounded-lg p-6 text-center"
		>
			<div className="text-5xl mb-3" aria-hidden="true">
				✅
			</div>
			<h3 className="text-2xl font-bold mb-3">{t.result.complete.title}</h3>
			<p className="text-lg mb-2">{t.result.complete.body1}</p>
			<p className="opacity-80">{t.result.complete.body2}</p>
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
	return (
		<>
			<div className="mb-6">
				<h3 className="text-lg font-semibold mb-4">
					{t.result.makeup.heading(result.qolganRakatlar)}
				</h3>

				<ol data-testid="instruction-list" className="space-y-4">
					{result.yoriqnomalar.map((step) => (
						<li
							key={step.rakatRaqami}
							data-testid="instruction-item"
							className="border border-[var(--sg-border)] rounded-lg p-4 bg-[var(--sg-step-bg)]"
						>
							<div className="flex items-start space-x-4">
								<div className="bg-[var(--sg-accent)] text-[var(--sg-accent-text)] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
									{step.rakatRaqami}
								</div>
								<div className="flex-1">
									<h4 className="font-medium mb-2">
										{t.result.makeup.rakatLabel(step.rakatRaqami)}
									</h4>
									<p className="opacity-90 mb-2">
										<strong>{t.result.makeup.qiroatLabel}</strong>{" "}
										{t.result.qiroat[step.qiroat]}
									</p>
									{step.otirish && (
										<p className="text-[var(--sg-accent)] font-medium">
											{t.result.makeup.tashahhud}
										</p>
									)}
								</div>
							</div>
						</li>
					))}
				</ol>
			</div>

			<div className="bg-[var(--sg-info-bg)] border border-[var(--sg-border)] rounded-lg p-4">
				<h4 className="font-medium mb-2">{t.result.makeup.notesTitle}</h4>
				<ul className="text-sm space-y-1 opacity-90">
					{t.result.makeup.notes.map((note) => (
						<li key={note}>• {note}</li>
					))}
				</ul>
			</div>
		</>
	);
}
