'use strict';

(function () {
  var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var MIN_PRICE = 1000;
  var MAX_PRICE = 25000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 10;
  var PIN_MIN_Y = 130;
  var PIN_MAX_Y = 630;

  window.APARTMENT_QUANTITY = 8;

  var mapPins = document.querySelector('.map__pins');
  var mapWidth = window.utils.getElementProperties(mapPins).width;


  window.createApartments = function (elementsQuantity) {
    var apartmentsArray = [];
    for (var i = 0; i < elementsQuantity; i++) {
      var apartment = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },

        offer: {
          title: 'Предложение №' + (i + 1),
          price: window.utils.getRandomNumber(MIN_PRICE, MAX_PRICE),
          type: window.utils.getRandomArrayElement(HOUSING_TYPES),
          rooms: window.utils.getRandomNumber(MIN_ROOMS, MAX_ROOMS),
          guests: window.utils.getRandomNumber(MIN_GUESTS, MAX_GUESTS),
          checkin: window.utils.getRandomArrayElement(CHECKINS),
          checkout: window.utils.getRandomArrayElement(CHECKOUTS),
          features: window.utils.createRandomArray(FEATURES),
          description: 'Описание предложения №' + (i + 1),
          photos: window.utils.createRandomArray(PHOTOS)
        },

        location: {
          x: window.utils.getRandomNumber(0, mapWidth),
          y: window.utils.getRandomNumber(PIN_MIN_Y, PIN_MAX_Y)
        },
      };
      apartment.offer.address = apartment.location.x + ', ' + apartment.location.y;
      apartmentsArray.push(apartment);
    }
    return apartmentsArray;
  };
})();
