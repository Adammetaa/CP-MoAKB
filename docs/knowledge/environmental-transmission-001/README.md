# Environmental, Transmission, and Spatial Surveillance Knowledge

Status: Accepted for bounded internal composition; not published

This corpus reuses governed Evidence from the 16-subject rice-disease corpus and
the 19-subject rice-insect corpus. It adds no Source and does not reinterpret a
field Case as Canonical Knowledge. Coverage is intentionally asymmetric: a
factor or pathway exists only where the cited Source already supports it.

| Coverage | Count |
| --- | ---: |
| Disease subjects reviewed | 16 |
| Disease subjects with explicit transmission/vector/spread pathways | 8 |
| Disease subjects with environmental, stage, or field context | 9 |
| Insect subjects with useful environmental/spatial context | 13 |
| Quantitative weather thresholds | 0 |
| Quantitative dispersal-distance records | 0 |
| Operational surveillance radii | 0 |
| Grouped unresolved issues | 5 |

Cause, transmission, dispersal, favorable environment, development, vector
activity, and field observation remain separate roles. A vector observation
does not establish infection. A field pattern does not establish cause. No
relationship creates Diagnosis, probability, outbreak prediction, treatment,
or Recommendation.

## Source reuse

- `GS-KU-RICE-DISEASES-2020-001/v1`, Kasetsart University rice-disease
  material, governed locators KU pp.5–50.
- `GS-RRC-PRACHIN-RICE-DISEASES-2025-001/v1`, Prachinburi Rice Research
  Center, Rice Department, governed locators RRC pp.2–10.
- `GS-RIC-RD-INSECTS-001/v1`, Rice Department rice-insect material, governed
  printed pp.2–56 / PDF pp.13–67.

The corresponding Source records retain publisher, date/version, artifact
hash, authority scope, rights disposition, and limitations. This increment
reuses their independently authored summaries and does not reproduce pages,
images, tables, layouts, or substantial passages.

## Prototype weather-provider review

The Sprint-072P product integration selects **Open-Meteo** without a private
browser key. Past observation dates use the Historical Weather API
`/v1/archive` Best Match product; same-day observations use the Forecast API
only as clearly labelled same-day model context. A future observation time is
rejected. The request sends WGS84 latitude and longitude, one ISO date,
`timezone=auto`, explicit units, and these hourly variables only:
`relative_humidity_2m`, `precipitation`, `wind_speed_10m`,
`wind_direction_10m`, and `soil_moisture_0_to_7cm`.

The Historical API documents hourly temporal resolution. Its Best Match
product combines model/reanalysis datasets; data from 2017 onward can use a
9-km model grid, while older data can use 0.1-degree or 0.25-degree grids.
These values are gridded and model-derived/reanalysis data, not measurements
from a sensor in the field. Relative humidity is percent, precipitation is the
preceding-hour sum in millimetres, wind speed is requested in kilometres per
hour, direction is degrees, and soil moisture is cubic metres per cubic metre
when the selected model provides it. Response timezone, units, matched hour,
retrieval time, product/data class, target coordinates, and limitations remain
in browser-local Case State.

Known limitations include grid cells much broader than device GPS accuracy,
model-dependent variable availability, differing historical models, and
same-day values that may be forecast/model-derived. Soil moisture therefore
remains explicitly unavailable when absent. Open-Meteo attribution and its
underlying model attribution are exposed in the result details. The request is
user initiated and sends no photo, narrative, identity, notes, Candidate,
chemical history, or Case identifier.
