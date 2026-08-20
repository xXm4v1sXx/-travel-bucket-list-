document.addEventListener("placesLoaded", () => {

const container = document.getElementById("places-container");
const continentButtonContainer = document.getElementById("continent-buttons");
const monthButtonContainer = document.getElementById("month-buttons");
const countryButtonContainer = document.getElementById("country-buttons");

const countrySection = document.getElementById("country-section");
const placesSection = document.getElementById("places-section");

let selectedMonths = [];
let selectedContinent = null;
let selectedCountry = null;


// =====================================
// SHOW PLACES
// =====================================

function showPlaces(placeList) {

    container.innerHTML = "";

    if (placeList.length === 0) {
        placesSection.style.display = "none";
        return;
    }

    placesSection.style.display = "block";

    for (const place of placeList) {

        const card = document.createElement("div");
        card.className = "city-card";

        const image = document.createElement("img");
        image.src = place.image;
        image.alt = place.city;
        image.className = "city-image";

        card.appendChild(image);

        const cityName = document.createElement("h3");
        cityName.textContent = place.city;

        const countryName = document.createElement("p");
        countryName.textContent = place.country;

        const description = document.createElement("p");
        description.textContent = place.description;

        card.appendChild(cityName);
        card.appendChild(countryName);
        card.appendChild(description);

card.addEventListener("click", () => {
    showActivities(place);
});

container.appendChild(card);
    }
}


// =====================================
// GET MATCHING PLACES
// =====================================

function getMatchingPlaces() {

    // Month is required
    if (selectedMonths.length === 0) {
        return [];
    }

    return places.filter(place => {

        const matchesMonth =
            place.months &&
            selectedMonths.some(month =>
                place.months.includes(month)
            );

        const matchesContinent =
            !selectedContinent ||
            place.continent === selectedContinent;

        const matchesCountry =
            !selectedCountry ||
            place.country === selectedCountry;

        return (
            matchesMonth &&
            matchesContinent &&
            matchesCountry
        );
    });
}


// =====================================
// UPDATE COUNTRIES
// =====================================

function updateCountries() {

    countryButtonContainer.innerHTML = "";

    if (selectedMonths.length === 0) {
        countrySection.style.display = "none";
        return;
    }

    const matchingPlaces = places.filter(place => {

        const matchesMonth =
            place.months &&
            selectedMonths.some(month =>
                place.months.includes(month)
            );

        const matchesContinent =
            !selectedContinent ||
            place.continent === selectedContinent;

        return matchesMonth && matchesContinent;
    });


    const countries = [
        ...new Set(
            matchingPlaces.map(place => place.country)
        )
    ];


    if (countries.length === 0) {
        countrySection.style.display = "none";
        return;
    }

    countrySection.style.display = "block";


    for (const country of countries) {

        const button = document.createElement("button");

        button.textContent = country;

        if (selectedCountry === country) {
            button.classList.add("active");
        }


        button.addEventListener("click", () => {

            selectedCountry = country;

            document
                .querySelectorAll("#country-buttons button")
                .forEach(button =>
                    button.classList.remove("active")
                );

            button.classList.add("active");

            // Country is an OPTIONAL refinement
            showPlaces(getMatchingPlaces());
        });


        countryButtonContainer.appendChild(button);
    }
}


// =====================================
// CONTINENTS
// =====================================

function showContinents() {

    continentButtonContainer.innerHTML = "";

    // ALWAYS show every continent
    for (const continent of continents) {

        const button = document.createElement("button");

        button.textContent = continent;

        if (selectedContinent === continent) {
            button.classList.add("active");
        }


        button.addEventListener("click", () => {

            selectedContinent = continent;
            selectedCountry = null;


            document
                .querySelectorAll("#continent-buttons button")
                .forEach(button =>
                    button.classList.remove("active")
                );

            button.classList.add("active");


            // If no month exists, continent alone
            // does NOT return anything.
            if (selectedMonths.length === 0) {
                countrySection.style.display = "none";
                placesSection.style.display = "none";
                return;
            }


            // Month + continent
            updateCountries();

            // regions immediately update too
            showPlaces(getMatchingPlaces());
        });


        continentButtonContainer.appendChild(button);
    }
}


// =====================================
// MONTHS
// =====================================

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
                selectedMonth =>
                    selectedMonth !== month
            );
        }


        // Changing months resets country
        selectedCountry = null;

        document
            .querySelectorAll("#country-buttons button")
            .forEach(button =>
                button.classList.remove("active")
            );


        // =================================
        // NO MONTH
        // =================================

        if (selectedMonths.length === 0) {

            countryButtonContainer.innerHTML = "";
            container.innerHTML = "";

            countrySection.style.display = "none";
            placesSection.style.display = "none";

            selectedContinent = null;

            document
                .querySelectorAll("#continent-buttons button")
                .forEach(button =>
                    button.classList.remove("active")
                );

            return;
        }


        // =================================
        // MONTH SELECTED
        // =================================

        // THIS IS THE IMPORTANT PART:
        // month alone immediately gives us
        // BOTH countries AND regions.

        updateCountries();

        showPlaces(getMatchingPlaces());
    });


    label.appendChild(checkbox);

    label.appendChild(
        document.createTextNode(month)
    );

    monthButtonContainer.appendChild(label);
}


// =====================================
// INITIAL STATE
// =====================================

countrySection.style.display = "none";
placesSection.style.display = "none";

showContinents();

// =====================================
// ACTIVITY MUSEUM CATALOGUE
// =====================================

function getActivityKey(place, activity, index) {

    const activityName =
        typeof activity === "string"
            ? activity
            : activity.name;

    return `travel-${place.city}-${activityName}-${index}`;
}


function getActivityData(key) {

    const saved =
        localStorage.getItem(key);

    if (saved) {
        return JSON.parse(saved);
    }

    return {
        visited: false,
        rating: 0,
        review: "",
    };
}


function saveActivityData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}

function showActivities(place) {

    const container =
        document.getElementById("activities-container");

    if (!container) return;

    container.innerHTML = "";


    // =================================
    // HEADING
    // =================================

    const heading =
        document.createElement("h2");

    heading.textContent =
        `${place.city} · activities`;

    container.appendChild(heading);


    // =================================
    // NO ACTIVITIES
    // =================================

    if (
        !place.activities ||
        place.activities.length === 0
    ) {

        const empty =
            document.createElement("p");

        empty.textContent =
            "No activities have been added yet.";

        container.appendChild(empty);

        return;
    }


    // =================================
    // ACTIVITY CARDS
    // =================================

    place.activities.forEach(
        (activity, index) => {

            const activityName =
                typeof activity === "string"
                    ? activity
                    : activity.name;

            const activityImage =
                typeof activity === "string"
                    ? ""
                    : activity.image;


            const storageKey =
                getActivityKey(
                    place,
                    activity,
                    index
                );


            const saved =
                getActivityData(storageKey);


            // -------------------------
            // CARD
            // -------------------------

            const card =
                document.createElement("article");

            card.className =
                "activity-item";


            // -------------------------
            // NUMBER
            // -------------------------

            const number =
                document.createElement("div");

            number.className =
                "activity-number";

            number.textContent =
                String(index + 1)
                    .padStart(2, "0");

            card.appendChild(number);


            // -------------------------
            // IMAGE
            // -------------------------

            if (activityImage) {

                const image =
                    document.createElement("img");

                image.src =
                    activityImage;

                image.alt =
                    activityName;

                image.className =
                    "activity-image";

                card.appendChild(image);
            }


            // -------------------------
            // NAME
            // -------------------------

            const name =
                document.createElement("h3");

            name.className =
                "activity-name";

            name.textContent =
                activityName;

            card.appendChild(name);


            // -------------------------
            // LOCATION
            // -------------------------

            const location =
                document.createElement("p");

            location.className =
                "activity-location";

            location.textContent =
                `${place.city} · ${place.country}`;

            card.appendChild(location);


            // -------------------------
            // RATING
            // -------------------------

            const rating =
                document.createElement("div");

            rating.className =
                "activity-rating";

            const ratingLabel =
                document.createElement("div");

            ratingLabel.className =
                "rating-label";

            ratingLabel.textContent =
                "your rating";

            rating.appendChild(ratingLabel);


            const stars =
                document.createElement("div");

            stars.className =
                "rating-stars";


            for (
                let i = 1;
                i <= 5;
                i++
            ) {

                const star =
                    document.createElement("span");

                star.className = "star";


                if (saved.rating >= i) {

                    star.classList.add("full");

                } else if (
                    saved.rating >= i - 0.5
                ) {

                    star.classList.add("half");
                }


                const left =
                    document.createElement("button");

                left.className =
                    "star-half left";

                left.setAttribute(
                    "aria-label",
                    `${i - 0.5} stars`
                );


                left.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        saved.rating =
                            i - 0.5;

                        saveActivityData(
                            storageKey,
                            saved
                        );

                        showActivities(place);
                    }
                );


                const right =
                    document.createElement("button");

                right.className =
                    "star-half right";

                right.setAttribute(
                    "aria-label",
                    `${i} stars`
                );


                right.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        saved.rating =
                            i;

                        saveActivityData(
                            storageKey,
                            saved
                        );

                        showActivities(place);
                    }
                );


                star.appendChild(left);
                star.appendChild(right);

                stars.appendChild(star);
            }


            rating.appendChild(stars);

            card.appendChild(rating);


            // -------------------------
            // PERSONAL NOTE
            // -------------------------

            const review =
                document.createElement("div");

            review.className =
                "review-container";


            const reviewLabel =
                document.createElement("div");

            reviewLabel.className =
                "review-label";

            reviewLabel.textContent =
                "description";

            review.appendChild(reviewLabel);


            const textarea =
                document.createElement("textarea");

            textarea.className =
                "review-input";

            textarea.placeholder =
                "write something about this place...";

            textarea.value =
                saved.review || "";

            review.appendChild(textarea);


            const saveButton =
                document.createElement("button");

            saveButton.className =
                "review-button";

            saveButton.textContent =
                "save note";


            saveButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    saved.review =
                        textarea.value;

                    saveActivityData(
                        storageKey,
                        saved
                    );

                    saveButton.textContent =
                        "saved ✓";

                    setTimeout(() => {

                        saveButton.textContent =
                            "save note";

                    }, 1200);
                }
            );


            review.appendChild(saveButton);

            card.appendChild(review);


            // -------------------------
            // VISITED
            // -------------------------

            const visited =
                document.createElement("div");

            visited.className =
                "visited-container";


            const visitedButton =
                document.createElement("button");

            visitedButton.className =
                "visited-button";


            const date =
                document.createElement("div");

            function updateVisited() {

                if (saved.visited) {

                    visitedButton.textContent =
                        "✓ visited";

                    visitedButton.classList.add(
                        "visited"
                    );

                    date.textContent =
                        saved.dateVisited;

                } else {

                    visitedButton.textContent =
                        "□ not yet visited";

                    visitedButton.classList.remove(
                        "visited"
                    );

                    date.textContent = "";
                }
            }


            updateVisited();


            visitedButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    saved.visited =
                        !saved.visited;


                    saveActivityData(
                        storageKey,
                        saved
                    );

                    updateVisited();
                }
            );


            visited.appendChild(
                visitedButton
            );

            visited.appendChild(date);

            card.appendChild(visited);


            // -------------------------
            // ADD CARD
            // -------------------------

            container.appendChild(card);
        }
    );


    // Scroll to catalogue

container.scrollIntoView({
    behavior: "smooth",
    block: "start"
});
}

});