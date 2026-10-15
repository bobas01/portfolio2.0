"""Découpe le panda peint et le retire de la clairière.

Le sprite reste le panda de l'image. Le décor est recopié à côté,
sur la même ligne, pour ne pas laisser un trou.
"""

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
GROVE = ROOT / "assets" / "plates" / "grove.png"
SPRITE = ROOT / "assets" / "plates" / "panda.png"

LEFT, TOP, RIGHT, BOTTOM = 628, 676, 776, 868


def is_bamboo(red, green, blue):
    return green > red + 8 and green > blue and red < 90 and green > 20


def is_sand(red, green, blue):
    if red >= 248 and blue >= 228:
        return False
    return red > 160 and green > 150 and blue > 120 and red - blue >= 18 and blue < 236 and abs(red - green) < 30


def cut_sprite(plate):
    crop = plate.crop((LEFT, TOP, RIGHT, BOTTOM)).convert("RGBA")
    width, height = crop.size
    pixels = crop.load()
    for y in range(height):
        for x in range(width):
            red, green, blue, _alpha = pixels[x, y]
            if is_bamboo(red, green, blue) or is_sand(red, green, blue):
                pixels[x, y] = (red, green, blue, 0)
    keep_largest(pixels, width, height)
    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if alpha > 20 and green > 30 and green > red + 4 and green > blue + 2:
                pixels[x, y] = (red, green, blue, 0)
    keep_largest(pixels, width, height)
    return crop


def keep_largest(pixels, width, height):
    seen = bytearray(width * height)
    best = []
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if seen[index] or pixels[x, y][3] <= 20:
                continue
            queue = deque([(x, y)])
            seen[index] = 1
            group = []
            while queue:
                cx, cy = queue.popleft()
                group.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    nindex = ny * width + nx
                    if seen[nindex] or pixels[nx, ny][3] <= 20:
                        continue
                    seen[nindex] = 1
                    queue.append((nx, ny))
            if len(group) > len(best):
                best = group
    keep = set(best)
    for y in range(height):
        for x in range(width):
            if pixels[x, y][3] > 20 and (x, y) not in keep:
                red, green, blue, _alpha = pixels[x, y]
                pixels[x, y] = (red, green, blue, 0)


def opaque_box(sprite):
    pixels = sprite.load()
    width, height = sprite.size
    min_x, min_y, max_x, max_y = width, height, 0, 0
    found = False
    for y in range(height):
        for x in range(width):
            if pixels[x, y][3] > 20:
                found = True
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if not found:
        raise SystemExit("panda introuvable")
    return min_x, min_y, max_x, max_y


def walk_frame(sprite):
    frame = Image.new("RGBA", sprite.size, (0, 0, 0, 0))
    pixels = sprite.load()
    out = frame.load()
    width, height = sprite.size
    _min_x, _min_y, _max_x, max_y = opaque_box(sprite)
    for y in range(height):
        for x in range(width):
            if pixels[x, y][3] <= 20:
                continue
            shift = -2
            if y > max_y - 18:
                shift = 2 if x < width // 2 else -1
            next_y = min(height - 1, max(0, y + shift))
            out[x, next_y] = pixels[x, y]
    return frame


def erase_panda(plate, sprite, origin, source):
    pixels = plate.load()
    sample = source.load()
    alpha = sprite.load()
    width, height = sprite.size
    plate_width, plate_height = plate.size
    base_x, base_y = origin
    mask = set()
    for y in range(height):
        for x in range(width):
            if alpha[x, y][3] <= 20:
                continue
            for dy in range(-3, 4):
                for dx in range(-3, 4):
                    target_x = base_x + x + dx
                    target_y = base_y + y + dy
                    if 0 <= target_x < plate_width and 0 <= target_y < plate_height:
                        mask.add((target_x, target_y))
    for y in range(max(0, TOP - 8), min(plate_height, BOTTOM + 8)):
        for x in range(max(0, LEFT - 8), min(plate_width, RIGHT + 8)):
            red, green, blue = sample[x, y]
            if is_panda_color(red, green, blue):
                mask.add((x, y))
    rows = {}
    for mask_x, mask_y in mask:
        rows.setdefault(mask_y, []).append(mask_x)
    for y, covered in rows.items():
        blocked = set(covered)
        for x in covered:
            left = x - 1
            while left >= 0 and (left in blocked or is_panda_color(*sample[left, y])):
                left -= 1
            right = x + 1
            while right < plate_width and (right in blocked or is_panda_color(*sample[right, y])):
                right += 1
            choose_left = left >= 0 and (right >= plate_width or x - left <= right - x)
            edge = left if choose_left else right
            if edge < 0 or edge >= plate_width:
                continue
            distance = abs(x - edge)
            sample_x = edge - (distance % 8) if choose_left else edge + (distance % 8)
            sample_x = min(plate_width - 1, max(0, sample_x))
            if is_panda_color(*sample[sample_x, y]):
                sample_x = edge
            pixels[x, y] = sample[sample_x, y]


def is_panda_color(red, green, blue):
    dark = red < 45 and green < 50 and blue < 50
    light = red > 230 and green > 220 and blue > 210 and not (red - blue >= 22 and blue < 226)
    return dark or light


def main():
    plate = Image.open(GROVE).convert("RGB")
    original = plate.copy()
    sprite = cut_sprite(plate)
    min_x, min_y, max_x, max_y = opaque_box(sprite)
    sprite = sprite.crop((min_x, min_y, max_x + 1, max_y + 1))
    frame = walk_frame(sprite)
    sheet = Image.new("RGBA", (sprite.width * 2, sprite.height), (0, 0, 0, 0))
    sheet.paste(sprite, (0, 0))
    sheet.paste(frame, (sprite.width, 0))
    sheet.save(SPRITE)
    erase_panda(plate, sprite, (LEFT + min_x, TOP + min_y), original)
    sample = original.load()
    pixels = plate.load()
    for y in range(688, 872):
        for x in range(630, 792):
            source_x = x - 240
            red, green, blue = sample[source_x, y]
            if is_panda_color(red, green, blue):
                source_x = x + 240
            pixels[x, y] = sample[source_x, y]
    plate.save(GROVE)
    print(f"sprite {sprite.size} sheet {sheet.size}")


if __name__ == "__main__":
    main()
