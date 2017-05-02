$(document).ready(function() {
  getIDUser();

  var buildingName = "";

  // Opening animations
  // setTimeout(function() {  
  //   $(".header-text .animated").addClass("fadeInUp");
  // }, 700);
  // setTimeout(function() {
  //   $(".animated-fadein").addClass("fadeIn");
  // }, 1200);

  if (!jQuery.browser.mobile)
    $("#hotel-name-input").focus();

  // Header video load
  // if ($(window).width() > 830){
  //   $("#background_video").removeClass("hidden");
  //   var bv = new Bideo();
  //   bv.init({
  //     videoEl: document.querySelector('#background_video'),
  //     container: document.querySelector('.sub-header'),
  //     resize: true,
  //     autoplay: true,
  //     isMobile: window.matchMedia('(max-width: 768px)').matches,
  //     src: []
  //   });

  // } else {

  //   if ($(window).width() > 769) {
  //     $(".background-video-overlay").hide();
  //   }
  // }
  
    // Ip info
  if (window.location.protocol !== 'https:'){
    var data = {autocompleted:false, hotelName: ""};
    $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      if (resp) $.stay.ipinfo = resp;
    });
  }

  // Google places
  $("input.hotel-name-input").geocomplete({
    types: ['establishment']
  }).bind("geocode:result", function(event, result){
    sessionStorage.stayformhotel = JSON.stringify(result);
    buildingName = result.name || "";
    sessionStorage.staystartingpoint = "home";
    var data = {autocompleted:true, hotelName:buildingName};
    setIpInfoData(data, "ipinfo");
    saveStepData("freeV2", 1, false, data);
  });

  // Only show autocomplete with minimum of 3 chars
  $('input.hotel-name-input').keyup(function(e) {
    e.preventDefault();
    var val = $(this).val().trim();
    if(val.length && val.length > 2) {
      $(".pac-container").css("visibility", "visible");
    } else {
      $(".pac-container").css("visibility", "hidden");
    }
  });


  // Sync data on keyup every second interval
  $('input.hotel-name-input').on('keyup', debounce(function (event) {
    var value = $(event.currentTarget).val();
    if (value && value.trim().length && value.trim().length > 2){
      var data = {autocompleted:false, hotelName: value};
      setIpInfoData(data, "ipinfo");
      saveStepData("freeV2", 1, false, data);
    }
  }, 1000));


  // Evento para cambiar el color de la barra de navegación al hacer scroll
  // activateScrollListener();

  // Traduce placeholder
  $(window.localeAjax).on("locale:success", function() {
    $("input.hotel-name-input").attr("placeholder", window.polyglot.t('miniform.placeholder'));
  });


  // Muestra y esconde el cursor animado en los inputs
  // $("input.hotel-name-input").focus(function() {
  //   $('.blinking-caret').css('display', "none");
  // });

  // $("input.hotel-name-input").focusout(function() {
  //   if (!$(this).val())
  //     $('.blinking-caret').css('display', "block");
  // });

  // $(".prices-link").click(function(e) {
  //   e.preventDefault();
  //   ga('send', 'event', 'Home', 'B.Pricing');

  //   setTimeout(function() {
  //       window.location.href = './prices.html';
  //   }, 200);
  // });

  $(".client-access-btn").click(function(e) {
    e.preventDefault();
    ga('send', 'event', 'Home', 'Clientes');

    setTimeout(function() {
        window.location.href = 'https://cms.stay-app.com';
    }, 200);
  });

  // Click en el enlace de los mini formularios
  $("button.try-stay-btn").click(function(e) {
    e.preventDefault();
    var gaevent = $(this).data("event");
    ga('send', 'event', 'Home', gaevent);

    sessionStorage.staystartingpoint = "home";
    
    var val1 = $("#hotel-name-input").val().trim();
    // var val2 = $("#hotel-name-input-2").val().trim();

    if (!val1.length || val1.length < 3){
      delete sessionStorage.stayformhotel;
      showHotelInputPopover();
      if($(this).hasClass("join-stay-btn") && jQuery.browser.mobile){
        $('html, body').animate({
          scrollTop: $("#hotel-name-input").offset().top - 210
        }, 600);
      }
    } else {
      // Si no autocompleta hotel se guarda el texto del input
      if (!sessionStorage.stayformhotel){
        var hotelName = $("input.hotel-name-input").val() || "";
        sessionStorage.stayforminput = hotelName;
        var data = {autocompleted:false, hotelName:hotelName};
        setIpInfoData(data, "ipinfo");
        saveStepData("freeV2", 1, true, data).done(function(){
          setTimeout(function() {window.location.href = './form.html';}, 100);
        }).fail(function() {});
      } else {
        var data = {autocompleted:true, hotelName:buildingName};
        setIpInfoData(data, "ipinfo");
        saveStepData("freeV2", 1, true, data).done(function(){
          setTimeout(function() {window.location.href = './form.html';}, 100);
        }).fail(function() {});
      }
    }
  });

  // Animación de Imágenes en pantalla de iPhone 
  // if (!jQuery.browser.mobile) {
  //   var $mobileScreenFeatures = $(".landing-feature-m .col-xs-9");
  //   $mobileScreenFeatures.on("mouseenter", function() {
  //     $mobileScreenFeatures.removeClass("onhover");
  //     $(this).addClass("onhover");
  //     $(".screen-mobile-img.fadeInRight").removeClass("fadeInRight").addClass("fadeOutLeft");
  //     var that = $(this);
  //       $(".screen-mobile-img-"+that.data("hover-img")).removeClass("fadeOutLeft").addClass("fadeInRight");
  //   });
  // }

  
  $(".try-button-form").click(function(e) {
    e.preventDefault();
    showHotelInputPopover();
    $('html, body').animate({
      scrollTop: $("#hotel-name-input").offset().top - 210
    }, 600);
  });

});
