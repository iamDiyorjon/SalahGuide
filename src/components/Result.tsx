import type { CalculationResult } from "../lib/calculate";

interface Props {
	result: CalculationResult;
}

export function Result({ result }: Props) {
	return (
		<section
			data-testid="result"
			className="bg-[var(--sg-card-bg)] text-[var(--sg-text)] rounded-lg shadow-lg p-6 border border-[var(--sg-border)]"
		>
			<h2 className="text-2xl font-bold mb-6">Sizning Yo'riqnomangiz</h2>

			<div className="bg-[var(--sg-info-bg)] border-l-4 border-[var(--sg-accent)] p-4 mb-6 rounded">
				<p>
					<strong>{result.namozNomi} namozi:</strong> {result.qoshilganHolat}
				</p>
				<p className="text-sm opacity-80 mt-1">
					Imom bilan: {result.imomBilanOqildi} rakat — qoladi:{" "}
					{result.qolganRakatlar} rakat
				</p>
			</div>

			{result.tugallangan ? <CompleteState /> : <MakeupSteps result={result} />}
		</section>
	);
}

function CompleteState() {
	return (
		<div
			data-testid="complete-state"
			className="bg-[var(--sg-success-bg)] border border-[var(--sg-success-border)] rounded-lg p-6 text-center"
		>
			<div className="text-5xl mb-3" aria-hidden="true">
				✅
			</div>
			<h3 className="text-2xl font-bold mb-3">Tabriklaymiz!</h3>
			<p className="text-lg mb-2">
				Siz imom bilan barcha rakatlarni o'qib bo'lgansiz
			</p>
			<p className="opacity-80">
				Imom salom berganidan keyin boshqa hech narsa qilishingiz shart emas
			</p>
		</div>
	);
}

function MakeupSteps({ result }: { result: CalculationResult }) {
	return (
		<>
			<div className="mb-6">
				<h3 className="text-lg font-semibold mb-4">
					Imom salom berganidan keyin {result.qolganRakatlar} rakat o'qishingiz
					kerak:
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
										{step.rakatRaqami}-rakat:
									</h4>
									<p className="opacity-90 mb-2">
										<strong>Qiroat:</strong> {step.qiroat}
									</p>
									{step.otirish && (
										<p className="text-[var(--sg-accent)] font-medium">
											Tashahhud o'qib o'tiring
										</p>
									)}
								</div>
							</div>
						</li>
					))}
				</ol>
			</div>

			<div className="bg-[var(--sg-info-bg)] border border-[var(--sg-border)] rounded-lg p-4">
				<h4 className="font-medium mb-2">Eslatma:</h4>
				<ul className="text-sm space-y-1 opacity-90">
					<li>
						• Barcha rakatlarni yakunlaganingizdan keyin tashahhud va salom
						bering
					</li>
					<li>• Agar shubhangiz bo'lsa, namozni qaytadan o'qing</li>
					<li>• Doimo Alloh taoloning roziligi uchun namoz o'qing</li>
				</ul>
			</div>
		</>
	);
}
