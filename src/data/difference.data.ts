export type TDifference = {
  eyebrow: string;
  title: string;
  description: string;
  fragmented: { title: string; items: string[] };
  connected: { title: string; items: string[] };
};

export const DIFFERENCE_DATA: TDifference = {
  eyebrow: "The Twelve Creative Difference",
  title: "Creative is only valuable when it is connected to the business.",
  description:
    "Most companies separate creative, ads, websites, and follow-up systems into different vendors. The result is often fragmented. We build these pieces together so the business has a clearer path from attention to revenue.",
  fragmented: {
    title: "Fragmented approach",
    items: [
      "Strong visuals with no backend",
      "Ads without a clear offer",
      "Websites that look good but do not convert",
      "Leads that fall through the cracks",
      "Vendors managed in silos",
    ],
  },
  connected: {
    title: "Connected system",
    items: [
      "Positioning that informs every asset",
      "Creative built around the offer",
      "Websites engineered to convert",
      "CRM and automations capturing demand",
      "One team, one operating system",
    ],
  },
};
