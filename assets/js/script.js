var searchButton = document.querySelector("#search");
var mealButton = document.getElementById("addmeal");
var test1 = document.getElementById("searchTerm");
var input1 = "";
var recipeData = [];
var cardBox = document.getElementById("content");
var mealTracker = [];


//Add an event listener to the button that runs the function sendApiRequest when it is clicked
searchButton.addEventListener("click", ()=>{
  sendApiRequest()
})

test1.addEventListener('keyup', (e) => {
  input1 = e.target.value;
});



//An asynchronous function to fetch data from the API.
async function sendApiRequest(){
  let APP_ID = "a997cc81";
  let API_KEY = "199a564fa6633d7eebfa17053742119c";
  let response = await fetch(`https://api.edamam.com/search?app_id=` + APP_ID + `&app_key=` + API_KEY + `&q=` + input1);
  let data = await response.json();
  var recipeData = data.hits;
  recipeCards(recipeData);
  // console.log(testy);
}


//function that does something with the data received from the API. The name of the function should be customized to whatever you are doing with the data
function recipeCards(recipeData){
  console.log(recipeData);
  for (var i = 0; i < 5; i++) {
    console.log(recipeData);
    var calorieInfo = Math.round((recipeData[i].recipe.calories));
    var carbInfo = Math.round((recipeData[i].recipe.totalNutrients.CHOCDF.quantity));
    var protienInfo = Math.round((recipeData[i].recipe.totalNutrients.PROCNT.quantity));
    var recipeInstructions = recipeData[i].recipe.ingredientLines;
    var recipePicture = recipeData[i].recipe.image;
    var recipeURL = recipeData[i].recipe.url;
    var recipeServingSize = recipeData[i].recipe.yield;
    var singleServing = Math.round((calorieInfo / recipeServingSize));
    var recipeName = recipeData[i].recipe.label;
    var recipeType = recipeData[i].recipe.dishType[0];
    // Needs for each to break down the lines
    cardBox.insertAdjacentHTML("afterbegin", `<div class="card">
    <a href="` + recipeURL + `">
    <div class="card-header">
      <img src="` + recipePicture + `" alt="" />
    </div>
    </a>
    <div class="card-body">
      <span class="tag tag-teal">` + recipeType + `</span>
      <h4>
        ` + recipeName + `
      </h4>
      <h5> Ingredients: </h5>
      <p>
        ` + recipeInstructions + `
      </p>
      <p>
      Calories: ` + singleServing + `kcal | Carbs: ` + carbInfo + `g | Protien: ` + protienInfo + `g
      </p>
      <button id="addMeal">Add Meal to Tracker</button>
      </div>
    </div>
  </div>`)
  }

  $(document).on("click", "#addMeal", function () {
    var mealTime = $(this).prev().text().trim();
    var mealSplit = mealTime.split("|");
    var currentTime = moment().format("MMM Do YY");
    var e = document.getElementById("mealType2");
    var test2 = e.value;
    mealSplit.push(currentTime);
    mealSplit.push(test2);
    mealTracker.push(mealSplit);
    localStorage.setItem("meals", JSON.stringify(mealTracker));
  });

// This function gets the user input and then jQuery interacts with the API and append the results to the food log. 
function myFunction(){
    var text = document.getElementById('inputlg').value;
    var encodedFood = encodeURIComponent(text);
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
            $ (mealType).append("<li>"+response.foods[0].food_name  +" Calories  " + response.foods[0].nf_calories + " Fat  " + response.foods[0].nf_total_fat + " Protein " + response.foods[0].nf_protein+"</li>" );
        
        }

    });
}};
