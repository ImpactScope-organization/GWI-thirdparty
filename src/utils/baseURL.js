const environment = "dev";

let apiUrl;
if (environment === "production") {
  apiUrl = "https://gwi-backend.dev.impactscope.com";
} else {
  apiUrl = "http://localhost:5000";
}

export default apiUrl;
