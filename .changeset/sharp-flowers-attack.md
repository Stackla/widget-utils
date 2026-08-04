---
"@stackla/widget-utils": minor
---

feat(widget-types): UGC-19862: add custom_tile_per_page_type option
feat(sdk): UGC-19862: add row control configuration support
- Add `RowsPerLoadCalculator` type for custom tile-per-page calculations
- Add `setRowsPerLoadCalculator` method to ISdk interface
- Add `rowsPerLoadCalculator` to WidgetOptions configuration
- Update widget response handling to support row control settings
