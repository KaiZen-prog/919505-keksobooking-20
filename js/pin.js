'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = window.utils.mapPins;
  var fragment = document.createDocumentFragment();

  // Определяем размеры генерируемых пинов: создаем один пин, добавляем в разметку, запоминаем его размеры, удаляем пин.
  // Последующие пины будем генерировать уже с учетом полученных размеров.
  var getPinSizes = function () {
    var apartment = window.data.createApartments(1);
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

    var pinWidth = window.utils.getElementProperties(mapPin).width;
    var pinHeight = window.utils.getElementProperties(mapPin).height;

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

  window.pin = {
    renderPins: function (array) {
      for (var i = 0; i < array.length; i++) {
        var pin = createPin(array[i], i);
        fragment.appendChild(pin);
      }
      mapPins.appendChild(fragment);
    },

    getPinAddress: function (pin, isPointyEnd) {
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
    }
  };
})();
