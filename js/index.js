/**** HEADER-MENU
show and hide side-menu
*/
let meals = [];
let menu_width = $(".menu").innerWidth();
let meals_row = document.querySelectorAll(".row")[0];
let meal_row = document.querySelector("#meal_details");

$(".toggle_menu_icon i").click(function () {
  if ($(".toggle_menu_icon i").hasClass("fa-bars")) {
    $(".side_menu").animate({ left: 0 }, 500);
    $(".fa-bars").addClass("fa-xmark").removeClass("fa-bars");
  } else {
    $(".side_menu").animate({ left: `-${menu_width}px` }, 500);
    $(".fa-xmark").addClass("fa-bars").removeClass("fa-xmark");
  }
});

$(document).ready(function () {
  $(".side_menu ").css({ left: `-${menu_width}px` });
   getMealsByName("");
});

/**
 *
 * Call Api
 */
async function getMealsByName(name) {
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await result.json();
  console.log("in response", data.meals);
  displayMeals(data.meals);
}
async function showMealDetails(mealId) {
  console.log("id", mealId);
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await result.json();
  displayMealDetails(data.meals[0]);
}
/**
 *
 * Display Data
 */
function displayMeals(meals) {
  let meals_cards = meals.map((meal) => {
    return ` <div class="col-md-3" onclick="showMealDetails(${meal.idMeal})">
                <div class="card">
                  <img src=${meal.strMealThumb} alt="">
                  <div class="card_overlay ">
                      <h3>${meal.strMeal}</h3>
                  </div>
                </div>
             </div>`;
  });

  meals_row.innerHTML = meals_cards.join("");
}
function displayMealDetails(meal) {
  let receipes = [];
  $("#meals_row").css("display", "none");
  $("#meal_details").css("display", "flex");

  let tags = meal.strTags ? meal.strTags.split(",") : [];

  let meal_details = `
  <div class="col-md-4">
      <img src="${meal.strMealThumb}" alt="" class="w-100 ">
      <h2>${meal.strMeal}</h2>
  </div>
<div class="col-md-8">
 <h2 class="fs-3 fw-bold">Instructions</h2>
 <p>${meal.strInstructions}</p>
 <p class="fs-3 fw-bold"><span>Area : </span>
     <span>${meal.strArea}</span>
 </p>
 <p class="fs-3 fw-bold"><span>Category : </span>
     <span>${meal.strCategory}</span>
 </p>
<div>
  <p class="fs-3 fw-bold">Recipes :</p>
  <ul id="recipes" class=" list-unstyled d-flex flex-wrap">
   
  </ul>
</div>
 <div>
    <p class="fs-3 fw-bold">tags:</p>
    <ul id="tags" class="list-unstyled d-flex">
    </ul>
 </div>
 
 <div class="my-4">
     <a type="button" class="btn btn-success text-capitalize" href="${meal.strSource}">source</a>
     <a  type="button" class="btn btn-danger text-capitalize" href="${meal.strYoutube}">youtube</a>
 </div>

</div>`;
  let meal_tags = tags.map((tag) => {
    return ` <li class="alert alert-danger ms-2">${tag}</li>`;
  });
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      console.log(meal[`strIngredient${i}`]);
      receipes += `<li>${
        meal[`strMeasure${i}`] + "  " + meal[`strIngredient${i}`]
      }</li>`;
    }
  }

  meal_row.innerHTML = meal_details;
  document.querySelector("#tags").innerHTML = meal_tags.join("");
  document.querySelector("#recipes").innerHTML = receipes;
}
