/**** HEADER-MENU
show and hide side-menu
*/
let menu_width = $(".menu").innerWidth();
$(document).ready(function () {
  $(".side_menu ").css({ left: `-${menu_width}px` });
  // $("main").css({ paddingLeft:`${menu_width}px` });
});

$(".toggle_menu_icon i").click(function () {
  if ($("i").hasClass("fa-bars")) {
    $(".side_menu").animate({ left: 0 }, 500);
    $(".fa-bars").addClass("fa-xmark").removeClass("fa-bars");
  } else {
    $(".side_menu").animate({ left: `-${menu_width}px` }, 500);
    $(".fa-xmark").addClass("fa-bars").removeClass("fa-xmark");
  }
});
