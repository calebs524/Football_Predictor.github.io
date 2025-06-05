import os
import requests
from bs4 import BeautifulSoup

# Map city/team names to single name (can adjust for accuracy)
team_name_map = {
    "Arizona Cardinals": "Cardinals",
    "Atlanta Falcons": "Falcons",
    "Baltimore Ravens": "Ravens",
    "Buffalo Bills": "Bills",
    "Carolina Panthers": "Panthers",
    "Chicago Bears": "Bears",
    "Cincinnati Bengals": "Bengals",
    "Cleveland Browns": "Browns",
    "Dallas Cowboys": "Cowboys",
    "Denver Broncos": "Broncos",
    "Detroit Lions": "Lions",
    "Green Bay Packers": "Packers",
    "Houston Texans": "Texans",
    "Indianapolis Colts": "Colts",
    "Jacksonville Jaguars": "Jaguars",
    "Kansas City Chiefs": "Chiefs",
    "Las Vegas Raiders": "Raiders",
    "Los Angeles Chargers": "Chargers",
    "Los Angeles Rams": "Rams",
    "Miami Dolphins": "Dolphins",
    "Minnesota Vikings": "Vikings",
    "New England Patriots": "Patriots",
    "New Orleans Saints": "Saints",
    "New York Giants": "Giants",
    "New York Jets": "Jets",
    "Philadelphia Eagles": "Eagles",
    "Pittsburgh Steelers": "Steelers",
    "San Francisco 49ers": "49ers",
    "Seattle Seahawks": "Seahawks",
    "Tampa Bay Buccaneers": "Buccaneers",
    "Tennessee Titans": "Titans",
    "Washington Commanders": "Commanders",
}

url = "https://loodibee.com/nfl/"
resp = requests.get(url)
soup = BeautifulSoup(resp.text, "html.parser")

if not os.path.exists("logos"):
    os.makedirs("logos")

img_tags = soup.find_all('img', class_='size-medium')
print(len(img_tags))
for img in img_tags:
    alt = img.get("alt", "")
    src = img.get("src", "")
    if (src.endswith(".png")):
        img_url = src
        if not img_url.startswith("http"):
            img_url = "https://loodibee.com" + img_url
        # Map alt to short team name
        team_full = None
        for full_name in team_name_map:
            if full_name in alt:
                team_full = full_name
                break
        if team_full:
            short_name = team_name_map[team_full]
            out_path = f"logos/{short_name}.png"
        else:
            # fallback: use last word before "logo"
            out_path = f"logos/{alt.split()[1]}.png"
        print(f"Downloading: {img_url} --> {out_path}")
        img_data = requests.get(img_url).content
        with open(out_path, "wb") as f:
            f.write(img_data)
    else:
        print(f"Skipping (not a .png logo): {src}")
