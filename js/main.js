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
var KEY_CODE_ESCAPE = 27;

var apartmentQuantity = 8;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');

var fragment = document.createDocumentFragment();

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

var apartments = createApartments(apartmentQuantity);

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

  var mapPinsCollection = mapPins.querySelectorAll('.map__pin');
  var mapPin = mapPinsCollection[mapPinsCollection.length - 1];

  var pinWidth = getElementProperties(mapPin).width;
  var pinHeight = getElementProperties(mapPin).height;

  mapPin.parentNode.removeChild(mapPin);

  return {
    width: pinWidth,
    height: pinHeight
  };
};

var pinSizes = getPinSizes();

var createPin = function (entity, pinId) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = (entity.location.x - (pinSizes.width / 2)) + 'px';
  pin.style.top = (entity.location.y - pinSizes.height) + 'px';

  pin.id = 'pin' + pinId;

  var pinImg = pin.querySelector('img');
  pinImg.src = entity.author.avatar;
  pinImg.alt = entity.offer.title;

  return pin;
};

var renderPins = function (array) {
  for (var i = 0; i < array.length; i++) {
    var pin = createPin(array[i], i);
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
var roomsSelect = adForm.querySelector('#room_number');
var guestsSelect = adForm.querySelector('#capacity');
var housingTypeSelect = adForm.querySelector('#type');
var priceInput = adForm.querySelector('#price');
var timeInSelect = adForm.querySelector('#timein');
var timeOutSelect = adForm.querySelector('#timeout');

var onHousingTypeChange = function () {
  var housingType = housingTypeSelect.value;

  switch (housingType) {
    case 'bungalo':
      priceInput.setAttribute('min', '0');
      priceInput.setAttribute('placeholder', '0');
      break;

    case 'flat':
      priceInput.setAttribute('min', '1000');
      priceInput.setAttribute('placeholder', '1000');
      break;

    case 'house':
      priceInput.setAttribute('min', '5000');
      priceInput.setAttribute('placeholder', '5000');
      break;

    case 'palace':
      priceInput.setAttribute('min', '10000');
      priceInput.setAttribute('placeholder', '10000');
      break;
  }
};

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

var onTimeInChange = function () {
  var timeIn = timeInSelect.value;

  switch (timeIn) {
    case '12:00':
      timeOutSelect.value = timeIn;
      break;

    case '13:00':
      timeOutSelect.value = timeIn;
      break;

    case '14:00':
      timeOutSelect.value = timeIn;
      break;
  }
};

var onTimeOutChange = function () {
  var timeOut = timeOutSelect.value;

  switch (timeOut) {
    case '12:00':
      timeInSelect.value = timeOut;
      break;

    case '13:00':
      timeInSelect.value = timeOut;
      break;

    case '14:00':
      timeInSelect.value = timeOut;
      break;
  }
};

var openMap = function () {
  mainPin.removeEventListener('mousedown', onMainPinMousedown);

  map.classList.remove('map--faded');
  renderPins(apartments);

  for (var i = 0; i < fieldsetCollection.length; i++) {
    fieldsetCollection[i].disabled = false;
  }

  addressInput.value = getPinAddress(mainPin, true);
  var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (i = 0; i < pins.length; i++) {
    pins[i].addEventListener('click', onMapPinClick);
  }

  adForm.classList.remove('ad-form--disabled');

  roomsSelect.addEventListener('change', onFilterChange);
  guestsSelect.addEventListener('change', onFilterChange);
  housingTypeSelect.addEventListener('change', onHousingTypeChange);
  timeInSelect.addEventListener('change', onTimeInChange);
  timeOutSelect.addEventListener('change', onTimeOutChange);

  // Изначально тип выбранного жилья и минимальная цена за ночь не соответствуют друг другу.
  // Приводим в соответствие.
  onHousingTypeChange();
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

// Генерация карточек апартаментов. Закомментирована до следующих заданий
var createCard = function (entity, cardId) {
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

    for (i = 0; i < entity.offer.features.length; i++) {
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

  card.id = 'card' + cardId;

  return card;
};

// Для автоматически генерируемых элементов мы используем id типа pin1, pin2 и т.д.
// Данная функция возвращает число из произвольного id, которое можно будет использовать как порядковый номер элемента.
var getIntegerFromElementID = function (elementId) {
  var r = /\d+/;
  return elementId.match(r);
};

var closeCard = function (evt) {
  var card = map.querySelector('article');
  var cardNumber = getIntegerFromElementID(card.id);
  var pin = map.querySelector('#pin' + cardNumber);

  evt.target.removeEventListener('click', onCardCloseClick);
  document.removeEventListener('keydown', onCardCloseKeydown);
  pin.addEventListener('click', onMapPinClick);

  card.remove();
};

var onCardCloseClick = function (evt) {
  closeCard(evt);
};

var onCardCloseKeydown = function (evt) {
  if (evt.keyCode === KEY_CODE_ESCAPE) {
    closeCard(evt);
  }
};

var onMapPinClick = function (evt) {
  var cards = map.querySelectorAll('article');

  for (i = 0; i < cards.length; i++) {
    cards[i].remove();
  }

  var pinNumber = getIntegerFromElementID(evt.currentTarget.id);
  var card = createCard(apartments[pinNumber], pinNumber);
  map.insertBefore(card, document.querySelector('.map__filters-container'));
  var cardCloseButton = map.querySelector('.popup__close');

  cardCloseButton.addEventListener('click', onCardCloseClick);
  document.addEventListener('keydown', onCardCloseKeydown);
};
