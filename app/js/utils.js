
window.stayBaseUrl = "https://webapi.stay-app.com/";
window.stayCMSUrl = "https://cms.stay-app.com/";


// Mobile detection regex
// jQuery.browser.mobile === true para móviles
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);


// Animate nabvar background color on scroll
function activateScrollListener(previousPath) {
  previousPath = previousPath || "";
  var docElem = document.documentElement,
    header = document.querySelector( '.navbar-fixed-top' ),
    didScroll = false,
    changeHeaderOn = 80;
  function init() {
    window.addEventListener( 'scroll', function( event ) {
      if( !didScroll ) {
        didScroll = true;
        setTimeout( scrollPage, 250 );
      }
    }, false );
  }
  function scrollPage() {
    var sy = scrollY();
    if ( sy >= changeHeaderOn ) {
      $(header).addClass('navbar-expanded');
      $('.stay-logo').attr('srcset', previousPath+'img/logo-stay-negro.png 1x, '+previousPath+'img/logo-stay-negro@2x.png 2x');
      $('.stay-logo').attr('src', previousPath+'img/logo-stay-negro.png');
    }
    else {
      $(header).removeClass('navbar-expanded');
      $('.stay-logo').attr('srcset', previousPath+'img/stay-logo.png 1x, '+previousPath+'img/stay-logo@2x.png 2x');
      $('.stay-logo').attr('src', previousPath+'img/stay-logo.png');
    }
    didScroll = false;
  }
  function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
  }
  
  init();
}

// Consigue el id de usuario para usarlo en todas las peticiones
function getIDUser() {

  var deferred = $.Deferred();
  var url = window.stayBaseUrl + "mark/get-id-user";
  $.ajax({
    type: "GET",
    url: url,
    contentType: "application/json",
    success: function(jqHXR) {
      if (jqHXR && jqHXR.data && jqHXR.data.id_user){
        $.stay.id_user = jqHXR.data.id_user;
      }
      else {
        $.stay.id_user = "";
      }
      sessionStorage.id_user = $.stay.id_user;
    }
  });

  return deferred.promise();
}


// Guarda en back los datos de un step del formulario
function saveStepData(formId, step, completed, formData, timeTracking) {

  var deferred = $.Deferred();

  var data = {
    formId:formId,
    step:step,
    completed:completed,
    formData:formData,
    id_user:$.stay.id_user
  };

  // console.log(JSON.stringify(data, null, 4));
  var url = window.stayBaseUrl + "mark/";
  // if (step == 4){
  //   timeTracking ? data.formData.timeTracking=true : data.formData.timeTracking=false;
  // }
  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json",
    xhrFields: {
      withCredentials: true
    },
    data: JSON.stringify(data),
    success: function(jqHXR) {
      if (jqHXR.errors.length) {
        if ( $.inArray('API_EXCEPTION_STEP_ALREADY_COMPLETED', jqHXR.errors) > -1 ) {
          deferred.resolve(jqHXR);
        }
        else {
          deferred.reject(jqHXR.errors);
        }
      } else {
        deferred.resolve(jqHXR);
      }
    },
    error: function(error) {
      if (error.responseJSON && error.responseJSON.errors.length) {
        if ( $.inArray('API_EXCEPTION_STEP_ALREADY_COMPLETED', error.responseJSON.errors) > -1 ) {
          deferred.resolve(error);
        }
        else {
          deferred.reject(error);
        }
      } else {
        deferred.reject(error);
      }
    }
  });

  return deferred.promise();
}

// Añade a los datos del formulario la info obtenida en el request de ipinfo.io
function setIpInfoData(data, property) {
  if (!property) 
    property = "address";

  var firstAddressLine = data.address;
  data[property] = {};
  data[property].firstAddressLine = firstAddressLine;

  if ($.stay.ipinfo){
    var resp = $.stay.ipinfo;
    if ((resp.country && resp.city) && (resp.region)){
      data[property] || (data[property] = {});
      data[property].country = resp.country;
      data[property].city = resp.city;
      data[property].region = resp.region;
      data[property].postalCode = resp.postal;
    }
  }
  return data;
}

function redirectToAutologin(token, autologin) {
  $('<form action="'+window.stayCMSUrl+'sso/login" method="POST"/>')
    .append($('<input type="hidden" name="token" value="' + token + '"><input type="hidden" name="autologin" value="' + autologin + '">'))
    .appendTo($(document.body))
    .submit();
}

function trackAdwordsConversion() {
  if (typeof window.google_trackConversion === 'function'){
    // Adwords conversion
    console.log("trackConversion");
    window.google_trackConversion({
      google_conversion_id: 974488302,
      google_remarketing_only: false,
      google_conversion_label: "zJN6CPfP62AQ7oXW0AM",
      google_conversion_language : "en",
      google_conversion_format : "3",
      google_conversion_color : "ffffff"
    }); 
  }
}

function showHotelInputPopover() {
  $(".hotel-input-popover").addClass("visible");
  $(".black-overlay").addClass("visible");
  setTimeout(function(){$(".hotel-input-popover").addClass("animated shake");}, 250);
  $("#hotel-name-input").addClass("z-index-1032 is-focus");
  if (!jQuery.browser.mobile){
    $("#hotel-name-input").focus();
  }
}

function closeHotelInputPopover() {
  $("#hotel-name-input").removeClass("z-index-1032 is-focus");
  $(".hotel-input-popover").removeClass("visible");
  $(".black-overlay").removeClass("visible");
  $(".hotel-input-popover").removeClass("animated shake");
}
  
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 1000);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

var debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = Date.now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

$(document).ready(function() {

  if (!$.stay)
    $.stay = {};

  

  // Serialize form to JSON
  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  // Evitar que al pulsar la tecla de borrar el navegador muestre la página anterior.
  // Es útil si el usuario intenta borrar un input sin tenerlo enfocado.
  $(document).on("keydown", function (e) {
    if (e.which === 8 && !$(e.target).is("input, textarea")) {
      e.preventDefault();
    }
  });

  $(".close-popover-btn").click(function(e) {
    e.preventDefault();
    closeHotelInputPopover();
  });


  // Internationalization
  window.polyglot = new Polyglot();
  var locale = ((navigator.languages !== undefined) ? navigator.languages[0] : navigator.language || 'en');
   
  var simplifiedLocale = locale.split("-");
  window.localeAjax = $.getJSON('js/i18n/' + simplifiedLocale[0] + '.json', function(data) {
    window.polyglot.extend(data);
    $(".translate").each(function() {
      if(window.polyglot.t($(this).data("translate")))
        $(this).html(window.polyglot.t($(this).data("translate")));
    });
    $(window.localeAjax).triggerHandler("locale:success");
  }).fail(function(jqXHR, textStatus) {
    this.url = "js/i18n/en.json";
    $.ajax(this);
  });

  //Animate Know your guest like
  $('.mobile-screens-block li').hover(function(){
    var $this = $(this);
    if($this.closest('.two-steps').length != 0){
      animateMobile($this, '.mobile-step');
    }else{
      animateMobile($this, '.mobile-screens-block');
    }
  });

  function animateMobile($this, closestClass){
    //var $this = $(this);
    var classImage = $this.attr('data-img');
    var $mobilStep = $this.closest(closestClass);

    //change li selected
    $mobilStep.find('li').removeClass('selected');
    $this.addClass('selected');

    //change img
    $mobilStep.find('.image-mobile .content-mobile:not(.hidden)').addClass('hidden');
    $mobilStep.find('.image-mobile .content-mobile.'+ classImage).removeClass('hidden');
  }

  //Animate Know your guest like
  $('.conditions-container li a').click(function(e) {
    e.preventDefault();
    var $this = $(this);
    var $liparent = $this.closest('li');
    if(!$liparent.hasClass('active')){
      var id = $this.attr('aria-controls');
      var $conditionsContainer = $this.closest('.conditions-container');
      $conditionsContainer.find('ul.nav-tabs li').removeClass('active');
      $this.closest('li').addClass('active');

      $conditionsContainer.find('.tab-content .tab-pane').removeClass('active');
      $conditionsContainer.find('.tab-content .tab-pane#'+id).addClass('active');
    }
  });

});
