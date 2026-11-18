"""Import GIS-relevant Polish public master's programmes. Idempotent by slug."""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILES = [ROOT / ".env.local", ROOT / ".env.import"]
CYCLE_LABEL = "2026/27 intake"

# Poznań Geoinformation and Spatial Management. The current degree.
PROGRAMMES = [
    {
        "slug": "puls-geoinformation-spatial-management",
        "acronym": "PULS-GEO",
        "name": "Geoinformation and Spatial Management",
        "official_title": "MSc Geoinformation and Spatial Management",
        "priority": "A-",
        "coordinator": "Poznań University of Life Sciences — Faculty of Environmental and Mechanical Engineering",
        "countries": ["Poland"],
        "duration": "24 months / 4 semesters",
        "website": "https://wisim.up.poznan.pl/wydzial/study-english/msc/msc-geo",
        "apply_url": "https://wisim.up.poznan.pl/wydzial/study-english/msc/msc-geo",
        "fit_notes": "GIS + Earth observation for environment, UAV campaigns, spatial planning, urban/rural sustainability. Cheapest English GIS-shaped master’s. Fits Forest Dept / Lahore water-environment better than pure surveying.",
        "opens": "2026-06-01",
        "scholarship": None,
        "self_funded": "2026-09-15",
        "starts": "2026-10-01",
        "date_status": "expected",
        "scholarships": False,
        "funding_scheme": "self_funded",
        "extra": {
            "apply": "YES — cheapest public GIS option if 2026/27 is still recruiting",
            "target_start": "October 2026 (next cycle October 2027)",
            "opens_text": "Winter semester start. Confirm the 2026/27 foreign-student deadline on the faculty site.",
            "deadline_text": "EXPECTED September 2026 for October start. Recheck wisim.up.poznan.pl.",
            "tuition_text": "€4,200 total (~Rs 13.6 lac). €1,100 × 3 semesters + €900. Enrolment fee €65 (non-EU).",
            "self_funded_text": "Self-funded. Best tuition-to-fit ratio if you only pay year 1 now (~€2,200 / ~Rs 7 lac) plus visa show-money.",
            "scholarships_text": "No built-in EM scholarship. Banach NAWA 2026 country list did not include Pakistan.",
            "prepare": "BSc in GIS, geography, environment, spatial management, or related. English B2. Entry: environmental protection / engineering / geography listed as typical.",
            "watch_outs": "Less ‘pure GIS/web GIS’ than AGH. Poznań living is cheaper than Kraków/Warsaw.",
            "last_checked": "13 Aug 2026",
        },
    },
]


class Supabase:
    def __init__(self, url: str, key: str) -> None:
        self.base = url.rstrip("/") + "/rest/v1"
        self.key = key

    def request(self, method: str, path: str, payload=None, params: dict | None = None):
        qs = f"?{urllib.parse.urlencode(params, doseq=True)}" if params else ""
        req = urllib.request.Request(
            self.base + path + qs,
            data=None if payload is None else json.dumps(payload).encode(),
            method=method,
            headers={
                "apikey": self.key,
                "Authorization": f"Bearer {self.key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as res:
                raw = res.read().decode()
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as exc:
            body = exc.read().decode()
            raise SystemExit(f"{method} {path} failed {exc.code}: {body}") from exc

    def get(self, path: str, params: dict) -> list:
        return self.request("GET", path, params=params) or []

    def post(self, path: str, payload: dict) -> dict:
        rows = self.request("POST", path, payload)
        return rows[0]

    def patch(self, path: str, params: dict, payload: dict) -> dict:
        rows = self.request("PATCH", path, payload, params)
        return rows[0]


def load_env() -> dict[str, str]:
    values: dict[str, str] = {}
    for env_file in ENV_FILES:
        if not env_file.exists():
            continue
        for line in env_file.read_text(encoding="utf-8").splitlines():
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            values[key.strip()] = val.strip().strip('"').strip("'")
    values.update({k: v for k, v in os.environ.items() if v})
    return values


def main() -> None:
    env = load_env()
    url = env.get("VITE_SUPABASE_URL") or env.get("SUPABASE_URL")
    key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("Need VITE_SUPABASE_URL in .env.local and SUPABASE_SERVICE_ROLE_KEY in the environment.")

    db = Supabase(url, key)
    cats = db.get(
        "/catalogues",
        {"slug": "eq.poland", "owner_user_id": "is.null", "select": "id,slug,name"},
    )
    description = (
        "Public Polish GIS / geodesy master’s in English. These degrees are self-funded "
        "(tuition listed on each card). Banach NAWA is a separate scholarship and Pakistan "
        "was not eligible in 2026/27. No German blocked account; Islamabad still wants "
        "proof of funds + usually first-year tuition."
    )
    if not cats:
        cat = db.post(
            "/catalogues",
            {
                "owner_user_id": None,
                "slug": "poland",
                "name": "Poland (self-funded)",
                "description": description,
                "is_system": True,
            },
        )
        catalogue_id = cat["id"]
        print("Created Poland catalogue", flush=True)
    else:
        catalogue_id = cats[0]["id"]
        db.patch("/catalogues", {"id": f"eq.{catalogue_id}"}, {"description": description, "name": "Poland (self-funded)"})

    existing = {
        row["slug"]: row
        for row in db.get(
            "/programmes",
            {"catalogue_id": f"eq.{catalogue_id}", "select": "id,slug,acronym"},
        )
        if row.get("slug")
    }

    print(f"Catalogue {catalogue_id}", flush=True)
    imported = 0
    for rec in PROGRAMMES:
        extra = dict(rec["extra"])
        extra["source"] = "AGH / PULS / UWM / PWr / NAWA pages, 13 Aug 2026"
        extra["funding_scheme"] = rec["funding_scheme"]
        extra["work_years_required"] = False
        payload = {
            "catalogue_id": catalogue_id,
            "slug": rec["slug"],
            "acronym": rec["acronym"],
            "name": rec["name"],
            "official_title": rec["official_title"],
            "coordinator": rec["coordinator"],
            "consortium": rec["coordinator"],
            "countries": rec["countries"],
            "duration": rec["duration"],
            "language": "English",
            "website": rec["website"],
            "apply_url": rec["apply_url"],
            "degree_level": "masters",
            "priority": rec["priority"],
            "fit_notes": rec["fit_notes"],
            "extra": extra,
        }
        if rec["slug"] in existing:
            prog = db.patch("/programmes", {"id": f"eq.{existing[rec['slug']]['id']}"}, payload)
        else:
            prog = db.post("/programmes", payload)
            existing[rec["slug"]] = prog
        programme_id = prog["id"]

        cycles = db.get(
            "/programme_cycles",
            {"programme_id": f"eq.{programme_id}", "label": f"eq.{CYCLE_LABEL}", "select": "id"},
        )
        extra = rec["extra"]
        cycle_payload = {
            "programme_id": programme_id,
            "label": CYCLE_LABEL,
            "starts_on": rec.get("starts"),
            "application_opens_on": rec.get("opens"),
            "scholarship_deadline": rec.get("scholarship"),
            "self_funded_deadline": rec.get("self_funded"),
            "date_status": rec["date_status"],
            "scholarships_available": rec["scholarships"],
            "extra_dates": {
                "opens_text": extra.get("opens_text"),
                "deadline_text": extra.get("deadline_text"),
                "self_funded_text": extra.get("self_funded_text"),
                "target_start": extra.get("target_start"),
            },
        }
        if cycles:
            db.patch("/programme_cycles", {"id": f"eq.{cycles[0]['id']}"}, cycle_payload)
        else:
            db.post("/programme_cycles", cycle_payload)
        imported += 1
        print(f"  {rec['acronym']:12} {rec['funding_scheme']:12} {rec.get('self_funded') or rec.get('scholarship')}", flush=True)

    print(f"Imported {imported} Poland programmes", flush=True)


if __name__ == "__main__":
    main()
