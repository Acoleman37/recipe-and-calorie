var searchButton = document.querySelector("#search");
var mealButton = document.getElementById("addmeal");
var test1 = document.getElementById("searchTerm");
var input1 = "";
var recipeData = [];
var cardBox = document.getElementById("content");
var mealTracker = [];

//Add an event listener to the button that runs the function sendApiRequest when it is clicked
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
  var recipeData = data.hits;
  // Sends hits to be made into recipe cards
  recipeCards(recipeData, e);
}

//function that does something with the data received from the API. The name of the function should be customized to whatever you are doing with the data
function recipeCards(recipeData, e){
  e.stopImmediatePropagation()
  // Selects and removes cards when searching for more cards
  var element = $(".recipeCardsGen");
  element.remove();
  // Takes our hits and appends them to a div
  for (var i = 0; i < 6; i++) {
    // Lots of information being selected
    var calorieInfo = Math.round((recipeData[i].recipe.calories));
    var fatInfo = Math.round(
      recipeData[i].recipe.totalNutrients.FAT.quantity
    );
    var protienInfo = Math.round((recipeData[i].recipe.totalNutrients.PROCNT.quantity));
    var recipePicture = recipeData[i].recipe.image;
    var recipeURL = recipeData[i].recipe.url;
    var recipeServingSize = recipeData[i].recipe.yield;
    var singleServing = Math.round(calorieInfo / recipeServingSize);
    var recipeName = recipeData[i].recipe.label;
    var infosavedMeals = [recipeName + " Calories: " + singleServing, " Fat: " + fatInfo, " Protien: " + protienInfo]
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
  var mealTime = $(this).val();
  var mealSplit = mealTime.split("|");
  var currentTime = moment().format("MMM Do YY");
  var e = document.getElementById("mealType2");
  var test2 = e.value;
  mealSplit.push(currentTime);
  mealSplit.push(test2);
  mealTracker.push(mealSplit);
  localStorage.setItem("meals", JSON.stringify(mealTracker));
});

window.onload = function(e) {
  // e.stopImmediatePropagation();
  var loadedMeals = localStorage.getItem("meals");
  loadedMeals = JSON.parse(loadedMeals);
  loadEmUp(e, loadedMeals)
}

var loadEmUp = function(e, savedMeals) {
  e.stopImmediatePropagation();
  console.log(savedMeals);
  for (var i = 0; i <= savedMeals.length; i++) {
    var saveMealReport = savedMeals[i];
    var date = saveMealReport[1];
    var mealType = saveMealReport[2];
    console.log("date: " + date + " mealtype: " + mealType);
    var $mealtypeContainer = $(`[data-meal-type='${mealType}']`);
    $mealtypeContainer.append("<li>" + saveMealReport[0] + "</li>" );
  }
};

// This function gets the user input and then jQuery interacts with the API and append the results to the food log. 
function myFunction(){
  var text = document.getElementById('inputlg').value;
  var encodedFood = encodeURIComponent(text); 
  var mealType = $("#mealType").val();
  var e = document.getElementById("mealType");
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

      // create the LI
      // create the text for the LI
      // append the LI to myOl element
      // let mealType = dropdown menu result #breakfast
      
      var $mealtypeContainer = $(`[data-meal-type='${mealType}']`);
      $mealtypeContainer.append("<li>"+response.foods[0].food_name  +" Calories  " + response.foods[0].nf_calories + " Fat  " + response.foods[0].nf_total_fat + " Protein " + response.foods[0].nf_protein+"</li>" );
    
      window.localStorage.setItem("Macros", JSON.stringify(response));

      }
  });
}
