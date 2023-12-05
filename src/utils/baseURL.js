const environment = "dev";

let apiUrl;
if (environment === "production") {
  apiUrl = "https://gwi-env.lm.r.appspot.com";
} else {
  apiUrl = "http://localhost:5000";
}

export default apiUrl;
