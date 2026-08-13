"""Import GIS-relevant DAAD EPOS programmes (2027/28 intake). Idempotent by slug."""

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
CYCLE_LABEL = "2027/28 intake"

# Apply to the course, not to DAAD. Max 3 EPOS courses. Pakistan is eligible.
# Compiled 13 Aug 2026 from DAAD EPOS list + course sites.
PROGRAMMES = [
    {
        "slug": "photogrammetry-geoinformatics",
        "acronym": "P&G",
        "name": "Photogrammetry and Geoinformatics",
        "official_title": "M.Sc. Photogrammetry and Geoinformatics",
        "priority": "A",
        "coordinator": "Hochschule für Technik Stuttgart (HfT Stuttgart)",
        "countries": ["Germany"],
        "duration": "18 months / 3 semesters",
        "website": "https://www.hft-stuttgart.com/geomatics/master-photogrammetry-and-geoinformatics",
        "apply_url": "https://www.hft-stuttgart.com/geomatics/master-photogrammetry-and-geoinformatics",
        "fit_notes": "Closest DAAD GIS degree: photogrammetry, remote sensing, GIS, mapping, forestry/agriculture/urban planning geodata. Matches BS GIS, Forest Dept, NESPAK web GIS. IELTS 6.0 or TOEFL iBT 80.",
        "opens": "2026-07-15",
        "scholarship": "2026-10-15",
        "self_funded": "2027-02-28",
        "starts": "2027-10-01",
        "date_status": "confirmed",
        "scholarships": True,
        "extra": {
            "apply": "YES — first (DAAD EPOS, max 3 courses)",
            "target_start": "October 2027",
            "opens_text": "CONFIRMED: combined DAAD + course application opened 15 July 2026.",
            "deadline_text": "CONFIRMED 15 October 2026 for DAAD EPOS + study place. Self-funded non-EU: 28 February 2027.",
            "self_funded_text": "28 February 2027 (non-EU). EU self-funded later block to 15 July 2027.",
            "scholarships_text": "Yes — DAAD EPOS. Apply on the HfT site with the DAAD form attached. Do not send the file to DAAD.",
            "prepare": "DAAD EPOS form + HfT course form. IELTS 6.0 / TOEFL 80. CV. Two years of documented work after the bachelor is the EPOS rule — NESPAK + freelance must be certified to the day.",
            "watch_outs": "EPOS allows at most three courses and needs ~2 years of postgraduate work. You graduate 2025; NESPAK from Oct 2025 is about 12 months by this deadline. Count Upwork only if you have employer-style certificates. Strongest GIS fit on the DAAD list.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "georisk-bonn",
        "acronym": "GeoRisk",
        "name": "Geography of Environmental Risks and Human Security",
        "official_title": "Joint M.Sc. Geography of Environmental Risks and Human Security",
        "priority": "A-",
        "coordinator": "University of Bonn (GIUB) and United Nations University UNU-EHS",
        "countries": ["Germany"],
        "duration": "24 months / 120 ECTS",
        "website": "https://unu.edu/ehs/learning/msc-geography-environmental-risks-and-human-security",
        "apply_url": "https://unu.edu/ehs/learning/msc-geography-environmental-risks-and-human-security",
        "fit_notes": "GIS and remote sensing inside a risk/vulnerability/climate programme. Lahore urban risk, water, and Forest Dept land cover are usable stories. Not an engineering degree — they reject pure engineering profiles.",
        "opens": "2026-07-31",
        "scholarship": "2026-10-31",
        "starts": "2027-10-01",
        "date_status": "expected",
        "scholarships": True,
        "extra": {
            "apply": "YES — if window is confirmed",
            "target_start": "October 2027",
            "opens_text": "Site: 31 July to 31 October 2026 (to be confirmed). Recheck unu.edu/ehs before sending.",
            "deadline_text": "EXPECTED 31 October 2026, 23:59 CET. Email one PDF to master-georisk@ehs.unu.edu plus an academic writing sample.",
            "scholarships_text": "Yes — DAAD EPOS. Attach DAAD checklist, DAAD form, professional reference, and work certificates.",
            "prepare": "Online form + PDF pack. IELTS 6.5. Europass CV. Motivation + separate EPOS motivation. Academic essay (max 1000 words, no AI). Two years of work after bachelor.",
            "watch_outs": "Window labelled to be confirmed. Not for engineering-only CVs. EPOS wants a practitioner career, not a PhD track. Same 2-year work rule as other EPOS courses.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "iwrm-koeln",
        "acronym": "IWRM",
        "name": "Integrated Water Resources Management",
        "official_title": "M.Sc. Integrated Water Resources Management (ITT, TH Köln)",
        "priority": "A-",
        "coordinator": "TH Köln — Institute for Technology and Resources Management in the Tropics and Subtropics (ITT)",
        "countries": ["Germany"],
        "duration": "24 months / 120 ECTS",
        "website": "https://www.th-koeln.de/en/spatial-development-and-infrastructure-systems/scholarships_108947.php",
        "apply_url": "https://www.th-koeln.de/en/spatial-development-and-infrastructure-systems/application-daad-epos-scholarship_104325.php",
        "fit_notes": "Water management with spatial tools. Thesis (Lahore WASA / WQI) is the hook; GIS supports hydrology rather than being the degree.",
        "opens": "2026-08-01",
        "scholarship": "2026-09-30",
        "starts": "2027-09-01",
        "date_status": "confirmed",
        "scholarships": True,
        "extra": {
            "apply": "YES — window is open now",
            "target_start": "Winter 2027/28",
            "opens_text": "CONFIRMED annual window: 1 August–30 September of the year before enrolment.",
            "deadline_text": "CONFIRMED 30 September 2026. Email one PDF to application-daad@th-koeln.de named IWRM_PK_Last_First.pdf.",
            "self_funded_text": "Self-funded foreign bachelor: uni-assist 1 February–31 March 2027 for the same winter start.",
            "scholarships_text": "Yes — DAAD EPOS. Choose IWRM on the TH Köln DAAD form. You may also tick NRM as a second EPOS choice (still max three EPOS courses overall).",
            "prepare": "DAAD form, checklist, research idea, IELTS, work certificates. This deadline is earlier than Stuttgart — finish the pack in September.",
            "watch_outs": "Not a GIS master. Same 2-year EPOS work rule. Do not confuse with IWRM-MENA (Jordan semester; aimed at MENA).",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "nrm-koeln",
        "acronym": "NRM",
        "name": "Natural Resources Management and Development",
        "official_title": "M.Sc. Natural Resources Management and Development (ITT, TH Köln)",
        "priority": "B",
        "coordinator": "TH Köln — ITT",
        "countries": ["Germany"],
        "duration": "24 months / 120 ECTS",
        "website": "https://www.th-koeln.de/en/spatial-development-and-infrastructure-systems/scholarships_108947.php",
        "apply_url": "https://www.th-koeln.de/en/spatial-development-and-infrastructure-systems/application-daad-epos-scholarship_104325.php",
        "fit_notes": "Natural resources, land, and development. Forest Dept GIS / LULC is the relevant proof. GIS is a tool, not the core.",
        "opens": "2026-08-01",
        "scholarship": "2026-09-30",
        "starts": "2027-09-01",
        "date_status": "confirmed",
        "scholarships": True,
        "extra": {
            "apply": "Yes if you want a second TH Köln EPOS option",
            "target_start": "Winter 2027/28",
            "opens_text": "Same window as IWRM: 1 August–30 September 2026.",
            "deadline_text": "CONFIRMED 30 September 2026. File name NRM_PK_Last_First.pdf to application-daad@th-koeln.de.",
            "scholarships_text": "Yes — DAAD EPOS. Same portal as IWRM/REM; pick NRM.",
            "prepare": "Same DAAD pack as IWRM. Motivation must be resources/forest, not photogrammetry.",
            "watch_outs": "Weaker GIS than Stuttgart P&G. Counts as one of your three EPOS applications.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "watenv",
        "acronym": "WATENV",
        "name": "Water Resources and Environmental Management",
        "official_title": "M.Sc. Water Resources and Environmental Management (WATENV)",
        "priority": "A-",
        "coordinator": "Leibniz University Hannover — Institute of Hydrology and Water Resources Management",
        "countries": ["Germany"],
        "duration": "24 months",
        "website": "https://www.fbg.uni-hannover.de/de/studium/studienangebot-der-fakultaet/water-resources-and-environmental-management-watenv/applications",
        "apply_url": "https://www.fbg.uni-hannover.de/de/studium/studienangebot-der-fakultaet/water-resources-and-environmental-management-watenv/applications",
        "fit_notes": "Hydrology, modelling, environmental data. Thesis methods (WQI, geostatistics) help; the degree is water engineering more than GIS. They prefer civil/environmental engineers or related sciences with water-sector work.",
        "opens": None,
        "scholarship": "2026-09-30",
        "self_funded": "2027-01-15",
        "starts": "2027-10-01",
        "date_status": "confirmed",
        "scholarships": True,
        "extra": {
            "apply": "YES — if you can show water-sector work",
            "target_start": "October 2027",
            "opens_text": "Send the DAAD pack to the WATENV office; no public open-date beyond the deadline.",
            "deadline_text": "CONFIRMED 30 September 2026 to watenv@iww.uni-hannover.de for DAAD. Also apply online to the university by 15 January 2027.",
            "self_funded_text": "University place: 15 January 2027.",
            "scholarships_text": "Yes — DAAD EPOS. English C1 required (stricter than Stuttgart).",
            "prepare": "DAAD pack to the WATENV email plus the university online form later. IELTS/TOEFL at C1.",
            "watch_outs": "Engineering flavour. GIS-only CV is a weaker match than P&G. EPOS 2-year work rule still applies.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "trophee",
        "acronym": "TropHEE",
        "name": "Tropical Hydrogeology and Environmental Engineering",
        "official_title": "M.Sc. Tropical Hydrogeology and Environmental Engineering (TropHEE)",
        "priority": "A-",
        "coordinator": "TU Darmstadt — Institute of Applied Geosciences",
        "countries": ["Germany"],
        "duration": "24 months",
        "website": "https://www.geo.tu-darmstadt.de/studium_iag/im_studium_iag/index~4.en.jsp",
        "apply_url": "https://www.geo.tu-darmstadt.de/studium_iag/im_studium_iag/index~4.en.jsp",
        "fit_notes": "Groundwater and hydrogeology in the tropics/subtropics. Strongest DAAD match to the Lahore WASA / WQI thesis. GIS supports the science; it is not a geoinformatics degree.",
        "opens": None,
        "scholarship": "2026-11-30",
        "starts": "2027-10-01",
        "date_status": "confirmed",
        "scholarships": True,
        "extra": {
            "apply": "YES — water story",
            "target_start": "Winter 2027/28",
            "opens_text": "TU Darmstadt: apply now for DAAD 2027/28.",
            "deadline_text": "CONFIRMED 30 November 2026 for DAAD scholarship (start winter 2027/28).",
            "scholarships_text": "Yes — DAAD EPOS. Follow the TropHEE scholarship page from the institute site.",
            "prepare": "Lead with thesis methods (Entropy WQI, kriging), not a crisis narrative. Two years of work certificates if you want EPOS.",
            "watch_outs": "More geology/hydrogeology than GIS. Later deadline than Köln/Hannover — still prepare the pack in September so you can reuse it.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "tropical-forestry",
        "acronym": "TropFor",
        "name": "Tropical Forestry",
        "official_title": "M.Sc. Tropical Forestry",
        "priority": "B",
        "coordinator": "TU Dresden — Institute of International Forestry and Forest Products",
        "countries": ["Germany"],
        "duration": "24 months",
        "website": "https://tu-dresden.de/bu/umwelt/forst/inter/tropen",
        "apply_url": "https://tu-dresden.de/bu/umwelt/forst/inter/tropen",
        "fit_notes": "Forest management in the tropics. Punjab Forest Department GIS internship is the hook. Remote sensing/GIS used; the degree is forestry.",
        "opens": None,
        "scholarship": "2026-10-30",
        "starts": "2027-10-01",
        "date_status": "expected",
        "scholarships": True,
        "extra": {
            "apply": "Yes — Forest Dept angle",
            "target_start": "October 2027",
            "opens_text": "Last cycle: DAAD via the Chair of Tropical Forestry online portal.",
            "deadline_text": "EXPECTED 30 October 2026 (last DAAD cycle was 30 Oct 2025). Confirm on the TU Dresden tropical forestry site.",
            "self_funded_text": "Last cycle: 30 May (non-EU) / 15 July (EU) via SELMA.",
            "scholarships_text": "Yes — DAAD EPOS.",
            "prepare": "Forest GIS / LULC evidence. IELTS 6.5. Same EPOS work-experience rule.",
            "watch_outs": "Not a GIS master. Keep P&G as the GIS core if you only have three EPOS slots.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "hydro-science-engineering",
        "acronym": "HSE",
        "name": "Hydro Science and Engineering",
        "official_title": "M.Sc. Hydro Science and Engineering",
        "priority": "B",
        "coordinator": "TU Dresden — Faculty of Environmental Sciences, Hydrosciences",
        "countries": ["Germany"],
        "duration": "24 months",
        "website": "https://tu-dresden.de/bu/umwelt/hydro/studium/hydro-science-and-engineering",
        "apply_url": "https://tu-dresden.de/bu/umwelt/hydro/studium/hydro-science-and-engineering",
        "fit_notes": "Hydrology and water engineering with modelling. Useful if you want water + quantitative methods; weaker GIS than Stuttgart.",
        "opens": None,
        "scholarship": "2026-10-15",
        "starts": "2027-10-01",
        "date_status": "expected",
        "scholarships": True,
        "extra": {
            "apply": "Optional water backup",
            "target_start": "October 2027",
            "deadline_text": "EXPECTED 15 October 2026 (last DAAD cycle 15 Oct 2025 at TU Dresden).",
            "scholarships_text": "Yes — DAAD EPOS. Professional experience is extra for the course but required for EPOS.",
            "prepare": "IELTS 6.5 (min 6.0 each band) or TOEFL iBT 100.",
            "watch_outs": "TOEFL 100 is high. Engineering-leaning. Confirm 2027 date on the HSE site.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "nhre",
        "acronym": "NHRE",
        "name": "Natural Hazards and Risks in Structural Engineering",
        "official_title": "M.Sc. Natural Hazards and Risks in Structural Engineering (NHRE)",
        "priority": "C",
        "coordinator": "Bauhaus-Universität Weimar — Faculty of Civil Engineering",
        "countries": ["Germany"],
        "duration": "24 months",
        "website": "https://www.uni-weimar.de/nhre",
        "apply_url": "https://www.uni-weimar.de/nhre",
        "fit_notes": "Structural / earthquake / hazard engineering. GIS is supporting. Weak match unless you want to pivot to civil engineering risk.",
        "opens": None,
        "scholarship": "2026-10-15",
        "starts": "2027-10-01",
        "date_status": "confirmed",
        "scholarships": True,
        "extra": {
            "apply": "Low GIS — skip if you are filling three stronger EPOS slots",
            "target_start": "1 October 2027",
            "deadline_text": "CONFIRMED pattern: 15 October of the year prior to start, plus Weimar online application.",
            "scholarships_text": "Yes — DAAD EPOS.",
            "prepare": "IELTS 6.5 (min 6.0 each band). Civil-engineering motivation.",
            "watch_outs": "Not a GIS programme. Do not use one of your three EPOS slots on this unless P&G/IWRM/GeoRisk are impossible.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "eagle",
        "acronym": "EAGLE",
        "name": "Applied Earth Observation and Geoanalysis",
        "official_title": "M.Sc. Applied Earth Observation and Geoanalysis (EAGLE)",
        "priority": "B",
        "coordinator": "University of Würzburg — Earth Observation Research Cluster",
        "countries": ["Germany"],
        "duration": "24 months / 120 ECTS",
        "website": "https://eagle-science.org/apply/",
        "apply_url": "https://eagle-science.org/apply/",
        "fit_notes": "Excellent EO + geoanalysis master (remote sensing, spatial modelling, environment). Not on the DAAD EPOS list — you apply to Würzburg. Not currently covered by a Pakistan-listed DAAD master’s scheme other than EPOS.",
        "opens": "2027-03-01",
        "scholarship": "2027-05-15",
        "starts": "2027-10-01",
        "date_status": "expected",
        "scholarships": False,
        "extra": {
            "apply": "Watch — next window May 2027 (not EPOS)",
            "target_start": "October 2027",
            "opens_text": "Annual aptitude procedure. 2026 winter deadline was 15 May 2026 (closed).",
            "deadline_text": "EXPECTED 15 May 2027 for October 2027 start. Confirm on eagle-science.org/apply.",
            "scholarships_text": "Not EPOS. DAAD Pakistan’s master’s list (Aug 2026) does not include Study Scholarships for all disciplines. Typical path: self-funded (blocked account) or another scholarship. Recheck daad.pk with origin Pakistan.",
            "prepare": "One PDF via their form. Interview after the deadline. Strong portfolio of maps/EO helps.",
            "watch_outs": "You cannot apply this month. Do not mix this with the three EPOS applications. Still the closest German EO degree after P&G. Do not treat the 31 Aug 2026 DAAD Pakistan deadline as an EAGLE or GIS master’s deadline — that date is for doctoral grants.",
            "last_checked": "13 Aug 2026",
        },
    },
    {
        "slug": "daad-study-scholarships-all",
        "acronym": "DAAD-SS",
        "name": "Study Scholarships — all disciplines (Pakistan check)",
        "official_title": "Study Scholarships - Master Studies for All Academic Disciplines",
        "priority": "C",
        "coordinator": "DAAD (country-specific; not an EPOS course)",
        "countries": ["Germany"],
        "duration": "10–24 months",
        "website": "https://www.daad.pk/en/find-funding/daad-scholarship-programmes-for-pakistan/",
        "apply_url": "https://www.daad.pk/en/find-funding/scholarship-database/",
        "fit_notes": "Would fund a German GIS master’s such as EAGLE with no two-year work rule — but only if DAAD lists it for origin Pakistan. Official daad.pk master’s list (13 Aug 2026): EPOS, Helmut-Schmidt, and architecture/arts study scholarships. GIS is not in those arts schemes.",
        "opens": None,
        "scholarship": None,
        "starts": "2027-10-01",
        "date_status": "expected",
        "scholarships": False,
        "extra": {
            "apply": "NO unless it appears for origin Pakistan",
            "target_start": "October 2027 (if ever listed)",
            "opens_text": "This scheme is open in some countries of origin via the DAAD portal. It is not on DAAD Pakistan’s master’s list as of 13 Aug 2026.",
            "deadline_text": "Not listed for Pakistani master’s applicants. The 31 Aug 2026 DAAD Pakistan deadline is for doctoral grants (stipa57135739), not a GIS master’s.",
            "scholarships_text": "Not currently offered to origin Pakistan according to daad.pk. Recheck the database with origin Pakistan + status Graduates + purpose Study.",
            "prepare": "If it later appears: DAAD portal, not the EPOS course form. No two-year work rule. You still need a German university place (e.g. EAGLE).",
            "watch_outs": "Do not apply to EPOS courses through this. Do not use the PhD 31 Aug date. Helmut-Schmidt (ended 31 Jul 2026) is public policy, not GIS.",
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
        {"slug": "eq.daad", "owner_user_id": "is.null", "select": "id,slug,name"},
    )
    if not cats:
        sys.exit("DAAD catalogue not found. Run 001_schema.sql first.")
    catalogue_id = cats[0]["id"]
    db.patch(
        "/catalogues",
        {"id": f"eq.{catalogue_id}"},
        {
            "description": (
                "Two DAAD tracks. EPOS: named development courses; apply to the university; "
                "needs two years’ work after the bachelor; max three courses. "
                "Not EPOS (e.g. EAGLE): no 2-year rule; DAAD Pakistan does not currently list "
                "Study Scholarships for all disciplines for GIS. Recheck daad.pk."
            )
        },
    )

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
        extra["source"] = "DAAD EPOS 2027/28 list + course websites + daad.pk, 13 Aug 2026"
        if rec["slug"] in ("eagle", "daad-study-scholarships-all"):
            extra["funding_scheme"] = "study_scholarship"
            extra["work_years_required"] = False
        else:
            extra["funding_scheme"] = "epos"
            extra["work_years_required"] = True
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
        print(f"  {rec['acronym']:10} {rec['date_status']:10} {rec.get('scholarship')}", flush=True)

    print(f"Imported {imported} DAAD programmes", flush=True)


if __name__ == "__main__":
    main()
