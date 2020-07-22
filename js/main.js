'use strict';

(function () {
  var map = document.querySelector('.map');

  var filterForm = map.querySelector('form');
  var filterFormInputCollection = filterForm.querySelectorAll('input');
  var filterFormSelectCollection = filterForm.querySelectorAll('select');
  var housingTypeFilter = filterForm.querySelector('#housing-type');
  var housingPriceFilter = filterForm.querySelector('#housing-price');
  var housingRoomsFilter = filterForm.querySelector('#housing-rooms');
  var housingGuestsFilter = filterForm.querySelector('#housing-guests');
  var housingFeaturesFilter = filterForm.querySelector('.map__features');

  var mainPin = document.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');
  var addressInput = adForm.querySelector('input[name="address"]');

  var defaultMainPinTop = window.utils.getElementProperties(mainPin).top;
  var defaultMainPinLeft = window.utils.getElementProperties(mainPin).left;

  var resetButton = document.querySelector('.ad-form__reset');

  var isMapClosed = true;

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

  // Обработчики смены фильтров
  var onFilterChange = window.debounce(function () {
    window.apartmentCard.remove();
    window.mapPins.remove();

    window.mapPins.preRender(window.getFilteredArray());
  });

  var onFeaturesClick = function (evt) {
    if (evt.target.classList.contains('map__checkbox')) {
      onFilterChange();
    }
  };

  // Перевод страницы в неактивное состояние
  var closeMap = function () {
    window.mapPins.remove();
    window.apartmentCard.remove();

    mainPin.style.top = defaultMainPinTop + 'px';
    mainPin.style.left = defaultMainPinLeft + 'px';

    map.classList.add('map--faded');

    filterForm.reset();
    window.utils.toggleFormFields(filterFormInputCollection, true);
    window.utils.toggleFormFields(filterFormSelectCollection, true);

    window.adForm.deactivate();
    window.adForm.showSuccessMessage();

    mainPin.addEventListener('keydown', onMainPinKeyDown);
    mainPin.addEventListener('mousedown', onMainPinMouseDown);

    adForm.removeEventListener('submit', onFormSubmit);
    resetButton.removeEventListener('click', onResetButtonClick);
    resetButton.removeEventListener('click', onResetButtonKeyDown);

    housingTypeFilter.removeEventListener('change', onFilterChange);
    housingPriceFilter.removeEventListener('change', onFilterChange);
    housingRoomsFilter.removeEventListener('change', onFilterChange);
    housingGuestsFilter.removeEventListener('change', onFilterChange);
    housingFeaturesFilter.removeEventListener('click', onFeaturesClick, true);

    isMapClosed = true;
  };

  // Перевод страницы в активное состояние при нажатии на mainPin
  var openMap = function () {
    window.load(window.onGetApartments, window.renderErrorPopup);

    window.utils.toggleFormFields(filterFormInputCollection, false);
    window.utils.toggleFormFields(filterFormSelectCollection, false);

    map.classList.remove('map--faded');

    window.adForm.activate();

    adForm.addEventListener('submit', onFormSubmit);

    resetButton.addEventListener('click', onResetButtonClick);
    resetButton.addEventListener('click', onResetButtonKeyDown);

    housingTypeFilter.addEventListener('change', onFilterChange);
    housingPriceFilter.addEventListener('change', onFilterChange);
    housingRoomsFilter.addEventListener('change', onFilterChange);
    housingGuestsFilter.addEventListener('change', onFilterChange);
    housingFeaturesFilter.addEventListener('click', onFeaturesClick);

    isMapClosed = false;
  };

  var onMainPinMouseDown = function (evt) {
    if (window.utils.isLeftMouseDown(evt)) {
      window.onMainPinMousedown(evt);

      if (isMapClosed) {
        openMap();
      }
    }
  };

  var onMainPinKeyDown = function (evt) {
    if (window.utils.isEnterDown(evt)) {
      openMap();
    }
  };

  addressInput.value = window.mapPins.getPinAddress(mainPin, false);
  window.adForm.deactivate();
  window.utils.toggleFormFields(filterFormInputCollection, true);
  window.utils.toggleFormFields(filterFormSelectCollection, true);

  mainPin.addEventListener('mousedown', onMainPinMouseDown);
  mainPin.addEventListener('keydown', onMainPinKeyDown);
})();
