export const CONSTANT = {
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    HOSPITALS_LIMIT: 12,
    DOCTORS_LIMIT: 12,
  },
  CURRENCY: {
    SYMBOL: "৳",
    CODE: "BDT",
    NAME: "Bangladeshi Taka",
  },
  VAT: {
    PERCENTAGE: 5,
    INCLUDED: true,
  },
  DATE_FORMAT: "DD MMM YYYY",
  TIME_FORMAT: "hh:mm A",
  VALIDATION: {
    PHONE_REGEX: /^(?:\+88|88)?(01[3-9]\d{8})$/,
    OTP_LENGTH: 6,
  },
  LOCAL_STORAGE_KEYS: {
    AUTH_TOKEN: "tc_auth_token",
    USER_DATA: "tc_user_data",
  },
  CALLBACK_URL_PARAM: "tc_callback_url",
};
