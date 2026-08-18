const continents = [
    "Asia",
    "Europe",
    "Africa",
    "North America",
    "South America",
    "Oceania"
];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

let places = [];


// =====================================
// CSV PARSER
// =====================================

function parseCSV(text) {
    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"' && insideQuotes && nextChar === '"') {
            value += '"';
            i++;
        }
        else if (char === '"') {
            insideQuotes = !insideQuotes;
        }
        else if (char === "," && !insideQuotes) {
            row.push(value);
            value = "";
        }
        else if ((char === "\n" || char === "\r") && !insideQuotes) {
            if (char === "\r" && nextChar === "\n") {
                i++;
            }

            row.push(value);
            rows.push(row);
            row = [];
            value = "";
        }
        else {
            value += char;
        }
    }

    if (value !== "" || row.length > 0) {
        row.push(value);
        rows.push(row);
    }

    return rows;
}


// =====================================
// LOAD REGIONS + ACTIVITIES
// =====================================

Promise.all([
    fetch("regions.csv"),
    fetch("activities.csv")
])
    .then(async ([regionsResponse, activitiesResponse]) => {

        if (!regionsResponse.ok) {
            throw new Error("Could not load regions.csv");
        }

        if (!activitiesResponse.ok) {
            throw new Error("Could not load activities.csv");
        }

        const regionsText = await regionsResponse.text();
        const activitiesText = await activitiesResponse.text();

        return {
            regions: parseCSV(regionsText),
            activities: parseCSV(activitiesText)
        };
    })
    .then(({ regions, activities }) => {

        // =====================================
        // BUILD PLACES
        // =====================================

        places = regions
            .slice(1)
            .filter(row => row.length > 0 && row[0].trim() !== "")
            .map(row => {

                return {
                    city: row[0]?.trim() || "",
                    country: row[1]?.trim() || "",
                    continent: row[2]?.trim() || "",

                    months: row[3]
                        ? row[3]
                            .split(",")
                            .map(month => month.trim())
                            .filter(month => month !== "")
                        : [],

                    image: row[4]?.trim() || "",
                    description: row[5]?.trim() || "",

                    activities: []
                };
            });


        // =====================================
        // ADD ACTIVITIES TO THEIR CITIES
        // =====================================

        activities
            .slice(1)
            .filter(row => row.length > 0 && row[0].trim() !== "")
            .forEach(row => {

                const city = row[0]?.trim() || "";
                const name = row[1]?.trim() || "";
                const image = row[2]?.trim() || "";

                const place = places.find(
                    p => p.city.toLowerCase() === city.toLowerCase()
                );

                if (place) {
                    place.activities.push({
                        name: name,
                        image: image
                    });
                }
            });


        console.log("Regions loaded:", places);
        console.log("Activities loaded successfully.");


        // =====================================
        // TELL REGION.JS EVERYTHING IS READY
        // =====================================

        document.dispatchEvent(new Event("placesLoaded"));
    })
    .catch(error => {
        console.error("Error loading travel data:", error);
    });