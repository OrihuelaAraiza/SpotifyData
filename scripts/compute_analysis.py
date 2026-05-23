"""
Computes pipeline stats, cluster-month assignments, Markov chains,
and ML data for the dashboard. Outputs dashboard/src/data/analysis.js
"""
import json
import csv
from collections import defaultdict
import numpy as np
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_summary(person_id):
    path = f"{BASE}/data/processed/{person_id}/spotify_summary.json"
    with open(path) as f:
        return json.load(f)

def load_sessions(person_id):
    path = f"{BASE}/data/processed/{person_id}/spotify_sessions.csv"
    rows = []
    with open(path) as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows

def load_monthly(person_id):
    path = f"{BASE}/data/processed/{person_id}/spotify_monthly_features.csv"
    rows = []
    with open(path) as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


# ── K-Means month assignment ─────────────────────────────────────────────────
def assign_months_to_clusters(monthly_rows, profiles, k=3):
    """Re-run simplified centroid assignment to get month→cluster map."""
    features = [
        "hours", "unique_artists", "unique_tracks", "skip_rate_pct",
        "night_ratio_pct", "top_artist_share_pct", "repeat_track_ratio_pct",
        "discovery_rate_pct"
    ]
    # Build centroid matrix from profiles
    centroids = []
    for p in sorted(profiles, key=lambda x: x["cluster"]):
        centroids.append([
            p["avg_hours"], p["avg_unique_artists"], p["avg_unique_tracks"],
            p["avg_skip_rate_pct"], p["avg_night_ratio_pct"],
            p["avg_top_artist_share_pct"], p["avg_repeat_track_ratio_pct"],
            p["avg_discovery_rate_pct"]
        ])
    centroids = np.array(centroids, dtype=float)

    result = []
    for row in monthly_rows:
        try:
            x = np.array([float(row[f]) for f in features])
        except (ValueError, KeyError):
            continue
        # Normalize the same way as training (z-score vs centroid range)
        dists = np.linalg.norm(centroids - x, axis=1)
        cluster = int(np.argmin(dists))
        result.append({"month": row["year_month"], "cluster": cluster,
                        "hours": round(float(row["hours"]), 2)})
    return result


# ── Markov chain on time blocks ───────────────────────────────────────────────
BLOCKS = ["madrugada", "manana", "tarde", "noche"]

def compute_markov(sessions):
    """Transition matrix between consecutive session time blocks."""
    counts = defaultdict(lambda: defaultdict(int))
    prev = None
    for s in sorted(sessions, key=lambda r: r["start_local"]):
        cur = s.get("time_block_start", "")
        if cur not in BLOCKS:
            continue
        if prev is not None:
            counts[prev][cur] += 1
        prev = cur

    # Build probability matrix
    matrix = {}
    for src in BLOCKS:
        total = sum(counts[src].values())
        if total == 0:
            matrix[src] = {dst: 0.0 for dst in BLOCKS}
        else:
            matrix[src] = {dst: round(counts[src][dst] / total, 4) for dst in BLOCKS}

    # Top transitions (sorted by probability, exclude self)
    top = []
    for src in BLOCKS:
        for dst in BLOCKS:
            if src != dst:
                top.append({"from": src, "to": dst, "prob": matrix[src][dst]})
    top.sort(key=lambda x: -x["prob"])

    return {"matrix": matrix, "top": top[:8]}


# ── Markov chain on weekdays ──────────────────────────────────────────────────
DAYS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
DAY_MAP = {"Lun":0,"Mar":1,"Mié":2,"Mie":2,"Jue":3,"Vie":4,"Sab":5,"Sáb":5,"Dom":6}

def compute_weekday_markov(sessions):
    counts = defaultdict(lambda: defaultdict(int))
    prev = None
    for s in sorted(sessions, key=lambda r: r["start_local"]):
        wd = s.get("weekday", "")
        cur = DAY_MAP.get(wd, None)
        if cur is None:
            continue
        if prev is not None:
            counts[prev][cur] += 1
        prev = cur

    matrix = {}
    for i, src in enumerate(DAYS_ES):
        total = sum(counts[i].values())
        if total == 0:
            matrix[src] = {dst: 0.0 for dst in DAYS_ES}
        else:
            matrix[src] = {dst: round(counts[i].get(j, 0) / total, 4)
                           for j, dst in enumerate(DAYS_ES)}
    return matrix


# ── Pipeline section metrics ─────────────────────────────────────────────────
def build_pipeline_meta(summary):
    meta = summary["metadata"]
    steps = [
        {
            "step": "Datos Raw",
            "description": f"{len(meta['rows_by_file'])} archivos JSON de Spotify",
            "records": meta["raw_rows"],
            "detail": f"{meta['audio_files']} archivos de audio · {meta.get('video_files',0)} de video"
        },
        {
            "step": "Deduplicación",
            "description": "Eliminación de registros exactamente duplicados",
            "records": meta["raw_rows"] - meta["exact_duplicates_removed"],
            "detail": f"−{meta['exact_duplicates_removed']:,} duplicados exactos eliminados"
        },
        {
            "step": "Colapso de streams",
            "description": "Streams partidos en múltiples registros reunidos en uno",
            "records": meta["raw_rows"] - meta["exact_duplicates_removed"] - meta["collapsed_rows_removed"],
            "detail": f"−{meta['collapsed_rows_removed']:,} filas colapsadas ({meta.get('collapsed_groups', '?')} grupos)"
        },
        {
            "step": "Dataset limpio",
            "description": "Registros finales disponibles para análisis",
            "records": meta["cleaned_rows"],
            "detail": f"Retención del {round(meta['cleaned_rows']/meta['raw_rows']*100, 1)}% de los datos originales"
        },
    ]
    return {
        "rawRows": meta["raw_rows"],
        "cleanedRows": meta["cleaned_rows"],
        "droppedRows": meta["raw_rows"] - meta["cleaned_rows"],
        "retentionPct": round(meta["cleaned_rows"] / meta["raw_rows"] * 100, 1),
        "audioFiles": meta["audio_files"],
        "steps": steps
    }


# ── Reason start/end distribution ────────────────────────────────────────────
def build_reason_data(summary):
    rs = summary.get("reason_start", {})
    re = summary.get("reason_end", {})
    label_map = {
        "fwdbtn": "Botón siguiente",
        "trackdone": "Canción terminó",
        "clickrow": "Clic manual",
        "backbtn": "Botón anterior",
        "playbtn": "Play directo",
        "appload": "Abrió la app",
        "remote": "Control remoto",
        "trackerror": "Error de track",
        "endplay": "Fin de cola",
        "unknown": "Desconocido"
    }
    starts = [{"reason": label_map.get(k, k), "count": v}
              for k, v in sorted(rs.items(), key=lambda x: -x[1]) if k != "unknown"][:7]
    ends   = [{"reason": label_map.get(k, k), "count": v}
              for k, v in sorted(re.items(), key=lambda x: -x[1]) if k != "unknown"][:7]
    return {"starts": starts, "ends": ends}


# ── ML section ────────────────────────────────────────────────────────────────
CLUSTER_NAMES_JP = {
    0: "Escucha Pasiva",
    1: "Modo Nostalgia",
    2: "Modo Intenso"
}
CLUSTER_NAMES_AR = {
    0: "Ritmo Constante",
    1: "Modo Selectivo",
    2: "Maratonista"
}

def build_ml(summary, cluster_names):
    cl = summary["ml"]["clustering"]
    sk = summary["ml"]["skip_classifier"]

    profiles = []
    for p in cl["profiles"]:
        c = p["cluster"]
        profiles.append({
            "cluster": c,
            "name": cluster_names[c],
            "months": p["months"],
            "avgHours": round(p["avg_hours"], 1),
            "avgArtists": round(p["avg_unique_artists"]),
            "avgTracks": round(p["avg_unique_tracks"]),
            "skipRate": round(p["avg_skip_rate_pct"], 1),
            "nightRatio": round(p["avg_night_ratio_pct"], 1),
            "topArtistShare": round(p["avg_top_artist_share_pct"], 1),
            "repeatRatio": round(p["avg_repeat_track_ratio_pct"], 1),
            "discoveryRate": round(p["avg_discovery_rate_pct"], 1),
        })

    coefs = [
        {"feature": c["feature"].replace("reason_start_", "inicio: ").replace("platform_", "plataforma: ").replace("_", " "),
         "coef": round(c["coefficient"], 4)}
        for c in sk["top_coefficients_abs"] if c["feature"] != "bias"
    ][:8]

    return {
        "clustering": {
            "model": cl["model"],
            "k": cl["k"],
            "features": cl["features"],
            "inertia": cl["inertia"],
            "silhouette": cl["silhouette"],
            "profiles": profiles
        },
        "skipClassifier": {
            "model": sk["model"],
            "trainRows": sk["train_rows"],
            "testRows": sk["test_rows"],
            "accuracy": sk["accuracy"],
            "precision": sk["precision"],
            "recall": sk["recall"],
            "f1": sk["f1"],
            "confusionMatrix": sk["confusion_matrix"],
            "topCoefficients": coefs
        }
    }


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    result = {}

    for person_id, cluster_names in [("juan_pablo", CLUSTER_NAMES_JP), ("aranza", CLUSTER_NAMES_AR)]:
        summary  = load_summary(person_id)
        sessions = load_sessions(person_id)
        monthly  = load_monthly(person_id)

        month_clusters = assign_months_to_clusters(
            monthly, summary["ml"]["clustering"]["profiles"]
        )
        timeblock_markov = compute_markov(sessions)
        weekday_markov   = compute_weekday_markov(sessions)
        pipeline         = build_pipeline_meta(summary)
        reasons          = build_reason_data(summary)
        ml               = build_ml(summary, cluster_names)

        key = "jp" if person_id == "juan_pablo" else "ar"
        result[key] = {
            "pipeline": pipeline,
            "monthClusters": month_clusters,
            "timeblockMarkov": timeblock_markov,
            "weekdayMarkov": weekday_markov,
            "reasons": reasons,
            "ml": ml
        }

    out_path = f"{BASE}/dashboard/src/data/analysis.js"
    with open(out_path, "w") as f:
        f.write("// Auto-generated by scripts/compute_analysis.py\n")
        f.write("export const ANALYSIS = ")
        f.write(json.dumps(result, indent=2, ensure_ascii=False))
        f.write(";\n")

    print(f"Written to {out_path}")
    # Quick sanity check
    for key in ["jp", "ar"]:
        p = result[key]["pipeline"]
        print(f"{key}: raw={p['rawRows']:,}  clean={p['cleanedRows']:,}  retention={p['retentionPct']}%")
        print(f"   clusters: {[c['name'] for c in result[key]['ml']['clustering']['profiles']]}")
        top = result[key]["timeblockMarkov"]["top"][:3]
        print(f"   top markov: {top}")


if __name__ == "__main__":
    main()
