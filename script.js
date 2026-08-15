const container = document.getElementById("places-container");
const buttonContainer = document.getElementById("continent-buttons");
const countryButtonContainer = document.getElementById("country-buttons");
const activitiesContainer = document.getElementById("activities-container");
const monthButtonContainer = document.getElementById("month-buttons");

function showPlaces(placeList) {
    container.innerHTML = "";

    for (const place of placeList) {
        const cityElement = document.createElement("button");

        cityElement.textContent = place.city;

        cityElement.addEventListener("click", () => {
            showActivities(place);
        });

        container.appendChild(cityElement);
    }
}

function filterByMonths() {
    const matchingPlaces = places.filter(place => {
        return place.months &&
            selectedMonths.some(month => place.months.includes(month));
    });

    showPlaces(matchingPlaces);
}
let selectedMonths = [];

for (const month of months) {
    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    checkbox.value = month;

    checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        selectedMonths.push(month);
    } else {
        selectedMonths = selectedMonths.filter(
            selectedMonth => selectedMonth !== month
        );
    }

    filterByMonths();
});

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(month));

    monthButtonContainer.appendChild(label);
}

function showActivities(place) {
    activitiesContainer.innerHTML = "";

    for (const activity of place.activities) {
        const activityElement = document.createElement("div");

        activityElement.textContent = activity;

        activitiesContainer.appendChild(activityElement);
    }
}


for (const continent of continents) {
    const button = document.createElement("button");

    button.textContent = continent;

button.addEventListener("click", () => {
    container.innerHTML = "";
    activitiesContainer.innerHTML = "";

    const matchingPlaces = places.filter(
        place => place.continent === continent
    );

    const countries = [...new Set(
        matchingPlaces.map(place => place.country)
    )];

    showCountries(countries);
});

    buttonContainer.appendChild(button);
}

function showCountries(countryList) {
    countryButtonContainer.innerHTML = "";

    for (const country of countryList) {
        const button = document.createElement("button");

        button.textContent = country;

        button.addEventListener("click", () => {
    activitiesContainer.innerHTML = "";

    const matchingPlaces = places.filter(
        place => place.country === country
    );

    showPlaces(matchingPlaces);
});

        countryButtonContainer.appendChild(button);
    }
}