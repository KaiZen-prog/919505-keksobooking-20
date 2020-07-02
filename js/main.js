'use strict';

var map = document.querySelector('.map');

var apartments = window.data.createApartments(window.data.apartmentQuantity);

// Изначально тип выбранного жилья и минимальная цена за ночь не соответствуют друг другу.
// Приводим в соответствие.
window.form.onHousingTypeChange();

var openMap = function () {
  window.util.mainPin.removeEventListener('mousedown', onMainPinMousedown);

  map.classList.remove('map--faded');

  window.pin.renderPins(apartments);

  window.form.addressInput.value = window.pin.getPinAddress(window.util.mainPin, true);
  var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < pins.length; i++) {
    pins[i].addEventListener('click', onMapPinClick);
  }

  window.form.enableFields();

  window.form.adForm.classList.remove('ad-form--disabled');

  window.form.roomsSelect.addEventListener('change', window.form.onFilterChange);
  window.form.guestsSelect.addEventListener('change', window.form.onFilterChange);
  window.form.housingTypeSelect.addEventListener('change', window.form.onHousingTypeChange);
  window.form.timeInSelect.addEventListener('change', window.form.onTimeInChange);
  window.form.timeOutSelect.addEventListener('change', window.form.onTimeOutChange);
};


var onMainPinMousedown = function (evt) {
  window.util.isLeftMouseDown(evt, openMap);
};

var onMainPinKeydown = function (evt) {
  window.util.isEnterDown(evt, openMap);
};

window.util.mainPin.addEventListener('mousedown', onMainPinMousedown);
window.util.mainPin.addEventListener('keydown', onMainPinKeydown);

var closeCard = function (evt) {
  var card = map.querySelector('article');
  var cardNumber = window.util.getIntegerFromElementID(card.id);
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
  window.util.isEscapeDown(evt, closeCard);
};

var onMapPinClick = function (evt) {
  var cards = map.querySelectorAll('article');

  for (var i = 0; i < cards.length; i++) {
    cards[i].remove();
  }

  var pinNumber = window.util.getIntegerFromElementID(evt.currentTarget.id);
  var card = window.card.createCard(apartments[pinNumber], pinNumber);
  map.insertBefore(card, document.querySelector('.map__filters-container'));
  var cardCloseButton = map.querySelector('.popup__close');

  cardCloseButton.addEventListener('click', onCardCloseClick);
  document.addEventListener('keydown', onCardCloseKeydown);
};
