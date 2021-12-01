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
}