import openai, base64, pathlib, time

client = openai.OpenAI()
OUT = pathlib.Path("/Users/jessereiner/Desktop/PYP")

# Lead with desired style (e-commerce/catalog isolated shot) instead of negation
items = [
    ("turkey",
     "E-commerce product photo of deli turkey slices, white seamless studio background, "
     "food isolated on white, no shadows, macro close-up filling the frame."),

    ("celery",
     "E-commerce product photo of celery sticks, white seamless studio background, "
     "food isolated on white, macro close-up filling the frame."),

    ("cauliflower",
     "E-commerce product photo of cauliflower florets, white seamless studio background, "
     "food isolated on white, macro close-up filling the frame."),

    ("edamame",
     "E-commerce product photo of edamame pods, white seamless studio background, "
     "food isolated on white, macro close-up filling the frame."),

    ("mango",
     "E-commerce product photo of sliced mango pieces, white seamless studio background, "
     "food isolated on white, macro close-up filling the frame."),

    ("sweetpotato",
     "E-commerce product photo of cooked sweet potato slices, white seamless studio background, "
     "food isolated on white, macro close-up filling the frame."),

    ("waffle",
     "E-commerce product photo of a single square waffle, white seamless studio background, "
     "food isolated on white, macro close-up filling the frame."),

    ("pancake",
     "E-commerce product photo of a small stack of pancakes, white seamless studio background, "
     "food isolated on white, macro close-up filling the frame."),
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
