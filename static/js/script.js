$(document).ready(function(){
  // Configuración del carrusel
  $('.carousel').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: true
  });

  // Configuración del menú hamburguesa
  $("#menu-toggle").on("click", function() {
    $("#mobile-menu").toggleClass("hidden");
  });
});
  