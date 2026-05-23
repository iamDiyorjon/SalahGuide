import { useMemo, useState } from "react";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { PrayerForm } from "./components/PrayerForm";
import { Result } from "./components/Result";
import {
	isPrayerKey,
	prayers,
	type PrayerKey,
	type Position,
} from "./data/prayers";
import { useLocale } from "./i18n/useLocale";
import { calculate } from "./lib/calculate";

interface Selection {
	prayer: PrayerKey | "";
	joinedRakat: number | null;
	position: Position | "";
}

const emptySelection: Selection = {
	prayer: "",
	joinedRakat: null,
	position: "",
};

export default function App() {
	const { locale, setLocale, t } = useLocale();
	const [selection, setSelection] = useState<Selection>(emptySelection);

	const setPrayer = (prayer: PrayerKey | "") => {
		setSelection((s) => {
			const maxRakat = isPrayerKey(prayer) ? prayers[prayer].rakatSoni : 0;
			const joinedRakat =
				s.joinedRakat !== null && s.joinedRakat <= maxRakat
					? s.joinedRakat
					: null;
			return { ...s, prayer, joinedRakat };
		});
	};

	const setJoinedRakat = (joinedRakat: number | null) =>
		setSelection((s) => ({ ...s, joinedRakat }));

	const setPosition = (position: Position | "") =>
		setSelection((s) => ({ ...s, position }));

	const reset = () => setSelection(emptySelection);

	const result = useMemo(() => {
		if (
			!isPrayerKey(selection.prayer) ||
			selection.joinedRakat === null ||
			selection.position === ""
		) {
			return null;
		}
		return calculate({
			prayer: selection.prayer,
			joinedRakat: selection.joinedRakat,
			position: selection.position,
		});
	}, [selection]);

	const hasAnySelection =
		selection.prayer !== "" ||
		selection.joinedRakat !== null ||
		selection.position !== "";

	return (
		<div className="min-h-[100dvh] flex flex-col bg-[var(--sg-bg)] text-[var(--sg-text)] sg-gradient">
			<div className="w-full max-w-2xl mx-auto my-auto px-4 py-6">
				<div className="flex justify-end mb-2">
					<LanguageSwitcher locale={locale} onChange={setLocale} />
				</div>

				<header className="text-center mb-8">
					<h1 className="font-display text-4xl font-medium tracking-tight leading-tight mb-3 text-balance">
						{t.app.title}
					</h1>
					<p
						className="text-sm max-w-xs mx-auto"
						style={{ color: "var(--sg-text-mid)" }}
					>
						{t.app.subtitle}
					</p>
				</header>

				<section data-testid="prayer-form-card" className="mb-8">
					{hasAnySelection && (
						<div className="flex justify-end mb-4">
							<button
								type="button"
								onClick={reset}
								data-testid="reset-button"
								className="text-xs uppercase tracking-[0.16em] font-medium px-3 py-1.5 rounded-md border hover:bg-[var(--sg-step-bg)] transition"
								style={{
									borderColor: "var(--sg-border)",
									color: "var(--sg-text-mid)",
								}}
							>
								{t.form.reset}
							</button>
						</div>
					)}
					<PrayerForm
						prayer={selection.prayer}
						joinedRakat={selection.joinedRakat}
						position={selection.position}
						locale={locale}
						t={t}
						onPrayerChange={setPrayer}
						onJoinedRakatChange={setJoinedRakat}
						onPositionChange={setPosition}
					/>
				</section>

				{result && <Result result={result} locale={locale} t={t} />}
			</div>
		</div>
	);
}
