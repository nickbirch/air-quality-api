// API key and url
let urlBase = "https://api.airvisual.com/v2/";
let apiKey = "47a1b836-c4a4-4adf-8372-47be553d71b8";

// Selectors
const stateList = document.getElementById("state");
const cityList = document.getElementById("city");
const cityDropdown = document.getElementById('city-selector');
const timeStamp = document.getElementById('time');
const temp = document.getElementById('temp');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const airQuality = document.getElementById('air-quality');
const table = document.querySelector('table');
let state = '';

// Hide the city selector and table, initially
cityDropdown.style.display = 'none';
table.style.display = 'none';


// Do an initial fetch to grab the states to create a dropdown list
fetch(`${urlBase}states?country=USA&key=${apiKey}`)
  .then((response) => response.json())
  .then((result) => {
   // console.log(result);
    populateStates(result);
  })
  .catch((error) => console.log("error", error));

// Use DOM manipulation to inject states returned in inital fetch into the dropdown
function populateStates(result) {
  let states = result.data.map((list) => `${list.state}`);

  // loop of the states array and add them to the dropdown as new elements
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
    table.style.display = 'none';  // re-hides the table in the case of a user switching states
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
    cityDropdown.style.display = 'block';  // unhide the city dropdown selector
    let cities = result.data.map((list) => `${list.city}`);
    
    // add back the blank as the first item
    let listItem = document.createElement("option");
    listItem.innerText = 'Pick City';
    listItem.setAttribute("value", '')
    cityList.appendChild(listItem);
    
    // loop over the city array and add each to the dropdown
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
           // console.log(result);
          renderData(result);
        })
}

// Now let's do something with the city weather/air data
function renderData(cityData){
    while (timeStamp.childNodes[2]) {
        timeStamp.removeChild(timeStamp.childNodes[2]);
        temp.removeChild(temp.childNodes[2]);
        humidity.removeChild(humidity.childNodes[2]);
        windSpeed.removeChild(windSpeed.childNodes[2]);
        airQuality.removeChild(airQuality.childNodes[2]);
    }
    table.style.display = ''; // unhide the table

    // Convert UTC time
    let dateHolder = document.createElement("th");
    const unixTimestamp = cityData.data.current.weather.ts;
    const time = new Date(unixTimestamp);
    const timeString = time.toLocaleString();
    let justTime = timeString.split(" ");
    let justTimeHM = justTime[1].slice(0,-3);
    justTimeHM = `${justTimeHM} ${justTime[2]}`;
 
    // Insert time stamp
    dateHolder.innerText = justTimeHM;
    timeStamp.appendChild(dateHolder);

    // Convert temp and insert
    let tempHolder = document.createElement("td");
    const tempC = cityData.data.current.weather.tp;
    const tempF = Math.round(tempC * 9/5 + 32) + '\xB0';
    tempHolder.innerText = tempF;
    temp.appendChild(tempHolder);

    // Insert Humidity
    let humidityHolder = document.createElement("td");
    const humidityValue = cityData.data.current.weather.hu;
    humidityHolder.innerText = `${humidityValue}%`;
    humidity.appendChild(humidityHolder);

    // Convert and insert wind speed
    let windHolder = document.createElement("td");
    const windValueMS = cityData.data.current.weather.ws;
    const windValueMPH = Math.round(windValueMS * 2.23694);
    windHolder.innerText = `${windValueMPH} mph`;
    windSpeed.appendChild(windHolder);

    // Insert Air Quality Index
    let aqHolder = document.createElement("td");
    const aqValue = cityData.data.current.pollution.aqius;
    aqHolder.innerText = aqValue;
    airQuality.appendChild(aqHolder);

}