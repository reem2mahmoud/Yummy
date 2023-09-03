/**** HEADER-MENU
show and hide side-menu
*/
let meals = [];
let menu_width = $(".menu").innerWidth();
let meals_row = document.querySelector("#meals_row");
let meal_row = document.querySelector("#meal_details");

let email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
let phone_regix = /^01[0125][0-9]{8}$/gm;
let name_regix = /^[a-zA-Z ]+$/;
let age_regix = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
//Minimum eight characters, at least one letter and one number
let pass_regix = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

$(".toggle_menu_icon i").click(function () {
  if ($(".toggle_menu_icon i").hasClass("fa-bars")) {
    openNaveBar();
  } else {
    closeNavBar();
  }
});

$(document).ready(function () {
  closeNavBar();
  getMealsByName("");
  $("#form").css("display", "none");
});

/**
 *
 * Call Api
 */
async function getMealsByName(name) {
  show_hideSpinner("in");
  if (name == "") {
    showRowContainer();
  }
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await result.json();

  displayMeals(data.meals);
}
async function getMealsByLetter(letter) {
  show_hideSpinner("in");
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  let data = await result.json();

  displayMeals(data.meals);
}
async function showMealDetails(mealId) {
  show_hideSpinner("in");
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await result.json();

  displayMealDetails(data.meals[0]);
}
async function getCategories() {
  show_hideSpinner("in");
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await result.json();

  displayCategories(data.categories);
}
async function getMealsByCategory(cat_name) {
  show_hideSpinner("in");
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat_name}`
  );
  let data = await result.json();

  displayMeals(data.meals);
}
async function getAreas() {
  show_hideSpinner("in");
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await result.json();

  displayAreas(data.meals);
}
async function getMealsByArea(area) {
  show_hideSpinner("in");
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await result.json();
  displayMeals(data.meals);
}
async function getIngredients() {
  show_hideSpinner("in");
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await result.json();
  displayIngredients(data.meals);
}
async function getMealsByIngredient(ingredient) {
  show_hideSpinner("in");
  let result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  let data = await result.json();
  displayMeals(data.meals);
}
/**
 *
 * Display Data
 */
function displayMeals(meals) {
  closeNavBar();
  show_hideSpinner("out");
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
  showRowContainer();
  closeNavBar();
  show_hideSpinner("out");
  let receipes = [];
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
      receipes += `<li>${
        meal[`strMeasure${i}`] + "  " + meal[`strIngredient${i}`]
      }</li>`;
    }
  }

  meals_row.innerHTML = meal_details;
  document.querySelector("#tags").innerHTML = meal_tags.join("");
  document.querySelector("#recipes").innerHTML = receipes;
}
function displayCategories(categories) {
  showRowContainer();
  closeNavBar();
  show_hideSpinner("out");
  let cat_list = categories.map((cat) => {
    let desc = cat.strCategoryDescription.substr(0, 120);
    return `<div class="col-md-3" onclick='getMealsByCategory("${cat.strCategory}")'>
    <div class="card bg-transparent">
      <img src=${cat.strCategoryThumb} alt="">
      <div class="card_overlay flex-column text-center">
          <h3>${cat.strCategory}</h3>
          <p>${desc}</p>
      </div>
    </div>
 </div>`;
  });
  meals_row.innerHTML = cat_list.join("");
}
function displayAreas(areas) {
  showRowContainer();
  closeNavBar();
  show_hideSpinner("out");
  let areas_list = areas.map((area) => {
    return `<div class="col-md-3 " onclick='getMealsByArea("${area.strArea}")'>
   <div class="text-center">    <i class="fa-solid fa-house-laptop fa-4x"></i>
   <h3>${area.strArea}</h3></div>

   
 </div>`;
  });
  meals_row.innerHTML = areas_list.join("");
}
function displayIngredients(ingredients) {
  showRowContainer();
  closeNavBar();
  show_hideSpinner("out");
  let ingredients_list = ingredients.map((ingred) => {
    if (ingred.idIngredient <= 20) {
      let desc = ingred.strDescription.substr(1, 100);
      return `<div class="col-md-3 " onclick='getMealsByIngredient("${ingred.strIngredient}")'>
      <div class="text-center">  
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3>${ingred.strIngredient}</h3></div>
        <p class="text-center">${desc}</p>
    </div>`;
    }
  });
  meals_row.innerHTML = ingredients_list.join("");
}
/**
 *
 * Show Forms
 */
function showSearchForm() {
  closeNavBar();
  showFormContainer();

  let form = `
   <form class="row search_form d-flex justify-content-center">
   <div class="col-md-5">
    <input class="form-control search_name" placeholder="Search By Name" onkeyup="searchName()">
   </div>
   <div class="col-md-5">
   <input class="form-control search_letter" placeholder="Search By First Letter" onkeyup="searchLetter()">
   </div>
   
   </form>
  `;
  document.querySelector("#form").innerHTML = form;
}
function showContactForm() {
  closeNavBar();
  showFormContainer();

  $(".row").css("display", "none");
  $("#form").css("display", "flex");
  let form = `
  <form class="row contact_form d-flex justify-content-center align-items-center">
  <div class="col-md-5">
   <input class="form-control" id="name" type="text" placeholder="Enter your Name" onkeyup="enableSubmit()">
   <div class="alert alert-danger name_alert">name not valid</div>
  </div>
   </div>
  <div class="col-md-5">
  <input class="form-control"  id="email" type="email" placeholder="Enter your Email" onkeyup="enableSubmit()">
  <div class="alert alert-danger email_alert">Email not valid *exemple@yyy.zzz</div>
  </div>
  <div class="col-md-5">
  <input class="form-control" id="phone" type="text" placeholder="Enter your Phone" onkeyup="enableSubmit()">
  <div class="alert alert-danger phone_alert">Phone not valid</div>
  </div>
  <div class="col-md-5">
  <input class="form-control " id="age" type="number" placeholder="Enter your Age" onkeyup="enableSubmit()">
  <div class="alert alert-danger age_alert">Enter valid age</div>
  </div>
  <div class="col-md-5">
  <input class="form-control " id="password" type="password" placeholder="Enter your Password" onkeyup="enableSubmit()">
  <div class="alert alert-danger pass_alert">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
  </div>
  <div class="col-md-5">
  <input class="form-control"  id="repassword" type="password" placeholder="Repassword"onkeyup="enableSubmit()" >
  </div>
  <div class="col-md-3 text-center">
  <button class="btn btn-outline-danger text-capitalize" id="submit_btn" disabled>submit</button>
  </div>
  
  </form>
 `;

  document.querySelector("#form").innerHTML = form;
}

function searchName() {
  $("#meals_row").css("display", "flex");
  getMealsByName($(".search_name").val());
}
function searchLetter() {
  $("#meals_row").css("display", "flex");
  getMealsByLetter($(".search_letter").val());
}

function openNaveBar() {
  let li_length = 5;
  for (let x = 0; x < li_length; x++) {
    let time_animate_li = (x + li_length) * 150;
    $(".menu ul li").eq(x).animate({ top: 0 }, time_animate_li);
  }
  $(".side_menu").animate({ left: 0 }, 500);
  $(".fa-bars").addClass("fa-xmark").removeClass("fa-bars");
}
function closeNavBar() {
  $(".menu ul li").animate({ top: 300 }, 500);
  $(".side_menu ").css({ left: `-${menu_width}px` }, 500);
  $(".fa-xmark").addClass("fa-bars").removeClass("fa-xmark");
}
function enableSubmit() {
  let name_val = document.getElementById("name").value;
  let email_val = document.getElementById("email").value;
  let phone_val = document.getElementById("phone").value;
  let age_val = document.getElementById("age").value;
  let pass_val = document.getElementById("password").value;
  let repass_val = document.getElementById("repassword").value;
  let btn = document.querySelector("#submit_btn");
  let disabled = false;

  if (!name_val == "") {
    if (validateInput(name_regix, name_val)) {
      disabled = false;
      document.getElementsByClassName("name_alert")[0].style.display = "none";
    } else {
      disabled = true;
      document.getElementsByClassName("name_alert")[0].style.display = "block";
    }
  }
  if (!email_val == "") {
    if (validateInput(email_regex, email_val)) {
      disabled = false;
      document.getElementsByClassName("email_alert")[0].style.display = "none";
    } else {
      disabled = true;
      document.getElementsByClassName("email_alert")[0].style.display = "block";
    }
  }
  if (!phone_val == "") {
    if (validateInput(phone_regix, phone_val)) {
      disabled = false;
      document.getElementsByClassName("phone_alert")[0].style.display = "none";
    } else {
      disabled = true;
      document.getElementsByClassName("phone_alert")[0].style.display = "block";
    }
  }
  if (!age_val == "") {
    if (validateInput(age_regix, age_val)) {
      disabled = false;
      document.getElementsByClassName("age_alert")[0].style.display = "none";
    } else {
      disabled = true;
      document.getElementsByClassName("age_alert")[0].style.display = "block";
    }
  }
  if (!pass_val == "") {
    if (validateInput(pass_regix, pass_val)) {
      disabled = false;
      document.getElementsByClassName("pass_alert")[0].style.display = "none";
    } else {
      disabled = true;
      document.getElementsByClassName("pass_alert")[0].style.display = "block";
    }
  }
  console.log(disabled);
  btn.disabled = !disabled;
}

function validateInput(regix, input_str) {
  return regix.test(input_str);
}

function showFormContainer() {
  $(".row").css("display", "none");
  $("#form").css("display", "flex");
}
function showRowContainer() {
  $(".row").css("display", "flex");
  $("#form").css("display", "none");
}
function show_hideSpinner(key) {
  if (key == "in") {
    $(".loading").fadeIn(500);
  } else if (key == "out") {
    $(".loading").fadeOut(500);
  }
}
