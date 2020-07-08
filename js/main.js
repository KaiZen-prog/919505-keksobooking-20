'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  // Изначально тип выбранного жилья и минимальная цена за ночь не соответствуют друг другу.
  // Приводим в соответствие.
  window.adForm.onHousingTypeChange();

  // Перевод страницы в активное состояние при нажатии на mainPin
  var openMap = function () {
    mainPin.removeEventListener('keydown', onMainPinKeydown);
    mainPin.removeEventListener('mousedown', onMainPinMousedown);

    window.adForm.activate();
    map.classList.remove('map--faded');
  };

  var onMainPinMousedown = function (evt) {
    if (window.utils.isLeftMouseDown(evt)) {
      window.onMainPinMousedown(evt);

      openMap();
    }
  };

  var onMainPinKeydown = function (evt) {
    if (window.utils.isEnterDown(evt)) {
      openMap();
    }
  };

  mainPin.addEventListener('mousedown', onMainPinMousedown);
  mainPin.addEventListener('keydown', onMainPinKeydown);
})();
