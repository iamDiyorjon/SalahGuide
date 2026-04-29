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

	await expect(page.locator("#prayer-select")).toBeVisible();
	await expect(page.locator("#rakat-select")).toHaveCount(0);
	await expect(page.getByTestId("result")).toHaveCount(0);
});

test("Bomdod rakat 1 qiyom → tugallangan state", async ({ page }) => {
	await page.goto("/");
	await pickUz(page);
	await page.locator("#prayer-select").selectOption("bomdod");
	await page.locator("#rakat-select").selectOption("1");
	await page.getByLabel("Rukudan oldin qo'shildim").check();

	await expect(page.getByTestId("complete-state")).toBeVisible();
	await expect(page.getByText("Tabriklaymiz!")).toBeVisible();
});

test("Shom rakat 3 ruku → 3 instruction cards with correct qiroat", async ({
	page,
}) => {
	await page.goto("/");
	await pickUz(page);
	await page.locator("#prayer-select").selectOption("shom");
	await page.locator("#rakat-select").selectOption("3");
	await page.getByLabel("Rukudan keyin qo'shildim").check();

	const items = page.getByTestId("instruction-item");
	await expect(items).toHaveCount(3);
	await expect(items.nth(0)).toContainText("Fotiha + Sura");
	await expect(items.nth(1)).toContainText("Fotiha + Sura");
	await expect(items.nth(2)).toContainText("Faqat Fotiha");
	await expect(items.nth(2)).toContainText("Tashahhud");
});

test("4-rakat prayer rakat dropdown shows 1..4 options", async ({ page }) => {
	await page.goto("/");
	await pickUz(page);
	await page.locator("#prayer-select").selectOption("xufton");
	const options = await page.locator("#rakat-select option").allTextContents();
	expect(options).toEqual([
		"Rakatni tanlang...",
		"1-rakat",
		"2-rakat",
		"3-rakat",
		"4-rakat",
	]);
});

test("changing prayer to one with fewer rakats clears an out-of-range rakat", async ({
	page,
}) => {
	await page.goto("/");
	await pickUz(page);
	await page.locator("#prayer-select").selectOption("xufton");
	await page.locator("#rakat-select").selectOption("4");
	await page.locator("#prayer-select").selectOption("bomdod");
	await expect(page.locator("#rakat-select")).toHaveValue("");
});

test("selection persists across page reloads", async ({ page }) => {
	await page.goto("/");
	await pickUz(page);
	await page.locator("#prayer-select").selectOption("peshin");
	await page.locator("#rakat-select").selectOption("3");
	await page.getByLabel("Rukudan keyin qo'shildim").check();
	await expect(page.getByTestId("result")).toBeVisible();

	await page.reload();
	await expect(page.locator("#prayer-select")).toHaveValue("peshin");
	await expect(page.locator("#rakat-select")).toHaveValue("3");
	await expect(page.getByLabel("Rukudan keyin qo'shildim")).toBeChecked();
	await expect(page.getByTestId("result")).toBeVisible();
});

test("Reset button clears the form and result", async ({ page }) => {
	await page.goto("/");
	await pickUz(page);
	await page.locator("#prayer-select").selectOption("asr");
	await page.locator("#rakat-select").selectOption("2");
	await page.getByLabel("Rukudan keyin qo'shildim").check();
	await expect(page.getByTestId("result")).toBeVisible();

	await page.getByTestId("reset-button").click();
	await expect(page.locator("#prayer-select")).toHaveValue("");
	await expect(page.locator("#rakat-select")).toHaveCount(0);
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
	await page.locator("#prayer-select").selectOption("shom");
	await page.locator("#rakat-select").selectOption("3");
	await page.getByLabel("Присоединился после руку").check();

	const items = page.getByTestId("instruction-item");
	await expect(items).toHaveCount(3);
	await expect(items.nth(2)).toContainText("Только Фатиха");
});
