const container = document.getElementById("places-container");
const buttonContainer = document.getElementById("continent-buttons");
const countryButtonContainer = document.getElementById("country-buttons");
const activitiesContainer = document.getElementById("activities-container");
const monthButtonContainer = document.getElementById("month-buttons");

function showPlaces(placeList) {
    container.innerHTML = "";

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

let selectedContinent = null;
let selectedCountry = null;
let selectedMonths = [];

function filterPlaces() {
    const matchingPlaces = places.filter(place => {

        const matchesContinent =
            !selectedContinent ||
            place.continent === selectedContinent;

        const matchesCountry =
            !selectedCountry ||
            place.country === selectedCountry;

        const matchesMonth =
            selectedMonths.length === 0 ||
            (
                place.months &&
                selectedMonths.some(month =>
                    place.months.includes(month)
                )
            );

        return (
            matchesContinent &&
            matchesCountry &&
            matchesMonth
        );
    });

    showPlaces(matchingPlaces);
}

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

filterPlaces();
});

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(month));

    monthButtonContainer.appendChild(label);
}

// =====================================
// ACTIVITY ARCHIVE
// =====================================

function getActivityKey(place, activity, index) {
    return `travel-${place.city}-${activity.name || activity}-${index}`;
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


// =====================================
// SHOW ACTIVITIES
// =====================================

function showActivities(place) {

    const container =
        document.getElementById("activities-container");

    if (!container) return;

    container.innerHTML = "";


    // Page heading

    const heading =
        document.createElement("h2");

    heading.textContent = "activities";

    container.appendChild(heading);


    if (!place.activities ||
        place.activities.length === 0) {

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


            // -----------------------------
            // CARD
            // -----------------------------

            const card =
                document.createElement("article");

            card.className =
                "activity-item";


            // -----------------------------
            // CATALOGUE NUMBER
            // -----------------------------

            const number =
                document.createElement("div");

            number.className =
                "activity-number";

            number.textContent =
                String(index + 1)
                    .padStart(2, "0");

            card.appendChild(number);


            // -----------------------------
            // IMAGE
            // -----------------------------

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


            // -----------------------------
            // ACTIVITY NAME
            // -----------------------------

            const name =
                document.createElement("h3");

            name.className =
                "activity-name";

            name.textContent =
                activityName;

            card.appendChild(name);


            // -----------------------------
            // LOCATION
            // -----------------------------

            const location =
                document.createElement("p");

            location.className =
                "activity-location";

            location.textContent =
                `${place.city} · ${place.country}`;

            card.appendChild(location);


            // -----------------------------
            // RATING
            // -----------------------------

            const ratingContainer =
                document.createElement("div");

            ratingContainer.className =
                "activity-rating";


            const ratingLabel =
                document.createElement("div");

            ratingLabel.className =
                "rating-label";

            ratingLabel.textContent =
                "your rating";

            ratingContainer.appendChild(
                ratingLabel
            );


            const stars =
                document.createElement("div");

            stars.className =
                "rating-stars";


            for (
                let starIndex = 1;
                starIndex <= 5;
                starIndex++
            ) {

                const star =
                    document.createElement("span");

                star.className =
                    "star";


                if (
                    saved.rating >= starIndex
                ) {

                    star.classList.add("full");

                } else if (
                    saved.rating >=
                    starIndex - 0.5
                ) {

                    star.classList.add("half");
                }


                // LEFT HALF

                const left =
                    document.createElement("button");

                left.className =
                    "star-half left";

                left.setAttribute(
                    "aria-label",
                    `${starIndex - 0.5} stars`
                );


                left.addEventListener(
                    "click",
                    () => {

                        saved.rating =
                            starIndex - 0.5;

                        saveActivityData(
                            storageKey,
                            saved
                        );

                        showActivities(place);
                    }
                );


                // RIGHT HALF

                const right =
                    document.createElement("button");

                right.className =
                    "star-half right";

                right.setAttribute(
                    "aria-label",
                    `${starIndex} stars`
                );


                right.addEventListener(
                    "click",
                    () => {

                        saved.rating =
                            starIndex;

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


            ratingContainer.appendChild(stars);

            card.appendChild(
                ratingContainer
            );


            // -----------------------------
            // PERSONAL NOTE
            // -----------------------------

            const reviewContainer =
                document.createElement("div");

            reviewContainer.className =
                "review-container";


            const reviewLabel =
                document.createElement("div");

            reviewLabel.className =
                "review-label";

            reviewLabel.textContent =
                "personal note";

            reviewContainer.appendChild(
                reviewLabel
            );


            const textarea =
                document.createElement("textarea");

            textarea.className =
                "review-input";

            textarea.placeholder =
                "write something about this place...";

            textarea.value =
                saved.review || "";

            reviewContainer.appendChild(
                textarea
            );


            const reviewButton =
                document.createElement("button");

            reviewButton.className =
                "review-button";

            reviewButton.textContent =
                "save note";


            reviewButton.addEventListener(
                "click",
                () => {

                    saved.review =
                        textarea.value;

                    saveActivityData(
                        storageKey,
                        saved
                    );

                    reviewButton.textContent =
                        "saved ✓";


                    setTimeout(() => {

                        reviewButton.textContent =
                            "save note";

                    }, 1200);
                }
            );


            reviewContainer.appendChild(
                reviewButton
            );


            card.appendChild(
                reviewContainer
            );


            // -----------------------------
            // VISITED STATUS
            // -----------------------------

            const visitedContainer =
                document.createElement("div");

            visitedContainer.className =
                "visited-container";


            const visitedButton =
                document.createElement("button");

            visitedButton.className =
                "visited-button";


            function updateVisitedButton() {

                if (saved.visited) {

                    visitedButton.classList.add(
                        "visited"
                    );

                    visitedButton.textContent =
                        "✓ visited";

                } else {

                    visitedButton.classList.remove(
                        "visited"
                    );

                    visitedButton.textContent =
                        "□ not yet visited";
                }
            }


            updateVisitedButton();


            visitedButton.addEventListener(
                "click",
                () => {

                    saved.visited =
                        !saved.visited;



                    saveActivityData(
                        storageKey,
                        saved
                    );


                    updateVisitedButton();


                    date.textContent =
                        saved.visited
                            ? saved.dateVisited
                            : "";
                }
            );


            visitedContainer.appendChild(
                visitedButton
            );


            // -----------------------------
            // VISITED DATE
            // -----------------------------

            const date =
                document.createElement("div");

            date.textContent =
                saved.visited
                    ? saved.dateVisited
                    : "";


            visitedContainer.appendChild(
                date
            );


            card.appendChild(
                visitedContainer
            );


            // -----------------------------
            // ADD CARD
            // -----------------------------

            container.appendChild(card);
        }
    );
}

for (const continent of continents) {
    const button = document.createElement("button");

    button.textContent = continent;

    button.addEventListener("click", () => {
        selectedContinent = continent;
        selectedCountry = null;

        activitiesContainer.innerHTML = "";

        document
            .querySelectorAll("#continent-buttons button")
            .forEach(button => button.classList.remove("active"));

        button.classList.add("active");

        const matchingPlaces = places.filter(
            place => place.continent === continent
        );

        const countries = [...new Set(
            matchingPlaces.map(place => place.country)
        )];

        showCountries(countries);

        filterPlaces();
    });

    buttonContainer.appendChild(button);
}

function showCountries(countryList) {
    countryButtonContainer.innerHTML = "";

    for (const country of countryList) {
        const button = document.createElement("button");

        button.textContent = country;

        button.addEventListener("click", () => {
            selectedCountry = country;

            activitiesContainer.innerHTML = "";

            document
                .querySelectorAll("#country-buttons button")
                .forEach(button => button.classList.remove("active"));

            button.classList.add("active");

            filterPlaces();
        });

        countryButtonContainer.appendChild(button);
    }
}