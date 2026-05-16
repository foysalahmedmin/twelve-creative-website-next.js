export type TRecordType = "prescription" | "lab-report" | "diagnostic" | "other";

export type TMedicalRecord = {
  id: string;
  title: string;
  doctorName?: string;
  hospitalName?: string;
  date: string;
  type: TRecordType;
  fileUrl: string;
  fileSize?: string;
};
