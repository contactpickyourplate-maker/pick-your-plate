import openai, base64, pathlib, time

client = openai.OpenAI()
OUT = pathlib.Path("/Users/jessereiner/Desktop/PYP")

# Very explicit prompts — DALL-E keeps adding plates/bowls/utensils despite instructions
items = [
    ("turkey",
     "Overhead flat-lay of three overlapping deli turkey slices on a pure white surface. "
     "Absolutely no plate, no dish, no utensils, no garnish, no props of any kind. "
     "Pure white background, food fills the frame, professional food photography."),

    ("peanutbutter",
     "A rounded mound of creamy peanut butter sitting directly on a pure white surface. "
     "No spoon, no knife, no bowl, no jar, no props whatsoever. "
     "Pure white background, close-up, filling the frame."),

    ("sausage",
     "Two cooked sausage links lying on a pure white surface, close-up filling the frame. "
     "Absolutely no plate, no dish, no utensils, no condiments, no garnish, no props. "
     "Pure white background, professional food photography."),

    ("sweetpotato",
     "Roasted sweet potato wedges piled directly on a pure white surface. "
     "Absolutely no bowl, no plate, no dish, no utensils, no dipping sauce, no props. "
     "Pure white background, close-up filling the frame, professional food photography."),

    ("pepper",
     "A single whole red bell pepper sitting directly on a pure white surface. "
     "Absolutely no plate, no dish, no fork, no knife, no utensils, no placemat, no props. "
     "Pure white background, filling the frame, professional food photography."),

    ("celery",
     "Three celery sticks lying directly on a pure white surface. "
     "Absolutely no plate, no dish, no bowl, no utensils, no dip, no props. "
     "Pure white background, close-up filling the frame, professional food photography."),

    ("cauliflower",
     "Cauliflower florets piled directly on a pure white surface. "
     "Absolutely no plate, no dish, no fork, no knife, no utensils, no props. "
     "Pure white background, close-up filling the frame, professional food photography."),

    ("edamame",
     "A pile of bright green edamame pods directly on a pure white surface. "
     "Absolutely no bowl, no dish, no plate, no salt, no napkin, no props of any kind. "
     "Pure white background, close-up filling the frame, professional food photography."),

    ("mango",
     "Three fresh mango slices lying directly on a pure white surface. "
     "Absolutely no bowl, no plate, no dipping sauce, no dish, no props whatsoever. "
     "Pure white background, close-up filling the frame, professional food photography."),

    ("cherry",
     "A small loose pile of red cherries with stems directly on a pure white surface. "
     "Absolutely no bowl, no plate, no frame, no border, no box, no dish, no props. "
     "Pure white background, close-up filling the frame, professional food photography."),

    ("pineapple",
     "Fresh pineapple chunks piled directly on a pure white surface. "
     "Absolutely no container, no tray, no plate, no bowl, no dish, no props. "
     "Pure white background, close-up filling the frame, professional food photography."),

    ("waffle",
     "A single golden square waffle lying directly on a pure white surface. "
     "Absolutely no plate, no dish, no spoon, no fork, no syrup, no utensils, no props. "
     "Pure white background, filling the frame, professional food photography."),

    ("pancake",
     "A short stack of two plain pancakes sitting directly on a pure white surface. "
     "Absolutely no plate, no dish, no fork, no knife, no syrup, no butter, no utensils, no props. "
     "Pure white background, filling the frame, professional food photography."),
]

for name, prompt in items:
    print(f"Generating {name}...")
    try:
        resp = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            response_format="b64_json",
            n=1,
        )
        data = resp.data[0].b64_json
        (OUT / f"{name}.png").write_bytes(base64.b64decode(data))
        print(f"  ✓ saved {name}.png")
    except Exception as e:
        print(f"  ✗ {name}: {e}")
    time.sleep(1)

print("Done.")
