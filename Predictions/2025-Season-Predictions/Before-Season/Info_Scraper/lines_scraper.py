import requests
import json
import csv
from bs4 import BeautifulSoup


def fetch_page(url: str) -> BeautifulSoup:
    resp = requests.get(url)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, 'html.parser')


def parse_afc_data(soup: BeautifulSoup) -> list[dict]:
    teams_data = []
    content_blocks = soup.find_all('div', class_='nfl-o-ranked-item__content')

    for block in content_blocks:
        title_tag = block.find('a', title=True)
        team_name = title_tag.get('title') if title_tag else "Unknown"

        # The next sibling after the ranked-item is the block with <ul> list
        ul_tag = block.find_next('ul')
        if not ul_tag:
            continue

        items = ul_tag.find_all('li')
        if len(items) < 5:
            continue

        def parse_line(line):
            text = line.get_text(strip=True)
            return text.split(':')[-1].strip()

        try:
            data = {
                "team": team_name,
                "win_total": parse_line(items[0]),
                "make_playoffs": items[1].get_text(strip=True).split(':')[-1].strip(),
                "win_division": items[2].get_text(strip=True).split(':')[-1].strip(),
                "win_conference": items[3].get_text(strip=True).split(':')[-1].strip(),
                "win_super_bowl": items[4].get_text(strip=True).split(':')[-1].strip(),
            }
            teams_data.append(data)
        except Exception:
            continue

    return teams_data


def save_json(data: list[dict], filename: str):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


def save_csv(data: list[dict], filename: str):
    if not data:
        return
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)


def main():
    url = "https://www.nfl.com/news/nfl-schedule-each-nfc-team-s-win-total-projection-for-2025-season"
    soup = fetch_page(url)
    afc_teams = parse_afc_data(soup)
    save_json(afc_teams, "nfc_2025.json")
    save_csv(afc_teams, "nfc_2025.csv")
    print(f"✅ Scraped {len(afc_teams)} NFC teams. Files saved.")


if __name__ == '__main__':
    main()
