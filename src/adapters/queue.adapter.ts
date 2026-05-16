import { BackendLiveQueue, TLiveQueue } from "@/types/queue.type";

export const adaptLiveQueue = (backendQueue: BackendLiveQueue): TLiveQueue => {
  const current = backendQueue.current_serial || 0;
  const total = backendQueue.total_serial || 0;
  
  // Prevent negative remaining patients if current exceeds total (edge case protection)
  const remainingPatients = Math.max(0, total - current);

  return {
    id: backendQueue._id,
    hospitalId: typeof backendQueue.hospital === "object" ? backendQueue.hospital._id : backendQueue.hospital,
    doctorId: typeof backendQueue.doctor === "object" ? backendQueue.doctor._id : backendQueue.doctor,
    date: new Date(backendQueue.date),
    startTime: new Date(backendQueue.start_date_time),
    totalSerial: total,
    currentSerial: current,
    avgWaitTimeInMin: backendQueue.avg_per_patient_visit_time_in_min || 15,
    isActive: backendQueue.isActive ?? true,
    remainingPatients,
  };
};
