from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    try:
        page.goto("http://localhost:3000/chat")
        page.wait_for_timeout(2000) # wait for 3d model to load
        page.screenshot(path="jules-scratch/verification/chat-idle.png")

        # Type a message and send it to trigger the talk animation
        page.get_by_test_id("input-chat-message").fill("Hello")
        page.get_by_test_id("button-send-message").click()
        page.wait_for_timeout(500) # wait for animation to start
        page.screenshot(path="jules-scratch/verification/chat-talk.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
