// API base URL for currency conversion
const BASE_URL = "https://api.frankfurter.app/latest";

// Selecting dropdowns, button, and currency selectors
const dropdowns = document.querySelectorAll(".drop-down select");
const button = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Loop through each dropdown and add currency options
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selected currencies
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Update flag when currency is changed
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to change flag image
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Handle button click to fetch exchange rate
button.addEventListener("click", async (evt) => {
  evt.preventDefault(); // Prevent form from refreshing

  let amount = document.querySelector(".amount input");
  let amtValue = amount.value;

  // If amount is empty or less than 1, set to 1
  if (amtValue === "" || amtValue < 1) {
    amtValue = 1;
    amount.value = "1";
  }

  // Build the API URL with selected currencies and amount
  const URL = `${BASE_URL}?amount=${amtValue}&from=${fromCurr.value}&to=${toCurr.value}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    // If conversion rate is not found
    if (!data.rates[toCurr.value]) throw new Error("Invalid conversion");

    const rate = data.rates[toCurr.value];

    // Show converted value
    document.querySelector(".msg").innerText = `${amtValue} ${fromCurr.value} = ${rate} ${toCurr.value}`;
  } catch (err) {
    // Show error message if conversion fails
    document.querySelector(".msg").innerText = "Conversion not supported.";
  }
});
