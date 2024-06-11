document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const locationType = event.target.location_type.value;
      const locationName = event.target.location_name.value;
      const locationApiUrl = `https://api.inaturalist.org/v1/places/autocomplete?q=${locationName}&admin_level=${locationType}`;
      console.log("location url: ", locationApiUrl);
      const resultsDiv = document.querySelector(".results");

      fetch(locationApiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            console.log("location response: ", data);
            const placeId = data.results[0].id;
            const observationApiUrl = `https://api.inaturalist.org/v1/observations?place_id=${placeId}`;
            console.log("observation url: ", observationApiUrl);

            fetch(observationApiUrl)
              .then((response) => response.json())
              .then((data) => {
                if (data.results && data.results.length > 0) {
                  console.log("Observation response: ", data);
                  displayResults(data.results);
                } else {
                  resultsDiv.innerHTML = "No observations found";
                }
              })
              .catch((error) => {
                console.error("Error fetching observations:", error);
              });
          } else {
            resultsDiv.innerHTML = "No places found";
          }
        })
        .catch((error) => {
          console.error("Error fetching place data:", error);
        });
    });

  function displayResults(results) {
    const resultsDiv = document.querySelector(".results");
    resultsDiv.innerHTML = ""; // Clear previous results

    results.forEach((result) => {
      if (!result.taxon?.default_photo) {
        return;
      }

      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");

      const img = document.createElement("img");
      const name = document.createElement("h2");
      const scientificName = document.createElement("h3");

      img.src = result.taxon.default_photo.medium_url;
      name.textContent = result.taxon.preferred_common_name;
      scientificName.textContent = `(${result.taxon.name})`;

      resultItem.appendChild(img);
      resultItem.appendChild(name);
      resultItem.appendChild(scientificName);

      resultsDiv.appendChild(resultItem);
    });
  }
});
