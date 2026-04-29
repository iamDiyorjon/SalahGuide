import {
	type Locale,
	localeShortLabels,
	SUPPORTED_LOCALES,
} from "../i18n/locales";

interface Props {
	locale: Locale;
	onChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ locale, onChange }: Props) {
	return (
		<div
			role="group"
			aria-label="Language"
			data-testid="language-switcher"
			className="inline-flex rounded-md border border-[var(--sg-border)] overflow-hidden text-xs"
		>
			{SUPPORTED_LOCALES.map((code) => {
				const active = code === locale;
				return (
					<button
						key={code}
						type="button"
						onClick={() => onChange(code)}
						aria-pressed={active}
						data-testid={`lang-${code}`}
						className={
							active
								? "px-2.5 py-1 bg-[var(--sg-accent)] text-[var(--sg-accent-text)] font-medium"
								: "px-2.5 py-1 hover:bg-[var(--sg-step-bg)] transition"
						}
					>
						{localeShortLabels[code]}
					</button>
				);
			})}
		</div>
	);
}
