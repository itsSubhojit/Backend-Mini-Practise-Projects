import axios from "axios";
import { ApiError } from "../utils/ApiError.js";


const safeBrowsing = async (longUrl) => {
  try {
    const response = await axios.post(
      `${process.env.GOOGLE_SAFE_BROWSING_ENDPOINT}?key=${process.env.GOOGLE_SAFE_BROWSING_KEY}`,
      {
        client: {
          clientId: "shortit-url-shortener",
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [
            {
              url: longUrl,
            },
          ],
        },
      }
    );

    const data = response.data;

    // Google found a malicious URL
    if (data.matches && data.matches.length > 0) {
      throw new ApiError(
        400,
        "Unsafe URL detected! This URL cannot be shortened."
      );
    }

    // URL is safe
    return data;

  } catch (error) {
     // If it's our own ApiError, don't change it
    if (error instanceof ApiError) {
      throw error;
    }

    // No response from Google (network issue, timeout, etc.)
    if (!error.response) {
      throw new ApiError(
        503,
        "Unable to verify URL safety. Please try again later."
      );
    }

    // Google API key or configuration problem
    if (error.response.status === 401 || error.response.status === 403) {
      throw new ApiError(
        500,
        "Google Safe Browsing API authentication failed."
      );
    }

    // Any other Google API error
    throw new ApiError(
      503,
      "Unable to verify URL safety. Please try again later."
    );
  }
};

export { safeBrowsing };