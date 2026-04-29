import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	reporter: [["list"]],
	use: {
		baseURL: `http://127.0.0.1:${PORT}`,
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: `npx vite preview --host 127.0.0.1 --port ${PORT}`,
		url: `http://127.0.0.1:${PORT}`,
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
});
