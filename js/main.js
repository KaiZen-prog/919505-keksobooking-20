'use strict';

var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var APARTMENT_QUANTITY = 8;
var MIN_PRICE = 1000;
var MAX_PRICE = 25000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;

var PIN_MIN_X = 0;
var PIN_MAX_X = 1150;
var PIN_MIN_Y = 130;
var PIN_MAX_Y = 630;

var getRandomArrayElement = function (array) {
  var rand = Math.floor(Math.random() * array.length);
  return array[rand];
};

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var createRandomArray = function (array) {
  var newArray = [];
  var newArrayLength = getRandomNumber(0, array.length);
  for (var i = 0; i < newArrayLength; i++) {
    newArray.push(array[i]);
  }
  return newArray;
};

var createApartmentsArray = function () {
  var apartmentsArray = [];
  for (var i = 0; i < APARTMENT_QUANTITY; i++) {
    var apartment = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },

      offer: {
        title: 'Предложение №' + (i + 1),
        address: location.x + ', ' + location.y,
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: getRandomArrayElement(HOUSING_TYPES),
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayElement[CHECKINS],
        checkout: getRandomArrayElement[CHECKOUTS],
        features: createRandomArray(FEATURES),
        description: 'Описание предложения №' + (i + 1),
        photos: createRandomArray(PHOTOS)
      },

      location: {
        x: getRandomNumber(PIN_MIN_X, PIN_MAX_X),
        y: getRandomNumber(PIN_MIN_Y, PIN_MAX_Y),
      }
    };
    apartmentsArray.push(apartment);
  }
  return apartmentsArray;
};

var pinTemplate = document.querySelector('#pin').content;
var mapPins = document.querySelector('.map__pins');

var createPin = function (apartment) {
  var newPin = pinTemplate.cloneNode(true);
  newPin.querySelector('.map__pin').style.left = apartment.location.x + 'px';
  newPin.querySelector('.map__pin').style.top = apartment.location.y + 'px';

  var pinImg = newPin.querySelector('img');
  pinImg.src = apartment.author.avatar;
  pinImg.alt = apartment.offer.title;

  return newPin;
};

var fragment = document.createDocumentFragment();

var renderPins = function () {
  var apartments = createApartmentsArray();

  for (var i = 0; i < apartments.length; i++) {
    var pin = createPin(apartments[i]);
    fragment.appendChild(pin);
  }

  mapPins.appendChild(fragment);
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');

renderPins();

