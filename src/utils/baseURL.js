const environment = "production";

let apiUrl;
if (environment === "production") {
  apiUrl = "https://vast-rose-bonobo-tux.cyclic.cloud"
} else {
  apiUrl = "http://localhost:5000"
}


export default apiUrl