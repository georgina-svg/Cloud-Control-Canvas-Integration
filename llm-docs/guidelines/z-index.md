# Z-index

Magnetic uses a leveled z-index system. If using official CDS components, z-index is handled automatically. Only set z-index manually when composing layouts (e.g. CDSHeader needs `style={{ zIndex: 200 }}`in generated stories since it renders outside the CDS shell).

## Levels

| z-index | Element                                       | Level |
| ------- | --------------------------------------------- | ----- |
| auto    | Page content (text, cards, buttons, dividers) | 0     |
| 40      | Canvas / map controls                         | 1     |
| 50      | Table locked columns                          | 1     |
| 60      | Table scroll header                           | 1     |
| 70      | Sticky elements                               | 1     |
| 80      | Fixed elements                                | 1     |
| 90      | Modal/Drawer fixed footer                     | 1     |
| 100     | Modal/Drawer header                           | 1     |
| 490     | Dropdowns (select, date picker, auto-suggest) | 2     |
| 500     | Popovers / Tooltips                           | 2     |
| 950     | Drawer                                        | 3     |
| 960     | Navigation drawer & menu                      | 3     |
| 970     | Header                                        | 3     |
| 980     | Modal overlay                                 | 3     |
| 990     | Modal                                         | 3     |
| 1000    | Toast                                         | 3     |

## Dynamic z-index

When a lower-level component is a child of a higher-level parent, combine their values:

`Dynamic Child Z = Parent Z + Child Z`

Examples:

- Dropdown inside Modal: 490 + 990 = **1480**
- Tooltip inside Modal: 500 + 990 = **1490**
- Dropdown inside Header: 490 + 970 = **1460**

## Key rules for generated stories

- CDSHeader: `style={{ zIndex: 200 }}` — ensures header renders above page content like tables and dropdowns in generated stories
- Toast always appears above everything (z-index 1000)
- Modal appears above Drawer (higher z-index) without closing it
- Don't manually set z-index on CDS components that handle it internally (CDSModal, CDSDrawer, CDSTooltip, CDSPopover, CDSDropdown)
