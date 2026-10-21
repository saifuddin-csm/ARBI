import { defineConfig, devices } from "@playwright/test";

// Runs against the static export (npm run build first), served like GitHub Pages.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const port = 4173;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}${base}/`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        // Locally, use the installed Edge instead of downloading Playwright's Chromium.
        ...(process.env.CI ? {} : { channel: "msedge" }),
      },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.CI ? {} : { channel: "msedge" }),
      },
    },
  ],
  webServer: {
    command: "node scripts/serve-out.mjs",
    url: `http://localhost:${port}${base}/`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(port), NEXT_PUBLIC_BASE_PATH: base },
  },
});
