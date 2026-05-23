# Checklist de requerimientos Spotify

| Requisito PDF | Evidencia | Estado |
|---|---|---|
| Fase 1: estructura, JSON principales, descripcion y reflexion | `notebooks/01_exploracion_spotify.ipynb`, `reports/spotify_informe_ejecutivo.pdf` | Completo |
| Fase 2: carga, calidad, nulos/duplicados, CSV limpio y transformaciones | `notebooks/02_limpieza_consolidacion.ipynb`, `data/processed/*`, `reports/informe_transformaciones.md` | Completo |
| Fase 3: EDA con visualizaciones, insights y comparacion por periodos | `notebooks/03_eda_spotify.ipynb`, `reports/informe_eda.md`, `reports/figures` | Completo |
| Patrones temporales: hora, dia, mensual, heatmap y picos | Figuras 01, 02, 03 por persona y comparativo | Completo |
| Totales de artistas y canciones unicas | `reports/summary_combined.json`, informe PDF | Completo |
| Top 20 artistas y canciones | Figuras 04 y 05 por persona | Completo |
| Diversidad musical por mes | Figura 06 y `spotify_monthly_features.csv` | Completo |
| Completion vs skip y sesiones | Figuras 07, 08, 09 y CSV de sesiones | Completo |
| Concentracion por generos o artistas | Concentracion por artistas, porque el export no trae genero nativo | Completo |
| ML: al menos 2 modelos, metricas e interpretacion | `notebooks/04_ml_spotify.ipynb`, informe PDF | Completo |
| Entrega final: PDF 10-15 paginas y presentacion 5-10 minutos | `reports/spotify_informe_ejecutivo.pdf`, `reports/spotify_presentacion.pptx` | Completo |
| Privacidad | CSV sin IP, resultados agregados | Completo |

Conteos validados: 547,722 filas crudas y 420,913 filas limpias entre las dos personas.
