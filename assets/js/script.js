






































































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

  $(document).on('click','#addMeal',function() {
    var poopoo = $(this).prev().text().trim();
    var doodoo = poopoo.split("|");
    var currentTime = moment().format("MMM Do YY")
    doodoo.push(currentTime);
    mealTracker.push(doodoo);
    localStorage.setItem("meals", JSON.stringify(mealTracker));
    })
  };

