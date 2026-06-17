import openai, base64, pathlib, time

client = openai.OpenAI()
OUT = pathlib.Path("/Users/jessereiner/Desktop/PYP")

SOLID = "plain white background, no plate, no bowl, no utensils, no props, food photography, soft shadow beneath, centered, filling the frame"
BOWL  = "small clean white ceramic bowl, plain white background, no props, no spoon, food photography, centered"

items = [
    ("turkey",       f"Three neatly fanned slices of deli turkey meat, {SOLID}"),
    ("peanutbutter", f"A generous spoonful of peanut butter, the spoon removed, leaving a rounded mound of creamy peanut butter, {SOLID}"),
    ("sausage",      f"Two cooked sausage links side by side, {SOLID}"),
    ("sweetpotato",  f"Several cooked sweet potato wedges, {SOLID}"),
    ("pepper",       f"A whole red bell pepper, {SOLID}"),
    ("celery",       f"Three celery sticks bundled together, {SOLID}"),
    ("cauliflower",  f"A cluster of white cauliflower florets, {SOLID}"),
    ("edamame",      f"A small pile of bright green edamame pods, {SOLID}"),
    ("mango",        f"Three slices of fresh mango, {SOLID}"),
    ("pear",         f"A single whole green pear, {SOLID}"),
    ("cherry",       f"A small pile of red cherries with stems, {SOLID}"),
    ("pineapple",    f"Several cubed chunks of fresh pineapple, {SOLID}"),
    ("bread",        f"A single slice of white sandwich bread, {SOLID}"),
    ("waffle",       f"A golden square waffle filling the frame, {SOLID}"),
    ("pancake",      f"A short stack of two plain pancakes, {SOLID}"),
    ("cottage",      f"Cottage cheese, {BOWL}"),
    ("stringcheese", f"A single string cheese stick peeled slightly at one end, {SOLID}"),
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
