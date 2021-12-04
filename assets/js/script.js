var searchButton = document.querySelector("#search");
var mealButton = document.getElementById("addmeal");
var test1 = document.getElementById("searchTerm");
var input1 = "";
var recipeData = [];
var cardBox = document.getElementById("content");
var mealTracker = [];
var savedMeals = [];
var newArr = [];

//Add an event listener to the button that runs the function sendApiRequest when it is clicked
searchButton.addEventListener("click", (e) => {
  sendApiRequest();
  trackerLoader(e);
});

test1.addEventListener("keyup", (e) => {
  input1 = e.target.value;
});

//An asynchronous function to fetch data from the API.
async function sendApiRequest() {
  let APP_ID = "a997cc81";
  let API_KEY = "199a564fa6633d7eebfa17053742119c";
  let response = await fetch(
    `https://api.edamam.com/search?app_id=` +
      APP_ID +
      `&app_key=` +
      API_KEY +
      `&q=` +
      input1
  );
  let data = await response.json();
  var recipeData = data.hits;
  recipeCards(recipeData);
}

//function that does something with the data received from the API. The name of the function should be customized to whatever you are doing with the data
function recipeCards(recipeData){
  for (var i = 0; i < 5; i++) {
    var calorieInfo = Math.round(recipeData[i].recipe.calories);
    var fatInfo = Math.round(
      recipeData[i].recipe.totalNutrients.FAT.quantity
    );
    var protienInfo = Math.round(
      recipeData[i].recipe.totalNutrients.PROCNT.quantity
    );
    var recipeInstructions = recipeData[i].recipe.ingredientLines;
    var recipePicture = recipeData[i].recipe.image;
    var recipeURL = recipeData[i].recipe.url;
    var recipeServingSize = recipeData[i].recipe.yield;
    var singleServing = Math.round(calorieInfo / recipeServingSize);
    var recipeName = recipeData[i].recipe.label;
    var recipeType = recipeData[i].recipe.dishType[0];
    // Needs for each to break down the lines
    cardBox.insertAdjacentHTML(
      "afterbegin",
      `<div class="card">
    <a href="` +
        recipeURL +
        `">
    <div class="card-header">
      <img src="` +
        recipePicture +
        `" alt="" />
    </div>
    </a>
    <div class="card-body">
      <span class="tag tag-teal">` +
        recipeType +
        `</span>
      <h4 id="recipeName">
        ` +
        recipeName +
        `
      </h4>
      <h5> Ingredients: </h5>
      <p>
        ` +
        recipeInstructions +
        `
      </p>
      <p>
      Calories: ` +
        singleServing +
        `kcal | Fat: ` +
        fatInfo +
        `g | Protien: ` +
        protienInfo +
        `g
      </p>
      <button id="addMeal">Add Meal to Tracker</button>
      </div>
    </div>
  </div>`
    );
  }
};

$(document).on("click", "#addMeal", function (e) {
  e.stopImmediatePropagation();
  var mealInfo = $(this).prev().text().trim();
  var recipeName = $("#recipeName").text().trim();
  var mealInfoSplit = mealInfo.split("|");
  var currentTime = moment().format("MMM Do YY").toString();
  var mealType2 = document.getElementById("mealType2");
  var saveMealType2 = mealType2.value;
  // adding meal type
  mealInfoSplit.push(saveMealType2);
  mealInfoSplit.push(recipeName)
  // putting date into the tracker
  mealTracker.push(mealInfoSplit);
  localStorage.setItem("meals", JSON.stringify(mealTracker));
});



var trackerLoader = function(e) {
  e.stopImmediatePropagation();
  var savedMeals = localStorage.getItem("meals");
  console.log("savedMeals1: " + savedMeals);
  savedMeals = JSON.parse(savedMeals);

  if (!savedMeals) {
    return false;
  }

  for (var i = 0; i < savedMeals.length; i++) {
    console.log("test: " + savedMeals);
    savedMeals = savedMeals[i];
    var $mealtypeContainer = $(`[data-meal-type=${savedMeals[3]}]`);
    $mealtypeContainer.append("<li>" + savedMeals[3] + " " + savedMeals[4] + " " + savedMeals[0] + savedMeals[1] + savedMeals[2]+"</li>" );
  }
};

  
  // Add the current date to the option section
  // then append each item it it's appropriate section
  // add the meal type to the start of the append, maybe another for loop

  $(document).on("click", "#addMeal", function (e) {
    e.stopImmediatePropagation();
    var mealTime = $(this).prev().text().trim();
    var mealSplit = mealTime.split("|");
    var currentTime = moment().format("MMM Do YY");
    var w = document.getElementById("mealType2");
    var test2 = w.value;
    mealSplit.push(currentTime);
    mealSplit.push(test2);
    mealTracker.push(mealSplit);
    localStorage.setItem("meals", JSON.stringify(mealTracker));
  });



// This function gets the user input and then jQuery interacts with the API and append the results to the food log. 
function myFunction(){
  var text = document.getElementById('inputlg').value;
  var encodedFood = encodeURIComponent(text); 
  var mealType = $("#mealType").val();
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
      
      }
  });
}

window.onload = function(e) {
  trackerLoader(e);
};
