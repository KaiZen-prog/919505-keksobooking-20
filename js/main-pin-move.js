'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var pinWidth = window.utils.getElementProperties(mainPin).width;
  var pinHeight = window.utils.getElementProperties(mainPin).height;

  var mapPins = document.querySelector('.map__pins');
  var mapWidth = window.utils.getElementProperties(mapPins).width;

  var adForm = document.querySelector('.ad-form');
  var addressInput = adForm.querySelector('input[name="address"]');

  var isPointyEnd = false;
  var pinPointyEndHeight = 0;

  // Ограничиваем перемещение пина в рамках заданных координат
  var minLeft = 0 - pinWidth / 2;
  var maxLeft = mapWidth - Math.floor(pinWidth / 2);

  var minMaxTop = window.utils.getMinMaxTop(window.PIN_MIN_Y, window.PIN_MAX_Y, pinHeight, pinPointyEndHeight);
  var minTop = minMaxTop.min;
  var maxTop = minMaxTop.max;

  var checkCoord = function (coord, minCoord, maxCoord) {
    if (coord < minCoord) {
      coord = minCoord;
    } else {
      if (coord > maxCoord) {
        coord = maxCoord;
      }
    }

    return coord;
  };

  window.onMainPinMousedown = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      if (isPointyEnd) {
        pinPointyEndHeight = parseInt(window.getComputedStyle(mainPin, 'after').height, 10);
        minMaxTop = window.utils.getMinMaxTop(window.PIN_MIN_Y, window.PIN_MAX_Y, pinHeight, pinPointyEndHeight);
        minTop = minMaxTop.min;
        maxTop = minMaxTop.max;
      }

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      newCoords.x = checkCoord(newCoords.x, minLeft, maxLeft);
      newCoords.y = checkCoord(newCoords.y, minTop, maxTop);

      mainPin.style.top = (newCoords.y) + 'px';
      mainPin.style.left = (newCoords.x) + 'px';

      addressInput.value = window.mapPins.getPinAddress(mainPin, isPointyEnd);
      isPointyEnd = true;
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
})();
