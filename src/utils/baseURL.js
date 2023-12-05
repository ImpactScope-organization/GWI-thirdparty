const environment = "production";

let apiUrl;
if (environment === "production") {
  apiUrl = "http://159.69.11.71";
} else {
  apiUrl = "http://localhost:5000";
}

export default apiUrl;
