'use strict';

(function () {
  var MAX_PIN_QUANTITY = 5;

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  var map = document.querySelector('.map');

  window.apartmentsArray = [];

  var pinSizes;

  // Определяем размеры генерируемых пинов: создаем один пин, добавляем в разметку, запоминаем его размеры, удаляем пин.
  // Последующие пины будем генерировать уже с учетом полученных размеров.
  var getPinSizes = function (entity) {
    var firstPin = pinTemplate.cloneNode(true);
    firstPin.style.left = (entity.location.x) + 'px';
    firstPin.style.top = (entity.location.y) + 'px';

    var pinImg = firstPin.querySelector('img');
    pinImg.src = entity.author.avatar;
    pinImg.alt = entity.offer.title;

    fragment.appendChild(firstPin);
    mapPins.appendChild(fragment);

    var mapPinsCollection = mapPins.querySelectorAll('.map__pin');
    var mapPin = mapPinsCollection[mapPinsCollection.length - 1];

    var pinWidth = window.utils.getElementProperties(mapPin).width;
    var pinHeight = window.utils.getElementProperties(mapPin).height;

    mapPin.parentNode.removeChild(mapPin);

    return {
      width: pinWidth,
      height: pinHeight
    };
  };

  // Генерируем пины
  var createPin = function (entity, pinId) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = (entity.location.x - (pinSizes.width / 2)) + 'px';
    pin.style.top = (entity.location.y - pinSizes.height) + 'px';

    var pinImg = pin.querySelector('img');
    pinImg.src = entity.author.avatar;
    pinImg.alt = entity.offer.title;

    pin.id = 'pin' + pinId;

    return pin;
  };

  var deactivatePreviousPin = function () {
    var activePin = map.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
      activePin.addEventListener('click', onMapPinClick);
    }
  };

  var onMapPinClick = function (evt) {
    deactivatePreviousPin();

    evt.currentTarget.removeEventListener('click', onMapPinClick);
    evt.currentTarget.classList.add('map__pin--active');
    window.apartmentCard.open(evt);
  };

  // Проверяем длину отфильтрованного массива апартаментов.
  // Вызывать функцию рендера пинов имеет смысл только если длина ненулевая.
  var preRender = function (array) {
    if (array.length) {
      render(array);
    }
  };

  var render = function (array) {
    var arrayLength = Math.min(array.length, MAX_PIN_QUANTITY);

    for (var i = 0; i < arrayLength; i++) {
      var pin = createPin(array[i], i + 1);
      fragment.appendChild(pin);
    }

    mapPins.appendChild(fragment);

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (i = 0; i < pins.length; i++) {
      pins[i].addEventListener('click', onMapPinClick);
    }
  };

  // Получаем адрес пина; как круглого, так и с острым концом
  var getPinAddress = function (pin, isPointyEnd) {
    var width = window.utils.getElementProperties(pin).width;
    var height = window.utils.getElementProperties(pin).height;
    var left = window.utils.getElementProperties(pin).left;
    var top = window.utils.getElementProperties(pin).top;

    var pinAddressX = Math.floor(left + width / 2);

    if (isPointyEnd) {
      var pinPointyEndHeight = parseInt(window.getComputedStyle(pin, 'after').height, 10);
      var pinAddressY = Math.floor(top + height + pinPointyEndHeight);
    } else {
      pinAddressY = Math.floor(top + height / 2);
    }

    return pinAddressX + ', ' + pinAddressY;
  };

  window.onGetApartments = function (data) {
    window.apartmentsArray = data;
    pinSizes = getPinSizes(window.apartmentsArray[0]);

    preRender(window.apartmentsArray.slice(0, MAX_PIN_QUANTITY));
  };

  // Удаляем все ранее сгенерированные пины
  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };

  window.mapPins = {
    getPinAddress: getPinAddress,
    onClick: onMapPinClick,
    preRender: preRender,
    remove: removePins
  };
})();
