# DME Tuition & Fees Reference Data

Source: Studio 4 Final Report (`Studio_4_Final_Report__A.pdf`), pages 38-39,
"Tuition & Cost Overview" prototype screens (Sprint 3 increment). All amounts in
Thai Baht (฿). This page was **not** in the original DME Explorer proposal — it's a
scope addition based on this report, per the finalized project scope.

> ⚠️ These are prototype/demo figures from a course project, not official KKU
> tuition data. The demo script explicitly says to caveat this to any audience:
> confirm with the faculty before publishing real numbers.

## Student types

| Status | Semester fee (tuition only) | Has estimated living cost breakdown? |
|---|---|---|
| Thai | ฿45,000 | No |
| Mekong Region (Cambodia, China, Laos, Myanmar, Vietnam) | ฿50,000 | Yes |
| International (global rate) | ฿65,000 | Yes |

## Fee breakdown logic

- **Academic costs** (`cost_type = 'Academic costs'`): Tuition Fee (`Mandatory`),
  Summer Training (`One-time`), and for International students an Enrollment Fee
  (`One-time`, new students only).
- **Estimated costs** (`cost_type = 'Estimated costs'`): Accommodation and Cost of
  Living, both `Optional` — shown only for Mekong Region and International students
  (Thai students don't get a living-cost estimate in the source UI).
- **Per Semester** grand total = Mandatory academic costs + 4 months of estimated
  living costs. One-time fees (Summer Training, Enrollment Fee) are *excluded* from
  the per-semester total.
- **Full 4 Years** grand total = all 8 semesters of tuition + one-time fees once +
  40 months of estimated living costs (accumulated across the 4-year program).

## Thai Students

### Per Semester
| Item | Type | Amount |
|---|---|---|
| Tuition Fee | Mandatory | ฿45,000 |
| Summer Training | One-time | ฿2,500 |
| **Grand Total (Per Semester)** | | **฿45,000** |

### Full 4 Years
| Item | Type | Amount |
|---|---|---|
| Tuition Fee (8 semesters) | Mandatory | ฿360,000 |
| Summer Training | One-time | ฿2,500 |
| **Grand Total (4 Years Estimate)** | | **฿362,500** |

## Mekong Region Students

### Per Semester
| Item | Type | Amount |
|---|---|---|
| Tuition Fee | Mandatory | ฿50,000 |
| Summer Training | One-time | ฿2,500 |
| Accommodation (monthly avg., 4 months) | Optional | ~฿4,000/mo |
| Cost of Living (monthly avg., 4 months) | Optional | ~฿6,000/mo |
| **Grand Total (Per Semester)** | | **฿90,000** |

### Full 4 Years
| Item | Type | Amount |
|---|---|---|
| Tuition Fee (8 semesters) | Mandatory | ฿400,000 |
| Summer Training | One-time | ฿2,500 |
| Accommodation (4-year total, ~40 months) | Optional | ~฿160,000 |
| Cost of Living (4-year total, ~40 months) | Optional | ~฿240,000 |
| **Grand Total (4 Years Estimate)** | | **฿802,500** |

## International Students

### Per Semester
| Item | Type | Amount |
|---|---|---|
| Tuition Fee | Mandatory | ฿65,000 |
| Summer Training | One-time | ฿2,500 |
| Enrollment Fee (new students) | One-time | ฿10,000 |
| Accommodation (monthly avg., 4 months) | Optional | ~฿4,000/mo |
| Cost of Living (monthly avg., 4 months) | Optional | ~฿6,000/mo |
| **Grand Total (Per Semester)** | | **฿105,000** |

### Full 4 Years
| Item | Type | Amount |
|---|---|---|
| Tuition Fee (8 semesters) | Mandatory | ฿520,000 |
| Summer Training | One-time | ฿2,500 |
| Enrollment Fee | One-time | ฿10,000 |
| Accommodation (4-year total, ~40 months) | Optional | ~฿160,000 |
| Cost of Living (4-year total, ~40 months) | Optional | ~฿240,000 |
| **Grand Total (4 Years Estimate)** | | **฿932,500** |
