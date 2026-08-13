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

# Self-funded English GIS / geodesy masters + NAWA watch row.
# Compiled 13 Aug 2026. Pakistan is not on Banach NAWA 2026 country list.
PROGRAMMES = [
    {
        "slug": "agh-remote-sensing-geo-informatics",
        "acronym": "AGH-RSGI",
        "name": "Remote Sensing and Geo Informatics",
        "official_title": "MSc Remote Sensing and Geo Informatics",
        "priority": "A",
        "coordinator": "AGH University of Krakow — Faculty of Geo-Data Science, Geodesy and Environmental Engineering",
        "countries": ["Poland"],
        "duration": "24 months / 4 semesters",
        "website": "https://www.international.agh.edu.pl/en/studies/education-offer-master-studies",
        "apply_url": "https://www.international.agh.edu.pl/en/studies/education-offer-master-studies",
        "fit_notes": "Best English GIS match in Poland: Sentinel/Copernicus, Python for RS, time series, ML, geo-tools, hazards, urban/environment. Accepts a bachelor (licencjat), not only an engineer. Closest to your BS GIS + Forest Dept + NESPAK web GIS.",
        "opens": "2026-06-01",
        "scholarship": None,
        "self_funded": "2026-09-15",
        "starts": "2026-10-01",
        "date_status": "expected",
        "scholarships": False,
        "funding_scheme": "self_funded",
        "extra": {
            "apply": "YES if 2026/27 second round is still open — confirm this week",
            "target_start": "1 October 2026 (next cycle October 2027)",
            "opens_text": "Summer recruitment: June–September. Last year’s second round ran late July to early September, with an online entrance exam.",
            "deadline_text": "EXPECTED mid-September 2026 for October 2026 start. Confirm dates with international.students@agh.edu.pl. Next intake is summer 2027.",
            "tuition_text": "€1,650 / semester · €6,600 total (~Rs 21 lac). First year €3,300 (~Rs 11 lac).",
            "self_funded_text": "Self-funded. Islamabad visa usually wants first-year tuition paid or funds shown, plus living money. No German blocked account.",
            "scholarships_text": "No EMJM/DAAD on this degree. AGH may offer rare fee waivers — ask international office. Banach NAWA 2026 did not include Pakistan.",
            "prepare": "Online entrance exam (image processing, NDVI, map scale, stats, Python/GIS basics). IELTS/B2 English. Legalised degree + transcript. Application fee ~PLN 100.",
            "watch_outs": "Kraków living is the expensive part (~Rs 50 lac over 24 months), not the tuition. Exam is real — they publish topics.",
            "last_checked": "13 Aug 2026",
        },
    },
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
    {
        "slug": "wut-mobile-mapping-navigation",
        "acronym": "WUT-MMNS",
        "name": "Mobile Mapping and Navigation Systems",
        "official_title": "MSc Geodesy and Cartography — Mobile Mapping and Navigation Systems",
        "priority": "B",
        "coordinator": "Warsaw University of Technology — Faculty of Geodesy and Cartography",
        "countries": ["Poland"],
        "duration": "18 months / 3 semesters",
        "website": "https://zk.gik.pw.edu.pl/mmns",
        "apply_url": "https://www.students.pw.edu.pl/index.php/Studies-Offer/M.Sc.-offer",
        "fit_notes": "GNSS/INS, UAV and mobile mapping, location-based services. Strong tech; weaker classic GIS/web GIS than AGH. Oldest geodesy faculty in Poland. February start — useful if you miss October 2026.",
        "opens": "2026-11-01",
        "scholarship": None,
        "self_funded": "2027-01-15",
        "starts": "2027-02-01",
        "date_status": "expected",
        "scholarships": False,
        "funding_scheme": "self_funded",
        "extra": {
            "apply": "Watch — February 2027 start",
            "target_start": "February 2027",
            "opens_text": "WUT 2026/27 MSc offer lists this specialisation with a February start. Confirm the exact foreign-student window on students.pw.edu.pl.",
            "deadline_text": "EXPECTED January 2027. Recheck the WUT International Students Office.",
            "tuition_text": "€1,800 / semester · €5,400 total (~Rs 17 lac) for 3 semesters.",
            "self_funded_text": "Self-funded. Warsaw living is at the high end of Poland.",
            "scholarships_text": "No EMJM. Banach NAWA 2026 did not include Pakistan.",
            "prepare": "Often wants first-cycle geodesy/cartography/geoinformatics with ~210 ECTS. Your 4-year BS GIS may need individual assessment.",
            "watch_outs": "More surveying/navigation than environmental GIS. Shorter (1.5 years) so less time to earn later fees.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "uwm-geodesy-geoinformatics",
        "acronym": "UWM-GiK",
        "name": "Geodesy and Geoinformatics",
        "official_title": "MSc Geodesy and Cartography — Geodesy and Geoinformatics",
        "priority": "B",
        "coordinator": "University of Warmia and Mazury in Olsztyn — Faculty of Geoengineering",
        "countries": ["Poland"],
        "duration": "18 months / 3 semesters",
        "website": "https://irk.uwm.edu.pl/pl/offer/REK_25_26_OBCE/programme/08_SMU_GiK_ANG/?from=field%3A08",
        "apply_url": "https://irk.uwm.edu.pl/pl/offer/REK_25_26_OBCE/programme/08_SMU_GiK_ANG/?from=field%3A08",
        "fit_notes": "Historic geoengineering faculty. GNSS, satellite RS, GIS programming, web/mobile GIS. More surveyor than environmental GIS. Cheapest tuition; smaller city.",
        "opens": "2026-06-01",
        "scholarship": None,
        "self_funded": "2026-09-15",
        "starts": "2026-10-01",
        "date_status": "expected",
        "scholarships": False,
        "funding_scheme": "self_funded",
        "extra": {
            "apply": "Optional cheap public option",
            "target_start": "October 2026 / next winter cycle",
            "opens_text": "Foreign-student IRK rounds. Confirm the current English GiK window on irk.uwm.edu.pl.",
            "deadline_text": "EXPECTED September 2026. Recheck UWM IRK.",
            "tuition_text": "5,000 PLN / semester · 15,000 PLN total (~Rs 11 lac) for 3 semesters.",
            "self_funded_text": "Self-funded. Lowest tuition; Olsztyn living is cheaper than Kraków/Warsaw.",
            "scholarships_text": "No EMJM. Banach NAWA 2026 did not include Pakistan.",
            "prepare": "English B2. Related bachelor (geodesy, geoinformatics, geography). Some tracks expect an engineer-style first degree.",
            "watch_outs": "Weaker web-GIS/story than AGH. Use if budget is the constraint.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "pwr-geodesy-cartography",
        "acronym": "PWr-GiK",
        "name": "Geodesy and Cartography",
        "official_title": "MSc Geodesy and Cartography (English) / Geomatics for Mineral Resources",
        "priority": "B",
        "coordinator": "Wrocław University of Science and Technology — Faculty of Geoengineering, Mining and Geology",
        "countries": ["Poland"],
        "duration": "18–24 months",
        "website": "https://wggg.pwr.edu.pl/en/candidates/msc-studies/geodesy-and-cartography",
        "apply_url": "https://wggg.pwr.edu.pl/en/candidates/msc-studies/geodesy-and-cartography",
        "fit_notes": "Spatial data, GIS, remote sensing, ML. Mining geomatics track can include a double degree with Freiberg (DE) or Leoben (AT) — extra cost if you go abroad.",
        "opens": "2026-06-01",
        "scholarship": None,
        "self_funded": "2026-09-15",
        "starts": "2026-10-01",
        "date_status": "expected",
        "scholarships": False,
        "funding_scheme": "self_funded",
        "extra": {
            "apply": "Yes if you want Wrocław + possible DE/AT semester",
            "target_start": "October 2026",
            "opens_text": "Winter intake via PWr IRK. Confirm the English Geodesy and Cartography round.",
            "deadline_text": "EXPECTED September 2026. Recheck admission@pwr.edu.pl.",
            "tuition_text": "About €2,000 / semester (non-EU). Confirm the 2026/27 table. Double-degree semesters abroad add cost.",
            "self_funded_text": "Self-funded. EU students often pay nothing; you do not.",
            "scholarships_text": "No EMJM on this national degree. Banach NAWA 2026 did not include Pakistan.",
            "prepare": "Bachelor in geodesy, mining/geology, or related engineering. IELTS 6.5 / TOEFL iBT 87 listed on older Go Poland pages.",
            "watch_outs": "Mining flavour on the geomatics specialisation. Confirm which English track is actually running this year.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "nawa-banach",
        "acronym": "NAWA",
        "name": "Banach NAWA scholarship (Poland master’s)",
        "official_title": "Stefan Banach NAWA Programme — second-cycle studies in Poland",
        "priority": "C",
        "coordinator": "Polish National Agency for Academic Exchange (NAWA)",
        "countries": ["Poland"],
        "duration": "Master’s + optional preparatory year",
        "website": "https://nawa.gov.pl/en/",
        "apply_url": "https://programs.nawa.gov.pl/login",
        "fit_notes": "The Polish government master’s scholarship that can fund a public GIS degree. Separate from university admission. Pakistan was not on the 36-country list for the 2026/27 call (closed 8 May 2026).",
        "opens": None,
        "scholarship": None,
        "self_funded": None,
        "starts": "2027-10-01",
        "date_status": "expected",
        "scholarships": True,
        "funding_scheme": "nawa",
        "extra": {
            "apply": "NO for 2026/27 — Pakistan not listed. Watch the 2027 call.",
            "target_start": "October 2027 if Pakistan is added",
            "opens_text": "2026 call: 13 Apr–8 May 2026 (closed). Next call typically spring, for the following winter semester.",
            "deadline_text": "2026/27 closed. EXPECTED spring 2027 for 2027/28 — only if Pakistan appears on that year’s country list.",
            "tuition_text": "If awarded: NAWA stipend + studies at a public university. If not awarded: pay the university fees above.",
            "self_funded_text": "This row is the scholarship, not a degree. You still apply to AGH/PULS/etc. separately.",
            "scholarships_text": "Pakistan not eligible in 2026 (groups included India but not Pakistan). Recheck nawa.gov.pl when the 2027 announcement is published.",
            "prepare": "If a future call includes Pakistan: NAWA portal + university admission proof, English B2, bachelor not older than the call allows.",
            "watch_outs": "Do not treat NAWA as an open GIS scholarship this year. Do not mix this with EMJM or DAAD EPOS.",
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
        extra["source"] = "AGH / PULS / WUT / UWM / PWr / NAWA pages, 13 Aug 2026"
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
