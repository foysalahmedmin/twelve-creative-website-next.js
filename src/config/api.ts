import { ENV } from "./env";

export const API = {
  BASE_URL: ENV.NEXT_PUBLIC_API_URL,
  ASSETS_URL: ENV.NEXT_PUBLIC_ASSETS_URL,
  TIMEOUT: 30000, // 30 seconds
  ENDPOINTS: {
    AUTH: {
      SINGIN: "/auth/signin",
      SINGUP: "/auth/signup",
      SINGUOUT: "/auth/signout",
    },
  },
};
