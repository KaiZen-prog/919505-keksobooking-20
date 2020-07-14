'use strict';

(function () {
  var map = document.querySelector('.map');

  var filterForm = map.querySelector('form');
  var housingTypeFilter = filterForm.querySelector('#housing-type');

  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');

  var defaultMainPinTop = window.utils.getElementProperties(mainPin).top;
  var defaultMainPinLeft = window.utils.getElementProperties(mainPin).left;

  var resetButton = document.querySelector('.ad-form__reset');

  // Отправка формы
  var onFormSubmit = function (evt) {
    evt.preventDefault();

    window.save(new FormData(adForm), function () {
      closeMap();
    }, window.adForm.showErrorMessage);
  };

  // Обработчики кнопки сброса формы
  var onResetButtonClick = function (evt) {
    evt.preventDefault();
    closeMap();
  };

  var onResetButtonKeyDown = function (evt) {
    if (window.utils.isEnterDown(evt)) {
      evt.preventDefault();
      closeMap();
    }
  };

  // Перевод страницы в неактивное состояние
  var closeMap = function () {
    window.mapPins.remove();
    window.apartmentCard.remove();

    mainPin.style.top = defaultMainPinTop + 'px';
    mainPin.style.left = defaultMainPinLeft + 'px';

    map.classList.add('map--faded');

    window.adForm.deactivate();

    window.adForm.showSuccessMessage();

    mainPin.addEventListener('keydown', onMainPinKeyDown);
    mainPin.addEventListener('mousedown', onMainPinMouseDown);

    adForm.removeEventListener('submit', onFormSubmit);
    resetButton.removeEventListener('click', onResetButtonClick);
    resetButton.removeEventListener('click', onResetButtonKeyDown);

    housingTypeFilter.removeEventListener('change', window.mapPins.onHousingTypeChange);
  };

  // Перевод страницы в активное состояние при нажатии на mainPin
  var openMap = function () {
    window.load(window.onGetApartments, window.renderErrorPopup);

    window.adForm.activate();
    map.classList.remove('map--faded');

    adForm.addEventListener('submit', onFormSubmit);

    mainPin.removeEventListener('keydown', onMainPinKeyDown);
    mainPin.removeEventListener('mousedown', onMainPinMouseDown);

    resetButton.addEventListener('click', onResetButtonClick);
    resetButton.addEventListener('click', onResetButtonKeyDown);

    housingTypeFilter.addEventListener('change', window.mapPins.onHousingTypeChange);
  };

  var onMainPinMouseDown = function (evt) {
    if (window.utils.isLeftMouseDown(evt)) {
      window.onMainPinMousedown(evt);

      openMap();
    }
  };

  var onMainPinKeyDown = function (evt) {
    if (window.utils.isEnterDown(evt)) {
      openMap();
    }
  };

  mainPin.addEventListener('mousedown', onMainPinMouseDown);
  mainPin.addEventListener('keydown', onMainPinKeyDown);
})();
