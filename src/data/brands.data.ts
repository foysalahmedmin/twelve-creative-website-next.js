export type TBrand = {
  id: string;
  name: string;
  /** Optional image URL — when provided, image is rendered; otherwise the name is shown as styled text. */
  logo_src?: string;
  alt?: string;
};

/**
 * Placeholder brand entries. Replace `logo_src` per item with real client logo URLs when available.
 * Until then, the brand name is rendered as a styled wordmark.
 */
export const BRANDS_DATA: TBrand[] = [
  { id: "casa-del-mar", name: "Casa del Mar" },
  { id: "hudson-hospitality", name: "Hudson Hospitality" },
  { id: "meridian-properties", name: "Meridian Properties" },
  { id: "atlas-developments", name: "Atlas Developments" },
  { id: "velocity-aviation", name: "Velocity Aviation" },
  { id: "skyline-charter", name: "Skyline Charter" },
  { id: "forge-advisors", name: "Forge Advisors" },
  { id: "brightline-partners", name: "Brightline Partners" },
  { id: "vesta-group", name: "Vesta Group" },
  { id: "obsidian-real-estate", name: "Obsidian Real Estate" },
  { id: "northstar-aviation", name: "Northstar Aviation" },
  { id: "monarch-consulting", name: "Monarch Consulting" },
];
