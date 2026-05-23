import { expect, test } from "@playwright/test";

// Default UI is Uzbek; we explicitly select UZ at the start of each test
// so detection from navigator.language doesn't flake the assertions.
async function pickUz(page: import("@playwright/test").Page): Promise<void> {
	await page.getByTestId("lang-uz").click();
}

test("renders title and shows only the prayer picker initially", async ({
	page,
}) => {
	await page.goto("/");
	await pickUz(page);
	await expect(
		page.getByRole("heading", { name: /Namozga Kech/ }),
	).toBeVisible();

	await expect(page.getByTestId("prayer-group")).toBeVisible();
	await expect(page.getByTestId("rakat-group")).toHaveCount(0);
	await expect(page.getByTestId("position-group")).toHaveCount(0);
	await expect(page.getByTestId("result")).toHaveCount(0);
});

test("Bomdod rakat 1 qiyom → tugallangan state", async ({ page }) => {
	await page.goto("/");
	await pickUz(page);
	await page.getByTestId("prayer-bomdod").click();
	await page.getByTestId("rakat-1").click();
	await page.getByTestId("position-qiyom").click();

	await expect(page.getByTestId("complete-state")).toBeVisible();
	await expect(page.getByText("Tabriklaymiz!")).toBeVisible();
});

test("Shom rakat 3 ruku → 3 instruction cards with correct qiroat", async ({
	page,
}) => {
	await page.goto("/");
	await pickUz(page);
	await page.getByTestId("prayer-shom").click();
	await page.getByTestId("rakat-3").click();
	await page.getByTestId("position-ruku").click();

	const items = page.getByTestId("instruction-item");
	await expect(items).toHaveCount(3);
	await expect(items.nth(0)).toContainText("Fotiha + Sura");
	await expect(items.nth(1)).toContainText("Fotiha + Sura");
	await expect(items.nth(2)).toContainText("Faqat Fotiha");
	await expect(items.nth(2)).toContainText("Tashahhud");
});

test("4-rakat prayer rakat chips show 1..4 options", async ({ page }) => {
	await page.goto("/");
	await pickUz(page);
	await page.getByTestId("prayer-xufton").click();

	const rakatGroup = page.getByTestId("rakat-group");
	await expect(rakatGroup).toBeVisible();
	for (const n of [1, 2, 3, 4]) {
		await expect(rakatGroup.getByTestId(`rakat-${n}`)).toBeVisible();
	}
	// xufton has 4 rakats — no 5th chip
	await expect(rakatGroup.getByTestId("rakat-5")).toHaveCount(0);
});

test("changing prayer to one with fewer rakats clears an out-of-range rakat", async ({
	page,
}) => {
	await page.goto("/");
	await pickUz(page);
	await page.getByTestId("prayer-xufton").click();
	await page.getByTestId("rakat-4").click();
	// Switching to bomdod (2 rakat) should clear the previous rakat-4 selection
	await page.getByTestId("prayer-bomdod").click();

	const rakatGroup = page.getByTestId("rakat-group");
	await expect(rakatGroup.getByTestId("rakat-1")).toHaveAttribute(
		"aria-pressed",
		"false",
	);
	await expect(rakatGroup.getByTestId("rakat-2")).toHaveAttribute(
		"aria-pressed",
		"false",
	);
	// position group should not appear yet since rakat is cleared
	await expect(page.getByTestId("position-group")).toHaveCount(0);
});

test("selection resets on page reload (only language persists)", async ({
	page,
}) => {
	await page.goto("/");
	await pickUz(page);
	await page.getByTestId("prayer-peshin").click();
	await page.getByTestId("rakat-3").click();
	await page.getByTestId("position-ruku").click();
	await expect(page.getByTestId("result")).toBeVisible();

	await page.reload();
	await expect(page.getByTestId("rakat-group")).toHaveCount(0);
	await expect(page.getByTestId("position-group")).toHaveCount(0);
	await expect(page.getByTestId("result")).toHaveCount(0);
	await expect(page.getByTestId("lang-uz")).toHaveAttribute(
		"aria-pressed",
		"true",
	);
});

test("Reset button clears the form and result", async ({ page }) => {
	await page.goto("/");
	await pickUz(page);
	await page.getByTestId("prayer-asr").click();
	await page.getByTestId("rakat-2").click();
	await page.getByTestId("position-ruku").click();
	await expect(page.getByTestId("result")).toBeVisible();

	await page.getByTestId("reset-button").click();
	await expect(page.getByTestId("rakat-group")).toHaveCount(0);
	await expect(page.getByTestId("position-group")).toHaveCount(0);
	await expect(page.getByTestId("result")).toHaveCount(0);
});

test("language switcher persists choice and translates UI", async ({
	page,
}) => {
	await page.goto("/");

	await page.getByTestId("lang-en").click();
	await expect(
		page.getByRole("heading", { name: /Late-Joiner/ }),
	).toBeVisible();

	await page.reload();
	await expect(
		page.getByRole("heading", { name: /Late-Joiner/ }),
	).toBeVisible();

	await page.getByTestId("lang-ru").click();
	await expect(page.getByRole("heading", { name: /опоздавших/ })).toBeVisible();
});

test("Russian locale: Shom rakat 3 ruku shows translated qiroat", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByTestId("lang-ru").click();
	await page.getByTestId("prayer-shom").click();
	await page.getByTestId("rakat-3").click();
	await page.getByTestId("position-ruku").click();

	const items = page.getByTestId("instruction-item");
	await expect(items).toHaveCount(3);
	await expect(items.nth(2)).toContainText("Только Фатиха");
});
