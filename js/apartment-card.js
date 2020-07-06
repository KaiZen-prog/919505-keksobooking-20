'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var card = cardTemplate.cloneNode(true);

  var title = card.querySelector('.popup__title');
  var address = card.querySelector('.popup__text--address');
  var price = card.querySelector('.popup__text--price');
  var housingType = card.querySelector('.popup__type');
  var roomsAndGuests = card.querySelector('.popup__text--capacity');
  var time = card.querySelector('.popup__text--time');
  var features = card.querySelector('.popup__features');
  var description = card.querySelector('.popup__description');
  var photos = card.querySelector('.popup__photos');
  var img = photos.querySelector('img');
  var avatar = card.querySelector('.popup__avatar');

  var isPhotosRemoved = false;

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
        card.appendChild(photos);
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

    card.id = 'card' + cardId;

    return card;
  };
})();
