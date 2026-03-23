/**
 * Asset URLs from Figma file: Cloud-Control-Design-Library (node 188:25546 / 219:37851).
 * One representative PNG per product icon, at 16px. Expire after ~7 days.
 */
const FIGMA_API = 'https://www.figma.com/api/mcp/asset'

export const figmaAssets = {
  /* Close (X) button */
  close: `${FIGMA_API}/8d09c1e4-12c8-4c9a-9b7c-3c80c7f7ea00`,

  /* Platform icons — Inactive, 16px */
  iconHome:        `${FIGMA_API}/6dd31552-5231-4a28-b9a9-5029eac79561`,   // Home Default layer
  iconAgents:      `${FIGMA_API}/bc2e00cc-5618-4659-96eb-3a47cb8f2d8b`,   // Agent Studio Medium layer
  iconInventory:   `${FIGMA_API}/0c7f3e3e-051f-4b51-b7db-03574dfbf790`,   // Inventory Default layer
  iconTopology:    `${FIGMA_API}/06a84d04-a6bc-4cb6-885f-bdf637a9d165`,   // Topology Default layer
  iconAdmin:       `${FIGMA_API}/4af6925b-11dc-40a4-a1c3-29e58fddd4e4`,   // Admin Console Medium layer

  /* Product icons — 16px */
  iconIntersight:    `${FIGMA_API}/bc72c808-c289-40be-bdcf-872e4b6d1839`, // Intersight cont
  iconMeraki:        `${FIGMA_API}/acf36e63-7b01-44df-9779-58c2b45dafd7`, // Meraki Default
  iconNexus:         `${FIGMA_API}/824ea513-2e3d-47dd-bc9d-d43c1102884c`, // Nexus main shape
  iconSecurity:      `${FIGMA_API}/4828245f-7ba4-46b3-aef1-4c3fab010ed4`, // Security Default
  iconSplunk:        `${FIGMA_API}/04779a31-a270-4722-85fc-90f1cffb3dd3`, // Splunk Medium
  iconThousandEyes:  `${FIGMA_API}/63d2639f-d6b3-4395-8e03-e2980581155c`, // ThousandEyes Default
  iconWebex:         `${FIGMA_API}/6fa740e9-b4c7-46e8-8684-aaa1952b32bc`, // Webex Default

  /* Favorites: Star, Pencil, Plus */
  iconStar:   `${FIGMA_API}/805822ee-7dea-4b0a-afe6-7a9dd4aba9a0`,
  iconPencil: `${FIGMA_API}/ee1e6612-9041-42f0-b58f-88aaf07a5256`,
  iconPlus:   `${FIGMA_API}/32215f07-473a-4f87-b95e-4aecfd4a9c69`,
} as const
