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

  // var mapWidth = window.data.getElementProperties(window.util.mapPins).width;
  var mapWidth = parseInt(window.getComputedStyle(window.util.mapPins).width, 10);

  window.data = {
    apartmentQuantity: 8,

    getElementProperties: function (element) {
      var elementWidth = window.getComputedStyle(element).width;
      var elementHeight = window.getComputedStyle(element).height;
      var elementTop = window.getComputedStyle(element).top;
      var elementLeft = window.getComputedStyle(element).left;

      return {
        width: parseInt(elementWidth, 10),
        height: parseInt(elementHeight, 10),
        top: parseInt(elementTop, 10),
        left: parseInt(elementLeft, 10)
      };
    },

    createApartments: function (elementsQuantity) {
      var apartmentsArray = [];
      for (var i = 0; i < elementsQuantity; i++) {
        var apartment = {
          author: {
            avatar: 'img/avatars/user0' + (i + 1) + '.png'
          },

          offer: {
            title: 'Предложение №' + (i + 1),
            price: window.util.getRandomNumber(MIN_PRICE, MAX_PRICE),
            type: window.util.getRandomArrayElement(HOUSING_TYPES),
            rooms: window.util.getRandomNumber(MIN_ROOMS, MAX_ROOMS),
            guests: window.util.getRandomNumber(MIN_GUESTS, MAX_GUESTS),
            checkin: window.util.getRandomArrayElement(CHECKINS),
            checkout: window.util.getRandomArrayElement(CHECKOUTS),
            features: window.util.createRandomArray(FEATURES),
            description: 'Описание предложения №' + (i + 1),
            photos: window.util.createRandomArray(PHOTOS)
          },

          location: {
            x: window.util.getRandomNumber(0, mapWidth),
            y: window.util.getRandomNumber(PIN_MIN_Y, PIN_MAX_Y)
          },
        };
        apartment.offer.address = apartment.location.x + ', ' + apartment.location.y;
        apartmentsArray.push(apartment);
      }
      return apartmentsArray;
    },
  };
})();
