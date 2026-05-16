import { BackendDiagnosticTest, BackendLab, DiagnosticTest, Lab } from "@/types/diagnostic.type";

export const diagnosticTestAdapter = (raw: BackendDiagnosticTest): DiagnosticTest => ({
  id: raw._id,
  name: raw.name,
  description: raw.description,
  priceStartFrom: raw.price_start_from,
});

export const diagnosticTestsAdapter = (raws: BackendDiagnosticTest[]): DiagnosticTest[] =>
  raws.map(diagnosticTestAdapter);

export const labAdapter = (raw: BackendLab): Lab => {
  const city = raw.city;
  const cityObj = typeof city === "object" ? city : null;

  return {
    id: raw._id,
    name: raw.name,
    description: raw.description ?? "",
    hotline: raw.hotline,
    logo: raw.logo ?? "",
    address: raw.address,
    about: raw.about ?? "",
    city: cityObj?.name ?? "",
    cityId: cityObj?._id ?? (typeof city === "string" ? city : ""),
    tests: raw.tests || [],
  };
};

export const labsAdapter = (raws: BackendLab[]): Lab[] =>
  raws.map(labAdapter);
