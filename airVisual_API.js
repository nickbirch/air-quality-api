// API key and url
let urlBase = "https://api.airvisual.com/v2/";
let apiKey = "47a1b836-c4a4-4adf-8372-47be553d71b8";

// Selectors
const stateList = document.getElementById("state");
const cityList = document.getElementById("city");
let state = '';

// Do an initial fetch to grab the states to create a dropdown list
fetch(`${urlBase}states?country=USA&key=${apiKey}`)
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    populateStates(result);
  })
  .catch((error) => console.log("error", error));

// Use DOM manipulation to inject states returned in inital fetch into the dropdown
function populateStates(result) {
  let states = result.data.map((list) => `${list.state}`);

  states.forEach((element) => {
    let listItem = document.createElement("option");
    listItem.innerText = element;
    listItem.setAttribute("value", element);
    stateList.appendChild(listItem);
  })}

// Event listener for when user selects a State
stateList.addEventListener("input", getCities)

// Fetch the cities for that selected state
function getCities(e) {
    state = e.target.value;
    fetch(`${urlBase}cities?state=${state}&country=USA&key=${apiKey}`)
        .then((response) => response.json())
        .then((result) => {
            populateCities(result);
        })
}

function populateCities(result) {
    // clear the city list everytime a user selects a different state
    while (cityList.firstChild) {
        cityList.removeChild(cityList.firstChild);
    }
    let cities = result.data.map((list) => `${list.city}`);
  
    cities.forEach((element) => {
      let listItem = document.createElement("option");
      listItem.innerText = element;
      listItem.setAttribute("value", element);
      cityList.appendChild(listItem);
    })}

// Event listener for when a user selects a City
cityList.addEventListener("input", getCityInfo)

// Fetch the weather/air info for that selected city
function getCityInfo(e) {
    let city = e.target.value;
    fetch(`${urlBase}city?city=${city}&state=${state}&country=USA&key=${apiKey}`)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
        })
}
