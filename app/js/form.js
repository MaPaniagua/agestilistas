$(document).ready(function() {
  if (sessionStorage.id_user){
    $.stay.id_user = sessionStorage.id_user;
  }
  else {
    // Seteamos el id de sesión del usuario
    getIDUser();
  }

  $.stay.googlePlacesHotel = false;
  if (!jQuery.browser.mobile)
    $("#contact-email-1") && $("#contact-email-1").focus();


  // Prefijo telefónico por países
  // $("#hotel-prefix-1").intlTelInput({
  //   initialCountry: "auto",
  //   preferredCountries: ["es", "us", "gb"],
  //   separateDialCode: true,
  //   geoIpLookup: function(callback) {
  //     if (window.location.protocol !== 'https:'){
  //       $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
  //         if (resp) $.stay.ipinfo = resp;
  //         var countryCode = (resp && resp.country) ? resp.country : "";
  //         callback(countryCode);
  //       });
  //     }
  //   },
  // });

  // Step 1: Evento Form submit
  $("form#form-hotel").submit(function(e) {
    e.preventDefault();
  });

  // Step 2: Evento Form submit
  // $("form#form-contact").submit(function(e) {
  //   e.preventDefault();
  // });

  
  function syncFirstFormToServer() {
    var hotelFormData = $("form#form-hotel").serializeObject();
    if(hotelFormData.hotelPhone) hotelFormData.hotelPhone = $(".selected-dial-code").text() + " " + hotelFormData.hotelPhone;
    if (!/^(f|ht)tps?:\/\//i.test(hotelFormData.web)) {
      hotelFormData.web = "http://" + hotelFormData.web;
    }
    var formType = ($.stay.startingPoint === "prices" ? "branded" : "free");
    saveStepData(formType, 2, false, hotelFormData);
  }

  // function syncSecondFormToServer() {
  //   var contactFormData = $("form#form-contact").serializeObject();
  //   saveStepData("free", 3, false, contactFormData);
  // }

  // Sync data on keyup every second interval
  $('form#form-hotel input').on('keyup', debounce(function (event) {
    // syncFirstFormToServer();
    var formdata = getFormData();
    saveStepData("freeV2", 2, false, formdata);

  }, 1000));

  function getFormData() {
      if (!$.stay.googlePlacesHotel) 
        $.stay.googlePlacesHotel = {};

      var hotelData = $.stay.googlePlacesHotel;
      var formData = {};
      formData.address = {};
      if ($("#contact-email-1").val()) formData.contactEmail = $("#contact-email-1").val();
      if (hotelData.name) formData.hotelName = hotelData.name;
      if (hotelData.website) formData.web = hotelData.website;
      if (hotelData.formatted_address) formData.address = hotelData.formatted_address;
      if (hotelData.international_phone_number) formData.hotelPhone = hotelData.international_phone_number;

      var finalHotelFormData = {};
      finalHotelFormData = setAddressComponentsData(formData);
      $.stay.formdata = finalHotelFormData;

      return finalHotelFormData;
  }

  $('.freeV2-btn').click(function(e) {
    if($("form#form-hotel")[0].checkValidity()){
      $("form#form-hotel").removeClass("form-invalid");
      ga('send', 'event', 'Formulario1', 'Hotel');
      var fdata = getFormData();

      // Step 2
      saveStepData("freeV2", 2, true, fdata).done(function(){
        $("html, body").animate({ scrollTop: 0 }, "fast");
        pushStep();
        // Step 3
        saveStepData("freeV2", 3, true, {}).done(function(){
          // window.history.pushState({}, null, "form.html?lead=success");
          trackAdwordsConversion();
        }).fail(function() {});

      }).fail(function() {});

    } else {
      $("form#form-hotel").addClass("form-invalid");
    }
  }); 

  // $('form#form-contact input').on('keyup', debounce(function (event) {
  //   syncSecondFormToServer();
  // }, 1000));

  // Eventos de botones para avanzar entre pasos del formulario
  // $(".stay-button").click(function(e) {
  //   if ($(this).hasClass("step-1-hotel") || $(this).hasClass("step-1-brand")){
  //     // Formulario FREE:Step 1
  //     ($(this).hasClass("step-1-hotel") ? $.stay.formoption = "hotel" : $.stay.formoption = "brand");

  //     // Formulario válido
  //     if($("form#form-hotel")[0].checkValidity()){
  //       $("form#form-hotel").removeClass("form-invalid");
  //       if ($.stay.formoption == "hotel"){
  //         ga('send', 'event', 'Formulario1', 'Hotel');
  //       } else if ($.stay.formoption == "brand") {
  //         ga('send', 'event', 'Formulario1', 'Cadena');
  //       }

  //       // Form data
  //       var hotelFormData = $("form#form-hotel").serializeObject();
  //       // Teléfono
  //       hotelFormData.hotelPhone = $(".selected-dial-code").text() + " " + hotelFormData.hotelPhone;
  //       // Idioma
  //       var countryData = $("#hotel-prefix-1").intlTelInput("getSelectedCountryData");
  //       if (countryData && countryData.iso2)
  //         hotelFormData.language = countryData.iso2;
  //       else
  //         hotelFormData.language = "";

  //       // Latitude y longitud
  //       if ($.stay.googlePlacesHotel && $.stay.googlePlacesHotel.geometry){
  //         if ($.stay.googlePlacesHotel.geometry.location){
  //           hotelFormData.coordinates = {};
  //           hotelFormData.coordinates.latitude = $.stay.googlePlacesHotel.geometry.location.lat;
  //           hotelFormData.coordinates.longitude = $.stay.googlePlacesHotel.geometry.location.lng;
  //         }
  //       } 
  //       else {
  //         hotelFormData.coordinates = {};
  //         hotelFormData.coordinates.latitude = "";
  //         hotelFormData.coordinates.longitude = "";
  //       }
  //       // Timezone
  //       hotelFormData.timezone = (window.Intl && window.Intl.DateTimeFormat().resolvedOptions().timeZone) || "";
        
  //       if (!/^(f|ht)tps?:\/\//i.test(hotelFormData.web)) {
  //         hotelFormData.web = "http://" + hotelFormData.web;
  //       }

  //       // Tipo de formulario (free o brand)
  //       hotelFormData.type = $.stay.formoption;
  //       // Dirección, Ciudad, país y código postal
  //       // Se obtiene desde google places si se autocompletó el hotel, 
  //       // o desde la ip del usuario si no lo hizo
  //       var finalHotelFormData = {};
  //       if ($.stay.googlePlacesHotel) {
  //         // Google place address info
  //         finalHotelFormData = setAddressComponentsData(hotelFormData);
  //       } else {
  //         // Ip info
  //         finalHotelFormData = setIpInfoData(hotelFormData);
  //       }

  //       $.stay.formdata = finalHotelFormData;

  //       // console.log("Formulario FREE (PASO 1)", $.stay.formdata);

  //       // POST a back
  //       saveStepData("free", 2, true, hotelFormData).done(function(){
  //         // Cambio de step animado
  //         pushStep();
  //       }).fail(function() {
  //         // console.error("setStepData Error");
  //       });
  //     } else {
  //       $("form#form-hotel").addClass("form-invalid");
  //     }
  //   }
  //   else if ($(this).hasClass("step-1-send")){
  //     // Formulario BRANDED:Step 1
  //     if($("form#form-hotel")[0].checkValidity() && (window.stayCaptcha && window.stayCaptcha.length > 0)){
  //       $("form#form-hotel").removeClass("form-invalid");
  //       var pricesFormData = $("form#form-hotel").serializeObject();
  //       $.stay.contactEmail = sessionStorage.staybrandedmail;
  //       pricesFormData["g-recaptcha-response"] = window.stayCaptcha;
  //       $.stay.formdata = pricesFormData;
  //       // console.log("Formulario BRANDED (PASO 1)", $.stay.formdata);
  //       saveStepData("branded", 2, true, pricesFormData).done(function(){
  //         ga('send', 'event', 'Formulario Pricing', 'Enviar');
  //         pushStep();
  //         saveStepData("branded", 3, true, {}).done(function(){
  //             trackAdwordsConversion();
  //           }).fail(function() {
  //             // console.error("setStepData Error");
  //           });
  //       }).fail(function() {
  //         // console.error("setStepData Error");
  //       });

        
  //     } else {
  //       $("form#form-hotel").addClass("form-invalid");
  //     }
  //   }
  //   else if ($(this).hasClass("step-2-send")){
  //     // Formulario FREE:Step 2
  //     if($("form#form-contact")[0].checkValidity() && (window.stayCaptcha && window.stayCaptcha.length > 0)){
  //       $("form#form-contact").removeClass("form-invalid");
  //       var formdata = $.stay.formdata;
  //       var contactFormData = $("form#form-contact").serializeObject();
  //       formdata.contactName = contactFormData.contactName;
  //       formdata.contactEmail = contactFormData.contactEmail;
  //       formdata["g-recaptcha-response"] = window.stayCaptcha;
  //       $.stay.formdata = formdata;
  //       // console.log("Formulario FREE (PASO 2)", $.stay.formdata);
  //       if ($.stay.formoption === 'brand') {
  //         saveStepData("free", 3, true, contactFormData).done(function(){
  //           ga('send', 'event', 'Formulario 2', 'Enviar', 'Cadena');
  //           pushStep();

  //           saveStepData("free", 4, true, {}).done(function(){
  //             trackAdwordsConversion();
  //           }).fail(function() {
  //             // console.error("setStepData Error");
  //           });

  //         }).fail(function() {
  //           // console.error("setStepData Error");
  //         });
  //       } else { 
  //         saveStepData("free", 3, true, contactFormData).done(function(redirectData){
  //           ga('send', 'event', 'Formulario 2', 'Enviar', 'Hotel 2');
  //           // Redirecciona al CMS excepto si es un móvil
  //           (jQuery.browser.mobile ? pushStep() : showLoadingScreen());
  //           //pushStep();
  //         }).fail(function() {
  //           // console.error("setStepData Error");
  //         });
  //       }
  //     } else {
  //       $("form#form-contact").addClass("form-invalid");
  //     }
  //   }
  // });


  // Se precompleta el formulario si se ha escogido un hotel previamente
  if (sessionStorage.stayformhotel)
    $.stay.googlePlacesHotel = JSON.parse(sessionStorage.stayformhotel);
  // else
    // fillHotelName();

  if ($.stay.googlePlacesHotel){
    // ($.stay.startingPoint && $.stay.startingPoint === 'home' ? fillHotelForm() : "");
    setTimeout(function() {
      $(".cd-content-block ul").css("opacity", 1);
    }, 0);
  } else {
    $(".cd-content-block ul").css("opacity", 1);
  }


  // Disable non visible form inputs because of bug in prev/next buttons in safari mobile
  $('.cd-content-block ul li:not(.is-selected) input').attr("readonly", "readonly");

  // Variables necesarias
  var imageWrapper = $('.cd-images-list'),
    imagesList = imageWrapper.children('li'),
    contentWrapper = $('.cd-content-block'),
    contentList = contentWrapper.children('ul').eq(0).children('li'),
    blockNavigation = $('.block-navigation'),
    blockNavigationNext = blockNavigation.find('.cd-next'),
    blockNavigationPrev = blockNavigation.find('.cd-prev'),
    animating = false;


  // Si el usuario viene desde prices.html, se comprueba cuál de los dos tipos de formulario mostrar
  $.stay.startingPoint = sessionStorage.staystartingpoint;
  if ($.stay.startingPoint && $.stay.startingPoint === 'prices'){ 
    // $(".home-type-form-inputs").html("");
    // ga('send', 'event', 'Formulario Pricing', 'Enviar');
    saveStepData("brandedV2", 2, true, {}).done(function(){
      // ga('send', 'event', 'Formulario Pricing', 'Enviar');
      trackAdwordsConversion();
    });

    pushStep();
    $(".first-li").html("");
    $(".second-li").remove();
  } else { 
    // $(".brand-type-form-inputs").html("");
  }

  // ==================================================
  // Funciones para cambio entre pasos del formulario
  // ==================================================

  function pushStep() {
    var direction = $(this),
      indexVisibleblock = imagesList.index(imageWrapper.children('li.is-selected'));

    if(!direction.hasClass('inactive')) {
      // var index = (direction.hasClass('cd-next')) ? (indexVisibleblock + 1) : (indexVisibleblock - 1);
      var index = indexVisibleblock + 1;
      $(".step-image-container").removeClass("active");
      $(".step-image-container.step-"+index).addClass("active");
      updateBlock(index);

    }
  }

  function updateBlock(n, device) {
    if(!animating) {
      animating = true;
      var imageItem = imagesList.eq(n),
        contentItem = contentList.eq(n);
      
      classUpdate($([imageItem, contentItem]));
      
      if( device == 'mobile') {
        contentItem.scrollTop(0);
        $('.cd-image-block').addClass('content-block-is-visible');
        contentWrapper.addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
          contentWrapper.find('.cd-close').addClass('is-scaled-up');
          animating = false;
        });
      } else {
        contentList.addClass('overflow-hidden');
        contentItem.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
          contentItem.siblings().scrollTop(0);
          contentList.removeClass('overflow-hidden');
          animating = false;
        });
      }

      // If browser doesn't support transition
      if( $('.no-csstransitions').length > 0 ) animating = false;

      updateBlockNavigation(n);
    }
  }

  function classUpdate(items) {
    items.each(function(){
      var item = $(this);
      item.addClass('is-selected').removeClass('move-left').siblings().removeClass('is-selected').end().prevAll().addClass('move-left').end().nextAll().removeClass('move-left');
      $('.cd-content-block ul li:not(.is-selected) input').attr("readonly", "readonly");
      $('.cd-content-block ul li.is-selected input').removeAttr("readonly");
    });
  }

  function updateBlockNavigation(n) {
    ( n == 0 ) ? blockNavigationPrev.addClass('inactive') : blockNavigationPrev.removeClass('inactive');
    ( n + 1 >= imagesList.length ) ? blockNavigationNext.addClass('inactive') : blockNavigationNext.removeClass('inactive');
  }


  // ================================================
  // Funciones para inputs
  // ================================================
/*
  // Rellena los inputs con la info del hotel elegido si existe alguna
  function fillHotelForm() {
    // console.log("fillHotelForm");

    // Cambia las palabras "Completa" por "Verifica" ya que el formulario aparece con datos
    $(window.localeAjax).on("locale:success", function() {
      $(".verify-complete-span").html(window.polyglot.t("form.verify"));
    });

    // Fill inputs
    var hotelData = $.stay.googlePlacesHotel;
    // console.log(hotelData);
    if (hotelData.name) $("#hotel-name-1").val(hotelData.name);
    if (hotelData.website) $("#hotel-web-1").val(hotelData.website);
    if (hotelData.formatted_address) $("#hotel-address-1").val(hotelData.formatted_address);
    if (hotelData.formatted_phone_number) $("#hotel-phone-1").val(hotelData.formatted_phone_number);
    if (hotelData.international_phone_number) $("#hotel-prefix-1").intlTelInput("setNumber", hotelData.international_phone_number);

    // Disable inputs and add "Edit" buttons
    $(".first-li").addClass("disabled");
    $(".edit-input").click(function(e) {
      e.preventDefault();
      var editBtn = $(this);
      editBtn.css("display", "none").siblings("input").css("pointer-events", "auto").focus().focusout(function(){
        $(this).css("pointer-events", "none");
        editBtn.css("display", "block");
      });
    });

    // First sync of data
    syncFirstFormToServer();
  }
*/

/*
  // Si no se autocompleta el hotel se rellena el formulario 
  // sólo con el nombre del hotel introducido en el input de home.html
  function fillHotelName() {
    $("#hotel-name-1").val(sessionStorage.stayforminput || "");
  }
*/

  // =============================================================
  // Funciones para guardado de datos y finalización de los steps
  // =============================================================

/*
  // Muestra loading screen mientras se crea el usuario del cms
  function showLoadingScreen() {
    $(".loading-screen").css("opacity", 1);
    setTimeout(function() {
      ga('send', 'event', 'CMS', 'Activado');
      $(".loading-screen h1").addClass("fadeInUp");
    }, 600);

    saveStepData("free", 4, true, {}).done(function(redirectData){
      trackAdwordsConversion();

      // Redireccionamos al cms
      setTimeout(function() {
        saveStepData("free", 4, true, {}, true).done(function(redirectData2){
          if ((redirectData && redirectData.data) && (redirectData.data.autologin && redirectData.data.token))
            redirectToAutologin(redirectData.data.token, redirectData.data.autologin);
        }).fail(function() {
          console.error("setStepData Error");
        });
      }, 1500);
      
    }).fail(function() {
      console.error("setStepData Error");
    });
  }
*/

  // Si google places ha devuelto algún resultado se pueden parsear los "address_components"
  // para devolver, país, coódigo postal, ciudad etc.
  function setAddressComponentsData(data) {
    var firstAddressLine = data.address;
    data.address = {};
    data.address.firstAddressLine = firstAddressLine;

    if ($.stay.googlePlacesHotel && $.stay.googlePlacesHotel.address_components){
      var addressComponents = {}; 
      $.each($.stay.googlePlacesHotel.address_components, function(k,v1) {$.each(v1.types, function(k2, v2){addressComponents[v2]=v1.long_name});})

      if (addressComponents.country)  data.address.country = addressComponents.country;
      if (addressComponents.locality) data.address.city = addressComponents.locality;
      if (addressComponents.administrative_area_level_1) data.address.region = addressComponents.administrative_area_level_1;
      if (addressComponents.postal_code) data.address.postalCode = addressComponents.postal_code;
    }
    return data;
  }

});

// Google captcha callback
// var correctCaptcha = function(response) {
//   window.stayCaptcha = response;
// };

// var expiredCaptcha = function(response) {
//   window.stayCaptcha = "";
// };

