from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1920, 'height': 1080})
    page = context.new_page()

    # About page
    page.goto("http://localhost:3000/about")
    page.wait_for_load_state('networkidle')
    page.screenshot(path="jules-scratch/verification/about_page_fix.png")

    # Projects page
    page.goto("http://localhost:3000/projects")
    page.wait_for_load_state('networkidle')
    page.screenshot(path="jules-scratch/verification/projects_page_fix.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
