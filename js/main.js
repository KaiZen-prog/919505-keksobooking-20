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

var getElementProperties = function (element) {
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
};

var mapWidth = getElementProperties(mapPins).width;

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

// Определяем размеры генерируемых пинов: создаем один пин, добавляем в разметку, запоминаем его размеры, удаляем пин.
// Последующие пины будем генерировать уже с учетом полученных размеров.
var getPinSizes = function () {
  var apartment = createApartments(1);
  var firstPin = pinTemplate.cloneNode(true);
  firstPin.style.left = (apartment[0].location.x) + 'px';
  firstPin.style.top = (apartment[0].location.y) + 'px';

  var pinImg = firstPin.querySelector('img');
  pinImg.src = apartment[0].author.avatar;
  pinImg.alt = apartment[0].offer.title;

  fragment.appendChild(firstPin);
  mapPins.appendChild(fragment);

  var mapPin = getLastElementOfClass(mapPins, '.map__pin');

  var pinWidth = getElementProperties(mapPin).width;
  var pinHeight = getElementProperties(mapPin).height;

  mapPin.parentNode.removeChild(mapPin);

  return {
    width: pinWidth,
    height: pinHeight
  };
};

var pinSizes = getPinSizes();

var createPin = function (entity) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = (entity.location.x - (pinSizes.width / 2)) + 'px';
  pin.style.top = (entity.location.y - pinSizes.height) + 'px';

  var pinImg = pin.querySelector('img');
  pinImg.src = entity.author.avatar;
  pinImg.alt = entity.offer.title;

  return pin;
};

var renderPins = function (array) {
  for (var i = 0; i < array.length; i++) {
    var pin = createPin(array[i]);
    fragment.appendChild(pin);
  }
  mapPins.appendChild(fragment);
};

var mainPin = document.querySelector('.map__pin--main');

var getPinAddress = function (pin, isPointyEnd) {
  var width = getElementProperties(pin).width;
  var height = getElementProperties(pin).height;
  var left = getElementProperties(pin).left;
  var top = getElementProperties(pin).top;

  var pinAddressX = Math.floor(left + width / 2);

  if (isPointyEnd) {
    var pinPointyEndHeight = parseInt(window.getComputedStyle(pin, 'after').height, 10);
    var pinAddressY = Math.floor(top + height + pinPointyEndHeight);
  } else {
    pinAddressY = Math.floor(top + height / 2);
  }

  return pinAddressX + ', ' + pinAddressY;
};

var adForm = document.querySelector('.ad-form');
var fieldsetCollection = adForm.querySelectorAll('fieldset');
var addressInput = adForm.querySelector('input[name="address"]');

var openMap = function () {
  mainPin.removeEventListener('mousedown', onMainPinMousedown);

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  var apartments = createApartments(apartmentQuantity);
  renderPins(apartments);

  for (var i = 0; i < fieldsetCollection.length; i++) {
    fieldsetCollection[i].disabled = false;
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

for (var i = 0; i < fieldsetCollection.length; i++) {
  fieldsetCollection[i].disabled = true;
}

mainPin.addEventListener('mousedown', onMainPinMousedown);
mainPin.addEventListener('keydown', onMainPinKeydown);

var roomsSelect = adForm.querySelector('#room_number');
var guestsSelect = adForm.querySelector('#capacity');

// Предупреждение о неподходящих вариантах комнат
var onFilterChange = function () {
  var selectedRoomsOption = roomsSelect.value;
  var selectedGuestsOption = guestsSelect.value;
  if ((selectedRoomsOption === '100') && (selectedGuestsOption !== '0')) {
    guestsSelect.setCustomValidity('Вы выбрали 100 комнат. Подходящим вариантом для них является: "не для гостей"');
    roomsSelect.setCustomValidity('');
  } else {
    if (selectedRoomsOption < selectedGuestsOption) {
      guestsSelect.setCustomValidity('Вы выбрали слишком много гостей для вашего количества комнат');
      roomsSelect.setCustomValidity('');
    } else {
      if ((selectedGuestsOption === '0') && (selectedRoomsOption !== '100')) {
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

