import { BackendHospital, Hospital } from "@/types/hospital.type";

const DEFAULT_HOSPITAL_IMAGE = "/images/placeholder-hospital.jpg";

/**
 * Transforms backend hospital data into a structure consistent with the frontend UI needs.
 * Enhanced with deep null safety and standardized fallbacks.
 */
export const hospitalAdapter = (data: BackendHospital): Hospital => {
  if (!data) throw new Error("Hospital adapter received null/undefined data");

  // Build thumbnail: prefer logo, then first image, then placeholder
  const thumbnail = data.logo || data.images?.[0] || DEFAULT_HOSPITAL_IMAGE;

  // Build all images array from logo + cover_photo + images[]
  const allImages: string[] = [];
  if (data.logo) allImages.push(data.logo);
  if (data.cover_photo) allImages.push(data.cover_photo);
  if (Array.isArray(data.images)) allImages.push(...data.images);
  if (allImages.length === 0) allImages.push(DEFAULT_HOSPITAL_IMAGE);

  // Coordinates: backend has flat lat/lon strings, GeoJSON is optional
  const lat = data.location?.coordinates?.[1] ?? (parseFloat(data.lat || "0") || 0);
  const lng = data.location?.coordinates?.[0] ?? (parseFloat(data.lon || "0") || 0);

  // City name: comes as populated object or string ID
  const cityName = typeof data.city === "object" && data.city !== null
    ? data.city.name
    : (data.city || "Unknown City");

  // Phone: backend calls it 'hotline', not 'contactNumber'
  const phones = data.hotline
    ? [data.hotline]
    : data.contactNumber
    ? [data.contactNumber]
    : ["N/A"];

  // Specialities from backend (populated array of {_id, name})
  const specialityStats = Array.isArray(data.specialities) && data.specialities.length > 0
    ? data.specialities
        .map((s) => (typeof s === "object" ? s.name : s))
        .slice(0, 3)
        .join(", ")
    : "General & Specialist Services";

  return {
    id: data._id || "",
    name: data.name || "Unnamed Hospital",
    slug: data.slug || data._id || "",
    thumbnail,
    allImages,
    address: data.address || "Address not available",
    city: cityName,
    coordinates: { lat, lng },
    description: data.description || data.about || "",
    rating: Number(data.rating) || 0,
    reviewCount: Number(data.totalReviews) || 0,
    isEmergency: !!data.isEmergencyAvailable,
    contact: {
      phones,
      emails: data.email ? [data.email] : ["N/A"],
      web: data.website || "",
      emergency: data.hotline || "N/A",
    },
    specialtyStats: specialityStats,
    specialities: Array.isArray(data.specialities) 
      ? data.specialities.map(s => typeof s === 'object' ? { _id: s._id, name: s.name } : { _id: s, name: 'Specialty' })
      : [],
    feeRange: "Contact for Pricing",
    patientOpinions: `${data.totalReviews || 0} patient opinions`,
    services: (data.services || []).map((s) => ({
      name: s,
      description: `Expert ${s.toLowerCase()} care and medical consultation.`,
    })),
    facilities: data.facilities || [],
    coverPhoto: data.cover_photo || "",
    socials: {
      facebook: data.facebook,
      youtube: data.youtube,
      instagram: data.instagram,
      linkedin: data.linkedin,
    },
    mission: data.mission || "",
    vision: data.vision || "",
    yearsInService: data.yearsInService || 0,
    stats: {
      totalBeds: data.stats?.totalBeds || 0,
      doctorsCount: data.stats?.doctorsCount || 0,
      icuBeds: data.stats?.icuBeds || 0,
    },
    mapUrl: `https://www.google.com/maps/embed/v1/place?key=REPLACE_ME&q=${encodeURIComponent(data.name + " " + data.address)}`,
    openingHours: [
      { day: "Sat - Thu", time: data.openingHours || "08:00 AM - 10:00 PM" },
      { day: "Friday", time: "Emergency Only", isClosed: false },
    ],
    doctors: [],
    nurses: [],
  };
};

/**
 * Multiple items adapter with array validation
 */
export const hospitalsAdapter = (data: BackendHospital[]): Hospital[] => {
  if (!Array.isArray(data)) {
    console.warn("hospitalsAdapter received non-array data:", data);
    return [];
  }
  return data.map(hospitalAdapter);
};
