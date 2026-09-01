#!/usr/bin/env python3
"""
Generate a high-resolution, web-friendly, printable PDF lineup card
for Senoia PorchFest 2026, matching the brand styling of the website.
"""

import os
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.pdfgen import canvas

def hex_color(hex_str):
    hex_str = hex_str.lstrip('#')
    return colors.HexColor(f"#{hex_str}")

# Brand Colors
INK = hex_color('101D3A')          # Navy
FLAG = hex_color('B02A30')         # Flag Red
FLAG_BRIGHT = hex_color('E35A55')  # Bright Red
CREAM = hex_color('F5F1E6')        # Warm White/Cream
PALE = hex_color('CDD3E8')         # Secondary Text on Navy
GOLD = hex_color('D9A41F')         # Gold Star
WHITE = colors.white
STONE_100 = hex_color('F5F5F4')
STONE_200 = hex_color('E7E5E4')
STONE_300 = hex_color('D6D3D1')
STONE_600 = hex_color('57534E')
STONE_800 = hex_color('292524')

# Schedule Data (Source of truth: schedule.js)
SETS_3PM = [
    {"stage": 2, "act": "Amir Salam", "genre": "Country", "address": "1 Main St", "venue": "Senoia Beer Co"},
    {"stage": 12, "act": "Brain Fog", "genre": "70s-00s Covers", "address": "180 Seavy St", "venue": None},
    {"stage": 27, "act": "Candler Hobbs", "genre": "Classic Rock", "address": "31 Morgan St", "venue": None},
    {"stage": 5, "act": "David Pippin Group", "genre": "Rock & Blues", "address": "60 Main St", "venue": "Olivia James"},
    {"stage": 16, "act": "GRASS", "genre": "60s/70s Rock", "address": "89 Lower Creek Trl", "venue": None},
    {"stage": 19, "act": "James & GA Peaches", "genre": "Pop/Rock/Country", "address": "252 Seavy St", "venue": "Veranda Inn"},
    {"stage": 7, "act": "Mary Martin", "genre": "Indie/Folk/Americana", "address": "22 Main St", "venue": "Pearl & Pine"},
    {"stage": 22, "act": "Tyler Lowman Band", "genre": "Country/South Rock", "address": "239 Pylant St", "venue": None},
]

SETS_4PM = [
    {"stage": 15, "act": "Ladega", "genre": "Jam/Indie/Classic Rock", "address": "97 Lower Creek Trl", "venue": None},
    {"stage": 8, "act": "Last Signal Home", "genre": "Rock", "address": "42 Main St", "venue": "404 Celsius"},
    {"stage": 17, "act": "Luke Morgan & Redliners", "genre": "Country Rock", "address": "55 Lower Creek Trl", "venue": None},
    {"stage": 2, "act": "Russ Gordon & Rattletrap", "genre": "Country", "address": "1 Main St", "venue": "Senoia Beer Co"},
    {"stage": 1, "act": "Tim McGee", "genre": "70s-90s/R&B/Rock", "address": "40 Travis St", "venue": "Farmers' Market"},
    {"stage": 21, "act": "Whiskey River Saints", "genre": "Southern Rock", "address": "371 Pylant St", "venue": None},
    {"stage": 22, "act": "Wholly Smokes", "genre": "Classic & South Rock", "address": "239 Pylant St", "venue": None},
]

SETS_5PM = [
    {"stage": 13, "act": "Brian Rivers Band", "genre": "Pop & Rock", "address": "274 Seavy St", "venue": None},
    {"stage": 4, "act": "Highway 54", "genre": "Blues, Soul & Rock", "address": "70 Main St", "venue": "Crust & Craft"},
    {"stage": 3, "act": "Joel Bridges", "genre": "Acoustic/Folk/Rock", "address": "18 Main St", "venue": "Borgo Italia"},
    {"stage": 23, "act": "Lucas Smith", "genre": "70s-80s Old Country", "address": "270 Pylant St", "venue": None},
    {"stage": 14, "act": "Luke Brown & Jubilee", "genre": "Country", "address": "77 Lower Creek Trl", "venue": None},
    {"stage": 24, "act": "Rob Harlan", "genre": "Classic Rock & Country", "address": "352 Pylant St", "venue": None},
    {"stage": 25, "act": "Wildcat", "genre": "Classic & South Rock", "address": "41 Morgan St", "venue": None},
    {"stage": 28, "act": "Wyatt Band", "genre": "Dance & Classic Rock", "address": "230 Pylant St", "venue": None},
]

SETS_6PM = [
    {"stage": 26, "act": "Brian Collins", "genre": "Country/Americana", "address": "57 Morgan St", "venue": None},
    {"stage": 6, "act": "Cowboy Noyz", "genre": "All Genres", "address": "48 Main St", "venue": "Glass House"},
    {"stage": 20, "act": "Greg 'Rogan' Rogers", "genre": "Modern Country", "address": "271 Seavy St", "venue": None},
    {"stage": 23, "act": "Jake & The Naysayers", "genre": "Jamband & Country", "address": "270 Pylant St", "venue": None},
    {"stage": 9, "act": "Sarah & Morgan Hendrix", "genre": "Indie Pop & Rock", "address": "30 Main St", "venue": "Senoia Coffee"},
    {"stage": 18, "act": "Souls Hill", "genre": "Southern & Classic Rock", "address": "25 Lower Creek Trl", "venue": None},
    {"stage": 21, "act": "Tyler Caldwell", "genre": "Country/Folk/Rock", "address": "371 Pylant St", "venue": None},
]

SETS_7PM = [
    {"stage": 1, "act": "Ashton Dooley Band", "genre": "Americana/Classic Rock", "address": "40 Travis St", "venue": "Farmers' Market"},
    {"stage": 7, "act": "Atticus Roness", "genre": "Rock n Roll", "address": "22 Main St", "venue": "Pearl & Pine"},
    {"stage": 26, "act": "Duncan Brothers Band", "genre": "Country", "address": "57 Morgan St", "venue": None},
    {"stage": 2, "act": "Gradient", "genre": "Blues & Rock", "address": "1 Main St", "venue": "Senoia Beer Co"},
    {"stage": 10, "act": "Grateful To Be", "genre": "Rock", "address": "74 Main St", "venue": "Buggy Museum"},
    {"stage": 19, "act": "Joey Thurmond Orch.", "genre": "Rock/Pop/Blues/Gospel", "address": "252 Seavy St", "venue": "Veranda Inn"},
    {"stage": 29, "act": "Rock Soldered Blues", "genre": "70s Rock & Blues", "address": "258 Pylant St", "venue": None},
    {"stage": 12, "act": "Tavis Lance Mapp", "genre": "Country", "address": "180 Seavy St", "venue": None},
]

COLUMNS = [
    {"time": "3:00 PM", "label": "3:00 PM SETS", "acts": SETS_3PM},
    {"time": "4:00 PM", "label": "4:00 PM SETS", "acts": SETS_4PM},
    {"time": "5:00 PM", "label": "5:00 PM SETS", "acts": SETS_5PM},
    {"time": "6:00 PM", "label": "6:00 PM SETS", "acts": SETS_6PM},
    {"time": "7:00 PM", "label": "7:00 PM SETS", "acts": SETS_7PM},
]

def generate_pdf(output_path):
    width, height = landscape(letter) # 792 x 612 pt
    c = canvas.Canvas(output_path, pagesize=(width, height))
    
    # 1. Background Fill
    c.setFillColor(CREAM)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # 2. Header Banner (Deep Navy)
    header_x = 20
    header_y = height - 66
    header_w = width - 40
    header_h = 52

    c.setFillColor(INK)
    c.roundRect(header_x, header_y, header_w, header_h, 6, fill=1, stroke=0)

    # Top accent red strip
    c.setFillColor(FLAG)
    c.roundRect(header_x, header_y + header_h - 4, header_w, 4, 2, fill=1, stroke=0)

    # Title text
    c.setFillColor(CREAM)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(header_x + 16, header_y + 26, "SENOIA PORCHFEST 2026")

    c.setFillColor(FLAG_BRIGHT)
    c.setFont("Helvetica-Bold", 14)
    c.drawRightString(header_x + header_w - 16, header_y + 28, "OFFICIAL LINEUP CARD")

    c.setFillColor(PALE)
    c.setFont("Helvetica", 9)
    c.drawString(header_x + 16, header_y + 10, "Sunday, September 6, 2026 · Historic Senoia, GA · Music 3:00–10:00 PM · Free Admission")
    c.drawRightString(header_x + header_w - 16, header_y + 10, "41 Acts across ~29 Porch Stages · senoiaporchfest.org")

    # 3. Top Callouts (VIP Kickoff & Main Stage Closing Act)
    callout_y = header_y - 32
    callout_h = 24
    half_w = (header_w - 10) / 2

    # VIP Box (Left)
    c.setFillColor(WHITE)
    c.roundRect(header_x, callout_y, half_w, callout_h, 4, fill=1, stroke=1)
    c.setStrokeColor(STONE_300)

    c.setFillColor(FLAG)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(header_x + 8, callout_y + 8, "VIP KICKOFF (2:00 PM):")

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(header_x + 115, callout_y + 8, "Kellar McCoy")

    c.setFillColor(STONE_600)
    c.setFont("Helvetica", 7.5)
    c.drawString(header_x + 175, callout_y + 8, "· 40 Travis St (Farmers' Market) · VIP Lounge")

    # Main Stage Box (Right)
    ms_x = header_x + half_w + 10
    c.setFillColor(WHITE)
    c.roundRect(ms_x, callout_y, half_w, callout_h, 4, fill=1, stroke=1)
    c.setStrokeColor(FLAG)

    c.setFillColor(FLAG)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(ms_x + 8, callout_y + 8, "MAIN STAGE CLOSING ACT (8:00 PM):")

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(ms_x + 185, callout_y + 8, "Chuck X Nick")

    c.setFillColor(STONE_600)
    c.setFont("Helvetica", 7.5)
    c.drawString(ms_x + 248, callout_y + 8, "· Bottom of Main St")

    # 4. Five Hourly Columns
    cols_top = callout_y - 8
    col_gap = 8
    num_cols = 5
    col_w = (header_w - (num_cols - 1) * col_gap) / num_cols # ~142.4 pt
    col_h = 440

    for i, col in enumerate(COLUMNS):
        col_x = header_x + i * (col_w + col_gap)
        
        # Column container box
        c.setFillColor(WHITE)
        c.setStrokeColor(STONE_200)
        c.roundRect(col_x, cols_top - col_h, col_w, col_h, 4, fill=1, stroke=1)

        # Column Header (Navy pill)
        header_pill_h = 22
        c.setFillColor(INK)
        c.roundRect(col_x, cols_top - header_pill_h, col_w, header_pill_h, 4, fill=1, stroke=0)
        
        c.setFillColor(CREAM)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(col_x + col_w / 2, cols_top - 15, col["label"])

        # Render Act Cards inside Column
        card_start_y = cols_top - header_pill_h - 4
        card_h = 48.5
        card_gap = 3

        for j, act in enumerate(col["acts"]):
            card_y = card_start_y - (j + 1) * card_h - j * card_gap + card_h
            
            # Subtle card background
            c.setFillColor(STONE_100)
            c.setStrokeColor(STONE_200)
            c.roundRect(col_x + 3, card_y, col_w - 6, card_h - 1, 3, fill=1, stroke=1)

            # Stage Badge Circle
            badge_r = 7.5
            badge_cx = col_x + 3 + badge_r + 4
            badge_cy = card_y + card_h / 2 + 5

            c.setFillColor(FLAG)
            c.circle(badge_cx, badge_cy, badge_r, fill=1, stroke=0)

            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 7.5)
            stage_str = str(act["stage"])
            c.drawCentredString(badge_cx, badge_cy - 2.5, stage_str)

            # Text content
            text_x = badge_cx + badge_r + 4
            text_max_w = col_w - 6 - (text_x - col_x)

            # Act Name
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 8)
            act_name = act["act"]
            if len(act_name) > 19:
                act_name = act_name[:18] + "…"
            c.drawString(text_x, badge_cy - 2, act_name)

            # Genre
            c.setFillColor(FLAG)
            c.setFont("Helvetica-Bold", 6.5)
            genre = act["genre"]
            if len(genre) > 23:
                genre = genre[:22] + "…"
            c.drawString(text_x, badge_cy - 10, genre)

            # Address & Venue
            c.setFillColor(STONE_600)
            c.setFont("Helvetica", 6.5)
            addr = act["address"]
            if act["venue"]:
                addr += f" ({act['venue']})"
            if len(addr) > 27:
                addr = addr[:26] + "…"
            c.drawString(col_x + 8, card_y + 4, addr)

    # 5. Footer Line & Legend
    footer_y = 12
    c.setStrokeColor(STONE_300)
    c.setLineWidth(0.5)
    c.line(header_x, footer_y + 12, header_x + header_w, footer_y + 12)

    c.setFillColor(STONE_600)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(header_x, footer_y + 2, "RED BADGES = STAGE NUMBERS (MATCH SIGNS AT PORCHES)")

    c.setFont("Helvetica", 7)
    c.drawCentredString(width / 2, footer_y + 2, "Interactive GPS Map, Hourly Schedule & Volunteer Shifts: senoiaporchfest.org")
    c.drawRightString(header_x + header_w, footer_y + 2, "Presented by the Senoia Downtown Development Authority (DDA)")

    c.save()
    print(f"PDF successfully generated at: {output_path}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    target_pdf = os.path.join(project_root, 'public', 'senoia-porchfest-2026-lineup-card.pdf')
    generate_pdf(target_pdf)
