'use strict';

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

var PIN_MIN_X = 0;
var PIN_MIN_Y = 130;
var PIN_MAX_Y = 630;

var apartmentQuantity = 8;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');

var fragment = document.createDocumentFragment();

var getElementWidth = function (element) {
  var elementWidth = window.getComputedStyle(element, null).getPropertyValue('width');
  return parseInt(elementWidth, 10);
};

var pinMaxX = getElementWidth(mapPins);
var pinWidth = 0;


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

var createApartments = function (elementsQuantity) {
  var apartmentsArray = [];
  for (var i = 0; i < elementsQuantity; i++) {
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
        x: getRandomNumber(PIN_MIN_X + pinWidth, pinMaxX - pinWidth),
        y: getRandomNumber(PIN_MIN_Y, PIN_MAX_Y),
      }
    };
    apartmentsArray.push(apartment);
  }
  return apartmentsArray;
};

var createPin = function (object) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = object.location.x + 'px';
  pin.style.top = object.location.y + 'px';

  var pinImg = pin.querySelector('img');
  pinImg.src = object.author.avatar;
  pinImg.alt = object.offer.title;

  return pin;
};

var getLastElementOfClass = function (parent, childClass) {
  return parent.querySelector(childClass + ':last-child');
};

// Определяем ширину генерируемых пинов: создаем один пин, добавляем в разметку, запоминаем его ширину, удаляем пин.
// Последующие пины будем генерировать уже с учетом полученной ширины.
var getPinWidth = function () {
  var apartment = createApartments(1);
  var pin = createPin(apartment[0]);
  fragment.appendChild(pin);

  mapPins.appendChild(fragment);
  var mapPin = getLastElementOfClass(mapPins, '.map__pin');
  var width = getElementWidth(mapPin);

  mapPin.parentNode.removeChild(mapPin);

  return width;
};

var renderPins = function (array) {
  for (var i = 0; i < array.length; i++) {
    var pin = createPin(array[i]);
    fragment.appendChild(pin);
  }
  mapPins.appendChild(fragment);
};

pinWidth = getPinWidth();
var apartments = createApartments(apartmentQuantity);
renderPins(apartments);

map.classList.remove('map--faded');

