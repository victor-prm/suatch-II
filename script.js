async function loadJsonData() {
    try {
        const response = await fetch('./html-colors.json'); // Fetch the JSON file
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data');
        }
        const data = await response.json(); // Parse the JSON data
        return data; // Return the array of objects
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

// Call the function and save the result in a variable
let jsonData;
let fuse;
let categories;
loadJsonData().then(data => {
    jsonData = data; // Save the array to a variable
    //console.log(jsonData); // Now you can access the array of objects
    for (let i = 0; i < jsonData.length; i++) {
        document.getElementById("main-content").innerHTML += card(jsonData[i].name, formatHex(jsonData[i].Hex), jsonData[i].RGB, formatCategory(jsonData[i].Category));
    }

    const categorySet = new Set();

    // Create an array of objects for the unique categories
    categories = jsonData.reduce((acc, item) => {
        if (!categorySet.has(item.Category)) {
            categorySet.add(item.Category);
            acc.push({
                Name: formatCategory(item.Category),
                Selected: false
            });
        }
        return acc;
    }, []);

    for (let i = 0; i < categories.length; i++) {
        document.getElementById("filter-items-container").innerHTML += categoryContainer(categories[i].Name);
    }


    //Create a fuzzy search object
    fuse = new Fuse(jsonData, {
        keys: [
            "name",
        ],
        includeScore: true,
        shouldSort: true,
        threshold: 0.12,
        minMatchCharLength: 2,
        isCaseSensitive: false,
    });
});

function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return h + ", " + s + "%, " + l + "%";
}



const searchElement = document.getElementById('search');

const searchData = (event) => {
    const value = event.target.value;
    console.log("Searching...", value);
    // your API call logic goes here
    search(value);
}

const debounce = (callback, waitTime) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, waitTime);
    };
}

const debounceHandler = debounce(searchData, 100);
searchElement.addEventListener('input', debounceHandler);



function search(value) {
    const searchResults = fuse.search(value);
    document.getElementById("main-content").innerHTML = "";

    if ((!searchResults || searchResults.length == 0) && value == 0) {
        for (let i = 0; i < jsonData.length; i++) {
            document.getElementById("main-content").innerHTML += card(jsonData[i].name, formatHex(jsonData[i].Hex), jsonData[i].RGB, formatCategory(jsonData[i].Category));
        }
    } else {
        for (let i = 0; i < searchResults.length; i++) {
            document.getElementById("main-content").innerHTML += card(searchResults[i].item.name, formatHex(searchResults[i].item.Hex), searchResults[i].item.RGB, formatCategory(searchResults[i].item.Category));
        }
    }

    const filteredColors = jsonData.filter(item => selectedCategories.includes(item.Category));
    console.log(filteredColors);
    

}

function formatCategory(cat) {
    return cat.replace('-category', '');
}

function formatHex(hex) {
    return '#' + hex;
}

let menuOpen = false;

function toggleMenu() {
    menuOpen = !menuOpen;
    var newClass = menuOpen ? "search-and-filters menu-open" : "search-and-filters menu-closed";

    var element = document.getElementById("header-dropdown");
    element.className = newClass;
    document.getElementById("search").focus();
}

let selectedCategories = [];
function changeCategorySelection(cat) {
    cat = cat+"-category";
    if (!selectedCategories.includes(cat)) {
        //Add filter
        selectedCategories.push(cat);
    } else {
        //Delete filter
        selectedCategories.pop(cat);
        //selectedCategories = selectedCategories.filter(e => e !== cat);
    }
    console.log(selectedCategories);
}


