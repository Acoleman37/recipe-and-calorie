const searchButton = document.querySelector("#search");
const mealButton = document.getElementById("addmeal");
const test1 = document.getElementById("searchTerm");
const input1 = "";
const recipeData = [];
const cardBox = document.getElementById("content");
const mealTracker = [];

//Event listener to the button that runs the function sendApiRequest when it is clicked
searchButton.addEventListener("click", (e) => {
  sendApiRequest(e);
});

// Tracks what the user types into the search bar
test1.addEventListener("keyup", (e) => {
  input1 = e.target.value;
});

//An asynchronous function to fetch data from the API.
async function sendApiRequest(e) {
  // every function fires twice for some reason so e.stop... prevents that from happening
  e.stopImmediatePropagation()
  let APP_ID = "a997cc81";
  let API_KEY = "199a564fa6633d7eebfa17053742119c";
  let response = await fetch(
    `https://api.edamam.com/search?app_id=` + APP_ID + `&app_key=` + API_KEY + `&count=6&q=` + input1);
  let data = await response.json();
  const recipeData = data.hits;
  // Sends hits to be made into recipe cards
  recipeCards(recipeData, e);
}

function recipeCards(recipeData, e){
  e.stopImmediatePropagation()
  // Selects and removes cards when searching for more cards
  const element = $(".recipeCardsGen");
  element.remove();
  // Takes our hits and appends them to a div
  for (const i = 0; i < 6; i++) {
    // Lots of information being selected
    const calorieInfo = Math.round((recipeData[i].recipe.calories));
    const fatInfo = Math.round(
      recipeData[i].recipe.totalNutrients.FAT.quantity
    );
    const protienInfo = Math.round((recipeData[i].recipe.totalNutrients.PROCNT.quantity));
    const recipePicture = recipeData[i].recipe.image;
    const recipeURL = recipeData[i].recipe.url;
    const recipeServingSize = recipeData[i].recipe.yield;
    const singleServing = Math.round(calorieInfo / recipeServingSize);
    const recipeName = recipeData[i].recipe.label;
    const infosavedMeals = [recipeName + " Calories: " + singleServing, " Fat: " + fatInfo, " Protien: " + protienInfo]
    // Needs for each to break down the lines
    cardBox.insertAdjacentHTML(
      "afterbegin", `  <div class="recipeCardsGen">
      <div class="col s3 m3">
        <div class="card">
          <div class="card-image">
            <img class="recipeImages" src="` +
          recipePicture +
          `" alt="" />
            <span class="card-title"> <p class="card-text"><strong>` +
          recipeName +
          `</strong></p></span>
          </div>
          <div class="card-content">
          <p> Calories: ` +
          singleServing +
          `kcal | Fat: ` +
          fatInfo +
          `g | Protien: ` +
          protienInfo +
          `g</p>
          </div>
          <div class="card-action">
            <a href=` +
          recipeURL +
          `>Recipe Page</a>
        <button value="` + infosavedMeals + `" id="addMeal">Add Meal to Tracker</button>
          </div>
        </div>
      </div>
    </div>`
    );
  }
}

$(document).on("click", "#addMeal", function (e) {
  e.stopImmediatePropagation();
  // gets our nutrition info and splits the |'s away from it
  const mealTime = $(this).val();
  const mealSplit = mealTime.split("|");
  const currentTime = moment().format("MMM Do YY");
  // selects meal type
  const mealTypeId = document.getElementById("mealType2");
  const mealTypeValue = mealTypeId.value;
  // adding information to an array for later use
  mealSplit.push(currentTime);
  mealSplit.push(mealTypeValue);
  mealTracker.push(mealSplit);
  const mealTrackerAppender = mealTracker[0];
  // appends our recipes on button press
  const $mealtypeContainer = $(`[data-meal-type='${mealTypeValue}']`);
  $mealtypeContainer.append("<li>" + mealTrackerAppender[0] + "</li>" );
  // Sending info to local storage
  localStorage.setItem("meals", JSON.stringify(mealTracker));
});

window.onload = function(e) {
  e.stopImmediatePropagation();
  // Loads meals after page is loaded
  const loadedMeals = localStorage.getItem("meals");
  loadedMeals = JSON.parse(loadedMeals);
  loadEmUp(e, loadedMeals)
}

// Appends our info from local storage
const loadEmUp = function(e, savedMeals) {
  e.stopImmediatePropagation();
  // goes through each item in our array and appends an item for each
  for (const i = 0; i <= savedMeals.length; i++) {
    const saveMealReport = savedMeals[i];
    const date = saveMealReport[1];
    const mealType = saveMealReport[2];
    const $mealtypeContainer = $(`[data-meal-type='${mealType}']`);
    $mealtypeContainer.append("<li>" + date + "- " + saveMealReport[0] + "</li>" );
  }
};

// This function gets the user input and then jQuery interacts with the API and append the results to the food log. 
function myFunction(){
  const text = document.getElementById('inputlg').value;
  const encodedFood = encodeURIComponent(text); 
  const mealType = $("#mealType").val();
  const e = document.getElementById("mealType");
  // Ajax call to API and then appends the returned info to the food log. 
  $.ajax({
    url: `https://trackapi.nutritionix.com/v2/natural/nutrients`,
    headers: {
      'x-app-id': "ab9a46f9",
      'x-app-key': "fafb2d1c269aef94b98a18dce7a44440",
      "Content-Type": "application/json"
    },
    "type": "POST",
    "dataType": 'json',
    'processData': false,
    data: JSON.stringify({"query": encodedFood}),
    success: function(response) {
      
      const $mealtypeContainer = $(`[data-meal-type='${mealType}']`);
      $mealtypeContainer.append("<li>"+response.foods[0].food_name  +" Calories  " + response.foods[0].nf_calories + " Fat  " + response.foods[0].nf_total_fat + " Protein " + response.foods[0].nf_protein+"</li>" );
    
      window.localStorage.setItem("Macros", JSON.stringify(response));

    }
  });
}
