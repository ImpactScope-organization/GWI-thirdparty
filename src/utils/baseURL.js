const environment = "dev";

let apiUrl;
if (environment === "production") {
  apiUrl = "https://gwi-backend.dev.impactscope.com";
} else if (environment === "staging") {
  apiUrl = "https://gwi-backend-v2.impactscope.com";
} else if (environment === "dev") {
  apiUrl = "https://gwi-be-dev.impactscope.com";
}

export default apiUrl;
