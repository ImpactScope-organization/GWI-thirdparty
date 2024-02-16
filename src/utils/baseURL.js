const environment = "v2-avax";

let apiUrl;
if (environment === "production") {
  apiUrl = "https://gwi-backend.dev.impactscope.com";
} else if (environment === "staging") {
  apiUrl = "https://gwi-backend-v2.impactscope.com";
} else if (environment === "v2-avax") {
  apiUrl = "https://gwi-be-avax.impactscope.com";
} else if (environment === "dev") {
  apiUrl = "https://gwi-be-dev.impactscope.com";
} else {
  apiUrl = "http://localhost:5000";
}

export default apiUrl;
