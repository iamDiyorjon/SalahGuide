import { useEffect, useMemo, useState } from "react";
import { PrayerForm } from "./components/PrayerForm";
import { Result } from "./components/Result";
import { calculate } from "./lib/calculate";
import {
	emptySelection,
	loadSelection,
	saveSelection,
} from "./lib/persistence";
import {
	isPrayerKey,
	prayers,
	type PrayerKey,
	type Position,
} from "./data/prayers";

export default function App() {
	const [selection, setSelection] = useState(emptySelection);

	useEffect(() => {
		setSelection(loadSelection());
	}, []);

	useEffect(() => {
		saveSelection(selection);
	}, [selection]);

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
		<div className="min-h-[100dvh] bg-[var(--sg-bg)] text-[var(--sg-text)] p-4 sg-gradient">
			<div className="max-w-2xl mx-auto">
				<header className="text-center mb-8 pt-2">
					<h1 className="text-3xl font-bold mb-2">
						Namozga Kech Qo'shilganlar Uchun Yo'riqnoma
					</h1>
					<p className="opacity-80">
						Namozga kech qo'shilganingizdan keyin qanday davom etishni bilib
						oling
					</p>
				</header>

				<section
					data-testid="prayer-form-card"
					className="bg-[var(--sg-card-bg)] rounded-lg shadow-lg p-6 mb-6 border border-[var(--sg-border)]"
				>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Tanlovlar</h2>
						{hasAnySelection && (
							<button
								type="button"
								onClick={reset}
								data-testid="reset-button"
								className="text-sm px-3 py-1.5 rounded-md border border-[var(--sg-border)] hover:bg-[var(--sg-step-bg)] transition"
							>
								Qaytadan
							</button>
						)}
					</div>
					<PrayerForm
						prayer={selection.prayer}
						joinedRakat={selection.joinedRakat}
						position={selection.position}
						onPrayerChange={setPrayer}
						onJoinedRakatChange={setJoinedRakat}
						onPositionChange={setPosition}
					/>
				</section>

				{result && <Result result={result} />}

				<footer className="text-center mt-8 text-sm opacity-70">
					<p>Alloh taolo namozimizni qabul qilsin!</p>
				</footer>
			</div>
		</div>
	);
}
