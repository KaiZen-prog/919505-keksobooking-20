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

var PIN_MIN_Y = 130;
var PIN_MAX_Y = 630;

var KEY_CODE_MOUSE_LEFT = 0;
var KEY_CODE_ENTER = 13;

var apartmentQuantity = 8;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');

var fragment = document.createDocumentFragment();

var getLastElementOfClass = function (parent, childClass) {
  return parent.querySelector(childClass + ':last-child');
};

var getElementProperties = function (element, pseudoElement) {
  var elementWidth = window.getComputedStyle(element, pseudoElement).width;
  var elementHeight = window.getComputedStyle(element, pseudoElement).height;
  var elementTop = window.getComputedStyle(element, pseudoElement).top;
  var elementLeft = window.getComputedStyle(element, pseudoElement).left;

  return {
    width: parseInt(elementWidth, 10),
    height: parseInt(elementHeight, 10),
    top: parseInt(elementTop, 10),
    left: parseInt(elementLeft, 10)
  };
};

var mapWidth = getElementProperties(mapPins, null).width;

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
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: getRandomArrayElement(HOUSING_TYPES),
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayElement(CHECKINS),
        checkout: getRandomArrayElement(CHECKOUTS),
        features: createRandomArray(FEATURES),
        description: 'Описание предложения №' + (i + 1),
        photos: createRandomArray(PHOTOS)
      },

      location: {
        x: getRandomNumber(0, mapWidth),
        y: getRandomNumber(PIN_MIN_Y, PIN_MAX_Y)
      },
    };
    apartment.offer.address = apartment.location.x + ', ' + apartment.location.y;
    apartmentsArray.push(apartment);
  }
  return apartmentsArray;
};

var createPin = function (entity) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = (entity.location.x - (pinWidth / 2)) + 'px';
  pin.style.top = (entity.location.y - pinHeight) + 'px';

  var pinImg = pin.querySelector('img');
  pinImg.src = entity.author.avatar;
  pinImg.alt = entity.offer.title;

  return pin;
};

// Определяем размеры генерируемых пинов: создаем один пин, добавляем в разметку, запоминаем его размеры, удаляем пин.
// Последующие пины будем генерировать уже с учетом полученных размеров.
var pinWidth;
var pinHeight;

var getPinSizes = function () {
  var apartment = createApartments(1);
  var pin = createPin(apartment[0]);

  fragment.appendChild(pin);
  mapPins.appendChild(fragment);

  var mapPin = getLastElementOfClass(mapPins, '.map__pin');
  pinWidth = getElementProperties(mapPin, null).width;
  pinHeight = getElementProperties(mapPin, null).height;

  mapPin.parentNode.removeChild(mapPin);
};

getPinSizes();

var renderPins = function (array) {
  for (var i = 0; i < array.length; i++) {
    var pin = createPin(array[i]);
    fragment.appendChild(pin);
  }
  mapPins.appendChild(fragment);
};

var mainPin = document.querySelector('.map__pin--main');

var getPinAddress = function (pin, isPointyEnd) {
  var width = getElementProperties(pin, null).width;
  var height = getElementProperties(pin, null).height;
  var left = getElementProperties(pin, null).left;
  var top = getElementProperties(pin, null).top;

  var pinAddressX = Math.floor(left + width / 2);

  if (isPointyEnd) {
    var pinPointyEndHeight = getElementProperties(pin, 'after').height;
    var pinAddressY = Math.floor(top + height + pinPointyEndHeight);
  } else {
    pinAddressY = Math.floor(top + height / 2);
  }

  return pinAddressX + ', ' + pinAddressY;
};

var adForm = document.querySelector('.ad-form');
var fieldsets = adForm.querySelectorAll('fieldset');
var addressInput = adForm.querySelector('input[name="address"]');

var openMap = function () {
  mainPin.removeEventListener('mousedown', onMainPinMousedown);

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  var apartments = createApartments(apartmentQuantity);
  renderPins(apartments);

  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute('disabled');
  }

  addressInput.value = getPinAddress(mainPin, true);
};

var onMainPinMousedown = function (evt) {
  if (evt.button === KEY_CODE_MOUSE_LEFT) {
    openMap();
  }
};

var onMainPinKeydown = function (evt) {
  if (evt.keyCode === KEY_CODE_ENTER) {
    openMap();
  }
};

addressInput.value = getPinAddress(mainPin, false);

for (var i = 0; i < fieldsets.length; i++) {
  fieldsets[i].setAttribute('disabled', 'disabled');
}

mainPin.addEventListener('mousedown', onMainPinMousedown);
mainPin.addEventListener('keydown', onMainPinKeydown);

var roomsSelect = adForm.querySelector('#room_number');
var guestsSelect = adForm.querySelector('#capacity');

// Предупреждение о неподходящих вариантах комнат
// var guestsOptions = guestsSelect.querySelectorAll('option');
var onFilterChange = function () {
  var rooms = roomsSelect.value;
  var guests = guestsSelect.value;
  if ((rooms === '100') && (guests !== '0')) {
    guestsSelect.setCustomValidity('Вы выбрали 100 комнат. Подходящим вариантом для них является: "не для гостей"');
    roomsSelect.setCustomValidity('');
  } else {
    if (rooms < guests) {
      guestsSelect.setCustomValidity('Вы выбрали слишком много гостей для вашего количества комнат');
      roomsSelect.setCustomValidity('');
    } else {
      if ((guests === '0') && (rooms !== '100')) {
        roomsSelect.setCustomValidity('Для вашего числа гостей подойдет только 100 комнат');
        guestsSelect.setCustomValidity('');
      } else {
        guestsSelect.setCustomValidity('');
        roomsSelect.setCustomValidity('');
      }
    }
  }
};

roomsSelect.addEventListener('change', onFilterChange);
guestsSelect.addEventListener('change', onFilterChange);

