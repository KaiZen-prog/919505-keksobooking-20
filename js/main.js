'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var apartments = window.createApartments(window.APARTMENT_QUANTITY);

  // Изначально тип выбранного жилья и минимальная цена за ночь не соответствуют друг другу.
  // Приводим в соответствие.
  window.adForm.onHousingTypeChange();

  // Перевод страницы в активное состояние при нажатии на mainPin
  var openMap = function () {
    mainPin.removeEventListener('mousedown', onMainPinMousedown);
    mainPin.removeEventListener('keydown', onMainPinKeydown);

    map.classList.remove('map--faded');

    window.mapPins.render(apartments);

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].addEventListener('click', onMapPinClick);
    }

    window.adForm.activate();
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
    var card = window.createCard(apartments[pinNumber], pinNumber);
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
