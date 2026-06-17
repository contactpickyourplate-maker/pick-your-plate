import openai, base64, pathlib, time

client = openai.OpenAI()
OUT = pathlib.Path("/Users/jessereiner/Desktop/PYP")

# Minimal prompts — simpler is better for stubborn items
items = [
    ("celery",
     "Celery stalks on a white background, food photography, close-up."),

    ("cauliflower",
     "Cauliflower florets on a white background, food photography, close-up."),

    ("edamame",
     "Fresh edamame pods on a white background, food photography, close-up."),

    ("mango",
     "Sliced mango pieces on a white background, food photography, close-up."),

    ("waffle",
     "A single golden waffle on a white background, food photography, close-up."),

    ("pancake",
     "A small stack of pancakes on a white background, food photography, close-up."),
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
