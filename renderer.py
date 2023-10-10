import asyncio
from playwright.sync_api import sync_playwright
import os
import argparse

def pad(n, width, z='0'):
    return str(n).rjust(width, z)

def main():
    parser = argparse.ArgumentParser(description="Render presentation slides.")
    parser.add_argument( "--height", type=int, default=1080, help="Height of the viewport")
    parser.add_argument("--width", type=int, default=1920, help="Width of the viewport")
    parser.add_argument("--presentationFile", type=str, required=True, help="Path to the presentation file")
    parser.add_argument("--slideDir", type=str, default="slides", help="Directory to save slides")

    args = parser.parse_args()
    presentation_file = f"file://{os.path.abspath(args.presentationFile)}"  # Convert local path to file URL

    render_presentation(args.width, args.height, presentation_file, args.slideDir)

def render_presentation(width, height, presentation_file, slide_dir):
    print("Rendering presentation. This may take a minute.")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_viewport_size({"width": width, "height": height})
        page.goto(presentation_file, wait_until="networkidle")

        # slide_count = page.eval_on_selector("big", "big => big.length")
        slide_count = len(page.query_selector_all("body > div"))

        output = "slide"
        print(f"Loaded! Ready to render {slide_count} slides.")
        print(f"It will probably take about {round((slide_count * 0.2),2)} seconds to render the slides. Sit back and relax.")

        for i in range(slide_count):
            output_filename = os.path.join(slide_dir, f"{output}{pad(i+1, 4)}.png")
          
            print(f"Rendering {output_filename}")
            page.screenshot(path=output_filename, full_page=True)
            # page.click("div")
            page.keyboard.press("ArrowRight")

        browser.close()

if __name__ == "__main__":
    main()
