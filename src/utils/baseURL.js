const environment = "dev";

let apiUrl;
if (environment === "production") {
  apiUrl = "https://rich-teal-octopus-kit.cyclic.app";
} else {
  apiUrl = "http://localhost:5000";
}

export default apiUrl;
