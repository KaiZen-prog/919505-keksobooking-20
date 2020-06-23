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
var MAIN_PIN_END_HEIGHT = 22;

var KEY_CODE_MOUSE_LEFT = 0;
var KEY_CODE_ENTER = 13;

var apartmentQuantity = 8;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
// var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');

var fragment = document.createDocumentFragment();

var getLastElementOfClass = function (parent, childClass) {
  return parent.querySelector(childClass + ':last-child');
};

var getElementWidth = function (element) {
  var elementWidth = window.getComputedStyle(element, null).width;
  return parseInt(elementWidth, 10);
};

var getElementHeight = function (element) {
  var elementHeight = window.getComputedStyle(element, null).height;
  return parseInt(elementHeight, 10);
};

var getElementTop = function (element) {
  var elementTop = window.getComputedStyle(element, null).top;
  return parseInt(elementTop, 10);
};
var getElementLeft = function (element) {
  var elementLeft = window.getComputedStyle(element, null).left;
  return parseInt(elementLeft, 10);
};


var mapWidth = getElementWidth(mapPins);

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
  pinWidth = getElementWidth(mapPin);
  pinHeight = getElementHeight(mapPin);

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

// Генерация карточек апартаментов. Закомментирована до следующих заданий
/* var createCard = function (entity) {
  var card = cardTemplate.cloneNode(true);

  var title = card.querySelector('.popup__title');
  title.textContent = entity.offer.title;

  var address = card.querySelector('.popup__text--address');
  address.textContent = entity.offer.address.toString();

  var price = card.querySelector('.popup__text--price');
  price.textContent = entity.offer.price + '₽/ночь';

  var housingType = card.querySelector('.popup__type');
  switch (entity.offer.type) {
    case 'palace':
      housingType.textContent = 'Дворец';
      break;

    case 'flat':
      housingType.textContent = 'Квартира';
      break;

    case 'house':
      housingType.textContent = 'Дом';
      break;

    case 'bungalo':
      housingType.textContent = 'Бунгало';
      break;
  }

  var roomsAndGuests = card.querySelector('.popup__text--capacity');
  roomsAndGuests.textContent = entity.offer.rooms + ' комнаты для ' + entity.offer.guests + ' гостей';

  var time = card.querySelector('.popup__text--time');
  time.textContent = 'Заезд после ' + entity.offer.checkin + ', выезд до ' + entity.offer.checkout + '.';


  var features = card.querySelector('.popup__features');
  if (entity.offer.features.length > 0) {
    while (features.firstChild) {
      features.removeChild(features.firstChild);
    }

    var listFragment = document.createDocumentFragment();

    for (var i = 0; i < entity.offer.features.length; i++) {
      var listItem;
      listItem = document.createElement('li');
      listItem.classList.add('popup__feature');

      switch (entity.offer.features[i]) {
        case 'wifi':
          listItem.classList.add('popup__feature--wifi');
          break;

        case 'dishwasher':
          listItem.classList.add('popup__feature--dishwasher');
          break;

        case 'parking':
          listItem.classList.add('popup__feature--parking');
          break;

        case 'washer':
          listItem.classList.add('popup__feature--washer');
          break;

        case 'elevator':
          listItem.classList.add('popup__feature--elevator');
          break;

        case 'conditioner':
          listItem.classList.add('popup__feature--conditioner');
          break;
      }

      listFragment.appendChild(listItem);
    }

    features.appendChild(listFragment);
  } else {
    features.remove();
  }

  var description = card.querySelector('.popup__description');
  description.textContent = entity.offer.description;

  var photos = card.querySelector('.popup__photos');
  if (entity.offer.photos.length > 0) {
    photos.querySelector('img').src = entity.offer.photos[0];

    if (entity.offer.photos.length > 1) {
      var photosFragment = document.createDocumentFragment();

      for (var j = 1; j < entity.offer.photos.length; j++) {
        var img = photos.querySelector('img').cloneNode(true);
        img.src = entity.offer.photos[j];
        photosFragment.appendChild(img);
      }

      photos.appendChild(photosFragment);
    }
  } else {
    photos.remove();
  }

  var avatar = card.querySelector('.popup__avatar');
  avatar.src = entity.author.avatar;

  return card;
};*/

var mainPin = document.querySelector('.map__pin--main');

var getPinAddress = function (pin, isPointyEnd) {
  var width = getElementWidth(pin);
  var height = getElementHeight(pin);

  var pinAddressX = Math.floor(getElementLeft(pin) + width / 2);

  if (isPointyEnd) {
    var pinAddressY = Math.floor(getElementTop(pin) + height + MAIN_PIN_END_HEIGHT);
  } else {
    pinAddressY = Math.floor(getElementTop(pin) + height / 2);
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

  // var card = createCard(apartments[0]);
  // map.insertBefore(card, document.querySelector('.map__filters-container'));
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

// Блокировка неподходящих вариантов комнат

/* var disableRoomsOptions = function (rooms) {
  if (rooms === '100') {
    for (i = 0; i < guestsOptions.length; i++) {
      if (guestsOptions[i].value !== '0') {
        guestsOptions[i].setAttribute('disabled', 'disabled');

        if (guestsSelect.value === guestsOptions[i].value) {
        }
      } else {
        guestsOptions[i].removeAttribute('disabled');
      }
    }
    if (roomsSelect.value)
  } else {
    for (i = 0; i < guestsOptions.length; i++) {
      if ((rooms < guestsOptions[i].value) || (guestsOptions[i].value === '0')) {
        guestsOptions[i].setAttribute('disabled', 'disabled');

        if (guestsSelect.value === guestsOptions[i].value) {
        }
      } else {
        guestsOptions[i].removeAttribute('disabled');
      }
    }
  }
};

// disableRoomsOptions(roomsSelect.value);*/
roomsSelect.addEventListener('change', onFilterChange);
guestsSelect.addEventListener('change', onFilterChange);

