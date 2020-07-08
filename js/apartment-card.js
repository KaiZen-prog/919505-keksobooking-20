'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardClone = cardTemplate.cloneNode(true);

  var title = cardClone.querySelector('.popup__title');
  var address = cardClone.querySelector('.popup__text--address');
  var price = cardClone.querySelector('.popup__text--price');
  var housingType = cardClone.querySelector('.popup__type');
  var roomsAndGuests = cardClone.querySelector('.popup__text--capacity');
  var time = cardClone.querySelector('.popup__text--time');
  var features = cardClone.querySelector('.popup__features');
  var description = cardClone.querySelector('.popup__description');
  var photos = cardClone.querySelector('.popup__photos');
  var img = photos.querySelector('img');
  var avatar = cardClone.querySelector('.popup__avatar');

  var map = document.querySelector('.map');

  var isPhotosRemoved = false;

  // Генерация карточки
  window.createCard = function (entity, cardId) {
    title.textContent = entity.offer.title;
    address.textContent = entity.offer.address.toString();
    price.textContent = entity.offer.price + '₽/ночь';
    switch (entity.offer.type) {
      case 'palace':
        housingType.textContent = 'Дворец';
        break;

      case 'flat':
        housingType.textContent = 'Квартира';
        break;

      case 'house':
        housingType.textContent = 'Дом';
        break;

      case 'bungalo':
        housingType.textContent = 'Бунгало';
        break;
    }

    roomsAndGuests.textContent = entity.offer.rooms + ' комнаты для ' + entity.offer.guests + ' гостей';

    time.textContent = 'Заезд после ' + entity.offer.checkin + ', выезд до ' + entity.offer.checkout + '.';

    if (entity.offer.features.length > 0) {
      while (features.firstChild) {
        features.removeChild(features.firstChild);
      }

      var listFragment = document.createDocumentFragment();

      for (var i = 0; i < entity.offer.features.length; i++) {
        var listItem;
        listItem = document.createElement('li');
        listItem.classList.add('popup__feature');

        switch (entity.offer.features[i]) {
          case 'wifi':
            listItem.classList.add('popup__feature--wifi');
            break;

          case 'dishwasher':
            listItem.classList.add('popup__feature--dishwasher');
            break;

          case 'parking':
            listItem.classList.add('popup__feature--parking');
            break;

          case 'washer':
            listItem.classList.add('popup__feature--washer');
            break;

          case 'elevator':
            listItem.classList.add('popup__feature--elevator');
            break;

          case 'conditioner':
            listItem.classList.add('popup__feature--conditioner');
            break;
        }

        listFragment.appendChild(listItem);
      }

      features.appendChild(listFragment);
    } else {
      features.remove();
    }

    description.textContent = entity.offer.description;

    // Следим за количеством фотографий, удаляем/восстановливаем элемент photos по мере необходимости.
    // При открывании новой карточки - вычищаем старые картинки из photos (если они были) и загружаем новые, если есть.
    if (entity.offer.photos.length > 0) {
      if (isPhotosRemoved) {
        cardClone.appendChild(photos);
        isPhotosRemoved = false;
      }

      var imgCollection = photos.querySelectorAll('img');

      if (imgCollection) {
        for (i = 0; i < imgCollection.length; i++) {
          imgCollection[i].remove();
        }
      }

      if (entity.offer.photos.length > 0) {
        var photosFragment = document.createDocumentFragment();

        for (var j = 0; j < entity.offer.photos.length; j++) {
          var imgNode = img.cloneNode(true);
          imgNode.src = entity.offer.photos[j];
          photosFragment.appendChild(imgNode);
        }

        photos.appendChild(photosFragment);
      }
    } else {
      photos.remove();
      isPhotosRemoved = true;
    }

    avatar.src = entity.author.avatar;

    cardClone.id = 'card' + cardId;

    return cardClone;
  };

  // Открытие карточки
  var openCard = function (evt) {
    var cards = map.querySelectorAll('article');

    for (var i = 0; i < cards.length; i++) {
      cards[i].remove();
    }

    var pinNumber = window.utils.getIntegerFromElementID(evt.currentTarget.id);
    var card = window.createCard(window.apartments[pinNumber], pinNumber);
    map.insertBefore(card, document.querySelector('.map__filters-container'));
    var cardCloseButton = map.querySelector('.popup__close');

    cardCloseButton.addEventListener('click', onCardCloseClick);
    document.addEventListener('keydown', onCardCloseKeydown);
  };

  // Закрытие карточки
  var closeCard = function (evt) {
    var card = map.querySelector('article');
    var cardNumber = window.utils.getIntegerFromElementID(card.id);
    var pin = map.querySelector('#pin' + cardNumber);

    evt.target.removeEventListener('click', onCardCloseClick);
    document.removeEventListener('keydown', onCardCloseKeydown);
    pin.addEventListener('click', window.mapPins.onClick);

    card.remove();
  };

  var onCardCloseClick = function (evt) {
    closeCard(evt);
  };

  var onCardCloseKeydown = function (evt) {
    if (window.utils.isEscapeDown(evt)) {
      closeCard(evt);
    }
  };

  window.apartmentCard = {
    open: openCard
  };
})();
