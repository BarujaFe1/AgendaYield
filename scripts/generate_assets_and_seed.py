"""Generate demo seed CSV and placeholder PNG assets for AgendaYield."""

from __future__ import annotations

import math
import random
import struct
import zlib
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "data" / "seed"
ASSETS = ROOT / "assets"
SHOTS = ASSETS / "screenshots"


def write_demo_csv() -> None:
    SEED.mkdir(parents=True, exist_ok=True)
    rng = random.Random(42)
    professionals = ["Ana Ribeiro", "Bruno Costa", "Camila Dias"]
    services = [
        ("Limpeza de pele", 90, 180),
        ("Botox", 45, 650),
        ("Preenchimento", 60, 890),
        ("Depilação laser", 40, 220),
        ("Massagem", 50, 160),
        ("Consulta estética", 30, 120),
    ]
    channels = ["whatsapp", "email", "manual"]
    first_names = [
        "Julia", "Pedro", "Marina", "Lucas", "Beatriz", "Rafael", "Sofia", "Diego",
        "Larissa", "Thiago", "Amanda", "Felipe", "Carolina", "Gustavo", "Isabela",
        "Henrique", "Natalia", "Rodrigo", "Patricia", "Eduardo",
    ]
    last_names = [
        "Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Almeida", "Ferreira",
        "Rodrigues", "Martins",
    ]

    start = datetime(2026, 5, 4, 9, 0, 0)
    rows = [
        "appointment_id,client_id,client_name,professional,service,starts_at,"
        "duration_min,ticket,confirmation_status,attendance_status,prior_no_shows,"
        "lead_time_hours,channel"
    ]

    client_history: dict[str, int] = {}
    appt = 0
    for day in range(28):
        day_dt = start + timedelta(days=day)
        if day_dt.weekday() == 6:
            continue
        for pro in professionals:
            slots = 5 if day_dt.weekday() < 5 else 3
            hour = 9
            for _ in range(slots):
                appt += 1
                svc_name, duration, base_ticket = services[rng.randint(0, len(services) - 1)]
                fn = first_names[rng.randint(0, len(first_names) - 1)]
                ln = last_names[rng.randint(0, len(last_names) - 1)]
                client_id = f"CLI-{(hash(fn + ln) % 80) + 1:03d}"
                client_name = f"{fn} {ln}"
                prior = client_history.get(client_id, rng.randint(0, 2))
                starts = day_dt.replace(hour=hour, minute=0 if rng.random() > 0.35 else 30)
                lead = rng.choice([6, 12, 24, 36, 48, 72, 96, 120])
                conf_roll = rng.random()
                if prior >= 2:
                    conf = "pending" if conf_roll < 0.55 else ("confirmed" if conf_roll < 0.85 else "declined")
                else:
                    conf = "confirmed" if conf_roll < 0.62 else ("pending" if conf_roll < 0.9 else "declined")

                # Attendance outcomes with bias from prior + confirmation.
                p_noshow = 0.08 + prior * 0.09
                if conf == "pending":
                    p_noshow += 0.12
                if conf == "declined":
                    p_noshow += 0.2
                if starts.weekday() >= 5:
                    p_noshow += 0.03
                roll = rng.random()
                if roll < p_noshow:
                    attendance = "no_show"
                    client_history[client_id] = prior + 1
                elif roll < p_noshow + 0.08:
                    attendance = "cancelled"
                    client_history[client_id] = prior
                elif day > 20:
                    attendance = "scheduled"
                    client_history[client_id] = prior
                else:
                    attendance = "attended"
                    client_history[client_id] = max(0, prior - (1 if rng.random() < 0.3 else 0))

                ticket = round(base_ticket * rng.uniform(0.92, 1.12), 2)
                channel = channels[rng.randint(0, 2)]
                rows.append(
                    f"APT-{appt:04d},{client_id},{client_name},{pro},{svc_name},"
                    f"{starts.isoformat()},{duration},{ticket},{conf},{attendance},"
                    f"{prior},{lead},{channel}"
                )
                hour += 1 if duration <= 45 else 2
                if hour > 18:
                    break

    (SEED / "studio_agenda_demo.csv").write_text("\n".join(rows) + "\n", encoding="utf-8")
    print("demo csv rows", len(rows) - 1)


def png(path: Path, w: int, h: int, paint) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    raw = bytearray()
    for y in range(h):
        raw.append(0)
        for x in range(w):
            r, g, b = paint(x, y, w, h)
            raw.extend((r & 255, g & 255, b & 255))
    data = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def lerp(a: float, b: float, t: float) -> int:
    return int(a + (b - a) * t)


def clamp(v: float, lo: int = 0, hi: int = 255) -> int:
    return max(lo, min(hi, int(v)))


def icon_paint(x: int, y: int, w: int, h: int):
    cx, cy = w / 2, h / 2
    dx, dy = x - cx, y - cy
    dist = (dx * dx + dy * dy) ** 0.5
    t = dist / (w * 0.72)
    r = lerp(8, 28, t)
    g = lerp(40, 70, 1 - min(t, 1))
    b = lerp(30, 55, 1 - min(t, 1))
    # Calendar block
    if abs(dx) < w * 0.26 and -h * 0.22 < dy < h * 0.28:
        if abs(dx) < w * 0.22 and -h * 0.12 < dy < h * 0.22:
            return (18, 48, 38)
        return (45, 212, 168)
    # Yield spark / slot marker
    if (x - int(w * 0.62)) ** 2 + (y - int(h * 0.38)) ** 2 < 28**2:
        return (240, 180, 41)
    if 200 < dist < 220:
        return (180, 240, 210)
    return (r, g, b)


def hero_paint(x: int, y: int, w: int, h: int):
    t = x / w
    r = lerp(4, 18, t)
    g = lerp(20, 48, y / h)
    b = lerp(16, 40, t)
    # Calendar columns
    if 40 < y < h - 40 and x < w * 0.30:
        return (clamp(r + 14), clamp(g + 28), clamp(b + 20))
    # Occupancy curve
    curve = int(h * 0.58) - int(60 * math.sin(x / 65.0) + 18 * math.sin(x / 21.0))
    if abs(y - curve) < 3:
        return (45, 212, 168)
    if abs(y - curve) < 20:
        return (clamp(r + 8), clamp(g + 22), clamp(b + 16))
    # Risk dots
    for i, color in enumerate(((47, 191, 113), (240, 180, 41), (255, 107, 107))):
        cx = int(w * (0.76 + i * 0.05))
        cy = int(h * 0.30)
        if (x - cx) ** 2 + (y - cy) ** 2 < 18**2:
            return color
    if x % 88 == 0 or y % 68 == 0:
        return (clamp(r + 8), clamp(g + 12), clamp(b + 10))
    return (r, g, b)


def arch_paint(x: int, y: int, w: int, h: int):
    r, g, b = 8, 22, 16
    boxes = [
        (0.04, 0.34, 0.14, 0.32),
        (0.22, 0.34, 0.14, 0.32),
        (0.40, 0.34, 0.14, 0.32),
        (0.58, 0.34, 0.14, 0.32),
        (0.76, 0.34, 0.18, 0.32),
    ]
    for bx, by, bw, bh in boxes:
        x0, x1 = int(bx * w), int((bx + bw) * w)
        y0, y1 = int(by * h), int((by + bh) * h)
        if x0 <= x <= x1 and y0 <= y <= y1:
            if x0 + 3 <= x <= x1 - 3 and y0 + 3 <= y <= y1 - 3:
                return (20, 56, 42)
            return (45, 212, 168)
    if int(h * 0.48) <= y <= int(h * 0.52) and (
        int(0.18 * w) <= x <= int(0.22 * w)
        or int(0.36 * w) <= x <= int(0.40 * w)
        or int(0.54 * w) <= x <= int(0.58 * w)
        or int(0.72 * w) <= x <= int(0.76 * w)
    ):
        return (180, 230, 210)
    return (r, g, b)


def social_paint(x: int, y: int, w: int, h: int):
    t = x / w
    r = lerp(6, 20, t)
    g = lerp(22, 50, y / h)
    b = lerp(18, 42, t)
    curve = int(h * 0.58) - int(28 * math.sin(x / 45.0))
    if abs(y - curve) < 16:
        return (30, 120, 90)
    if abs(y - curve) < 2:
        return (45, 212, 168)
    if x < 90:
        return (14, 40, 30)
    return (r, g, b)


def make_shot(name: str, base: tuple[int, int, int]) -> None:
    br, bg, bb = base

    def paint(x: int, y: int, w: int, h: int):
        r = br + (x * 18) // w
        g = bg + (y * 24) // h
        b = bb + ((x + y) * 12) // (w + h)
        if y < 48:
            return (clamp(r + 12), clamp(g + 18), clamp(b + 14))
        if 70 < y < 170 and 40 < x < w - 40:
            return (clamp(r + 24), clamp(g + 36), clamp(b + 28))
        if 200 < y < 520 and 40 < x < int(w * 0.62):
            sy = 360 - int(36 * math.sin(x / 32.0))
            if abs(y - sy) < 16:
                return (45, 212, 168)
            return (clamp(r + 8), clamp(g + 14), clamp(b + 12))
        if 200 < y < 520 and int(w * 0.66) < x < w - 40:
            return (clamp(r + 14), clamp(g + 22), clamp(b + 16))
        return (clamp(r), clamp(g), clamp(b))

    png(SHOTS / name, 1400, 860, paint)


def main() -> None:
    write_demo_csv()
    png(ASSETS / "icon.png", 512, 512, icon_paint)
    png(ASSETS / "hero-cover.png", 1600, 900, hero_paint)
    png(ASSETS / "architecture-pipeline.png", 1400, 700, arch_paint)
    png(ASSETS / "social-preview.png", 1280, 640, social_paint)
    shots = [
        ("01-calendar-yield-cockpit.png", (10, 28, 22)),
        ("02-confirmation-queue.png", (12, 32, 24)),
        ("03-noshow-risk-board.png", (14, 30, 26)),
        ("04-occupancy-by-pro.png", (10, 26, 20)),
        ("05-lost-revenue.png", (16, 28, 22)),
        ("06-fill-in-slots.png", (12, 34, 26)),
        ("07-weekly-report.png", (14, 30, 24)),
        ("08-upgrade-billing.png", (10, 28, 22)),
    ]
    for name, base in shots:
        make_shot(name, base)
    print("assets written")
    for p in sorted(ASSETS.rglob("*.png")):
        print(p.relative_to(ROOT), p.stat().st_size)


if __name__ == "__main__":
    main()
