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

var apartmentQuantity = 8;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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
        x: getRandomNumber(0, mapWidth - pinWidth),
        y: getRandomNumber(PIN_MIN_Y, PIN_MAX_Y),
      },
    };
    apartment.offer.address = apartment.location.x + ', ' + apartment.location.y;
    apartmentsArray.push(apartment);
  }
  return apartmentsArray;
};

var createPin = function (entity) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = entity.location.x + 'px';
  pin.style.top = entity.location.y + 'px';

  var pinImg = pin.querySelector('img');
  pinImg.src = entity.author.avatar;
  pinImg.alt = entity.offer.title;

  return pin;
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

var pinWidth = getPinWidth();

var renderPins = function (array) {
  for (var i = 0; i < array.length; i++) {
    var pin = createPin(array[i]);
    fragment.appendChild(pin);
  }
  mapPins.appendChild(fragment);
};

var createCard = function (entity) {
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
};

var apartments = createApartments(apartmentQuantity);
renderPins(apartments);

var card = createCard(apartments[0]);
map.insertBefore(card, document.querySelector('.map__filters-container'));

map.classList.remove('map--faded');
