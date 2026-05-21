---
"@stackla/widget-utils": major
---

Remove vertical expanded tile templates from `@stackla/widget-utils`. The vertical expanded tile (`VerticalExpandedTiles`, `loadVerticalExpandedTilesConfig`, and all related templates) has been moved to the `expanded-tiles` package in stackla-widgets. Consumers should use the `<expanded-tiles>` WebComponent from stackla-widgets — it reads `sdk.getExpandedTileVariant()` and renders the correct variant automatically.
