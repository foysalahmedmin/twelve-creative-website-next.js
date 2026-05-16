import { BackendDoctor, Doctor } from "@/types/doctor.type";
import { specialtiesAdapter } from "./specialty.adapter";

const DEFAULT_DOCTOR_IMAGE = "/images/profile.jpeg"; // Fallback placeholder

export const doctorAdapter = (data: BackendDoctor): Doctor => {
  const name = data.name || "Unknown Doctor";
  // Alignment: Backend uses ID for lookup, so slug becomes the ID to ensure details page works
  const slug = data._id || ""; 
  const specializations = specialtiesAdapter(data.specializations || []);
  const primarySpecialty = specializations.length > 0 ? specializations[0].name : "General Physician";

  return {
    id: data._id || "",
    name,
    slug,
    photo: data.photo || DEFAULT_DOCTOR_IMAGE,
    degrees: data.degrees ? data.degrees.split(",").map(d => d.trim()).filter(Boolean) : [],
    primarySpecialty,
    shortDescription: data.short_description || "",
    bmdcRegNo: data.BMDC_REG_NO || "N/A",
    about: data.about || "No description available.",
    email: data.email || "",
    phone: data.phone || "N/A",
    isAvailableHome: !!data.isAvailableHome,
    specializations,
    educations: (() => {
      const fromEducations = Array.isArray(data.educations)
        ? data.educations.filter((e: any) => typeof e === "string" && e.trim())
        : [];
      if (fromEducations.length > 0) return fromEducations;
      // Fall back to degrees when educations array is empty or contains only blank strings
      return data.degrees ? data.degrees.split(",").map(d => d.trim()).filter(Boolean) : [];
    })(),
    
    // Fields not in backend model — kept as neutral defaults
    fee: Number(data.fee) || 0,
    rating: Number(data.rating) || 0,
    reviewCount: Number(data.totalReviews) || 0,
    experience: data.years_of_experience ? String(data.years_of_experience) : "",

    // Derived UI Fallbacks
    chamber: {
      name: "General Hospital & Diagnostic",
      address: "Dhaka, Bangladesh",
    },
    chambers: [
      {
        id: "1",
        name: "General Hospital & Diagnostic",
        address: "Dhaka, Bangladesh",
        availability: ["Sat - Thu 10:00 AM - 08:00 PM"],
        consultationMethod: ["Face to Face", "Video Call"],
        appointmentTypes: ["New Patient", "Report Check", "Follow up"]
      }
    ],
    availability: ["Sat - Thu 10:00 AM - 08:00 PM"],
    services: data.field_of_concentration?.map(c => typeof c === 'string' ? c : c.name) || ["General Consultation", "Regular Checkup"],
    videos: [],
  };
};

export const doctorsAdapter = (data: BackendDoctor[]): Doctor[] => {
  if (!Array.isArray(data)) {
    console.warn("doctorsAdapter received non-array data:", data);
    return [];
  }
  return data.map(doctorAdapter);
};
