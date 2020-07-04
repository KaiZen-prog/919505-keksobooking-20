'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = window.utils.mainPin;
  var apartments = window.data.createApartments(window.data.apartmentQuantity);

  // Изначально тип выбранного жилья и минимальная цена за ночь не соответствуют друг другу.
  // Приводим в соответствие.
  window.form.onHousingTypeChange();

  // Перевод страницы в активное состояние при нажатии на mainPin
  var openMap = function () {
    mainPin.removeEventListener('mousedown', onMainPinMousedown);
    mainPin.removeEventListener('keydown', onMainPinKeydown);

    map.classList.remove('map--faded');

    window.pin.renderPins(apartments);

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].addEventListener('click', onMapPinClick);
    }

    window.form.activateForm();
  };

  var onMainPinMousedown = function (evt) {
    window.utils.isLeftMouseDown(evt, openMap);
  };

  var onMainPinKeydown = function (evt) {
    window.utils.isEnterDown(evt, openMap);
  };

  mainPin.addEventListener('mousedown', onMainPinMousedown);
  mainPin.addEventListener('keydown', onMainPinKeydown);

  // Открытие карточки
  var openCard = function (evt) {
    var cards = map.querySelectorAll('article');

    for (var i = 0; i < cards.length; i++) {
      cards[i].remove();
    }

    var pinNumber = window.utils.getIntegerFromElementID(evt.currentTarget.id);
    var card = window.card.createCard(apartments[pinNumber], pinNumber);
    map.insertBefore(card, document.querySelector('.map__filters-container'));
    var cardCloseButton = map.querySelector('.popup__close');

    cardCloseButton.addEventListener('click', onCardCloseClick);
    document.addEventListener('keydown', onCardCloseKeydown);
  };

  var onMapPinClick = function (evt) {
    openCard(evt);
  };


  // Закрытие карточки
  var closeCard = function (evt) {
    var card = map.querySelector('article');
    var cardNumber = window.utils.getIntegerFromElementID(card.id);
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
    window.utils.isEscapeDown(evt, closeCard);
  };
})();
