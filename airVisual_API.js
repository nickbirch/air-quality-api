// API key and url
let urlBase = "http://api.airvisual.com/v2/";
let apiKey = "47a1b836-c4a4-4adf-8372-47be553d71b8";

// Selectors
const stateList = document.getElementById("state");

// Do an initial fetch to grab the states to create a dropdown list
fetch("http://api.airvisual.com/v2/states?country=USA&key=" + apiKey)
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    populateDropdown(result);
  })
  .catch((error) => console.log("error", error));

// Use DOM manipulation to inject states returned in inital fetch into the dropdown
function populateDropdown(result) {
  let states = result.data.map((list) => `${list.state}`);
  console.log(states);
  states.forEach((element) => {
    let listItem = document.createElement("option");
    listItem.innerText = element;
    listItem.setAttribute("value", element);
    stateList.appendChild(listItem);
  });
}
