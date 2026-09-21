import urllib.request
import urllib.parse
import os

images = {
    "portfolio-three-thumb2.jpg": "A contactless restaurant ordering app interface, showing a dynamic QR code scanner, live digital menu with appetizing food items, and order status. Modern, clean UI design, mobile app view inside a web dashboard.",
    "portfolio-three-thumb3.jpg": "A modern e-commerce affiliate platform interface, showcasing lifestyle products, high-converting product grids, and filters. Clean, responsive web design.",
    "portfolio-three-thumb4.jpg": "A futuristic deep learning analytics dashboard, displaying real-time network telemetry, threat severity classifications, and confusion matrices. Cyberpunk dark mode, neon accents, high-tech UI."
}

base_dir = r"C:\websites\My-portfolio-main\assets\images\thumbs"

for filename, prompt in images.items():
    print(f"Generating image for {filename}...")
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&nologo=true"
    
    filepath = os.path.join(base_dir, filename)
    
    try:
        urllib.request.urlretrieve(url, filepath)
        print(f"Successfully saved {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")

print("All images generated.")
