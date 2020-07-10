'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  window.apartments = [];
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

    pin.id = 'pin' + pinId;

    var pinImg = pin.querySelector('img');
    pinImg.src = entity.author.avatar;
    pinImg.alt = entity.offer.title;

    return pin;
  };

  var onClick = function (evt) {
    window.apartmentCard.open(evt);
  };

  var render = function () {
    for (var i = 0; i < window.apartments.length; i++) {
      var pin = createPin(window.apartments[i], i);
      fragment.appendChild(pin);
    }
    mapPins.appendChild(fragment);

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (i = 0; i < pins.length; i++) {
      pins[i].addEventListener('click', onClick);
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
    window.apartments = window.utils.getRandomArrayElementsCollection(data, data.length);
    pinSizes = getPinSizes(window.apartments[0]);
  };

  window.load(window.onGetApartments, window.renderErrorPopup);

  window.mapPins = {
    render: render,
    getPinAddress: getPinAddress,
    onClick: onClick
  };
})();
