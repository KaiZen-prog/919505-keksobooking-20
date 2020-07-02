'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  window.card = {
    createCard: function (entity, cardId) {
      var card = cardTemplate.cloneNode(true);

      var title = card.querySelector('.popup__title');
      title.textContent = entity.offer.title;

      var address = card.querySelector('.popup__text--address');
      address.textContent = entity.offer.address.toString();

      var price = card.querySelector('.popup__text--price');
      price.textContent = entity.offer.price + '₽/ночь';

      var housingType = card.querySelector('.popup__type');
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

      var roomsAndGuests = card.querySelector('.popup__text--capacity');
      roomsAndGuests.textContent = entity.offer.rooms + ' комнаты для ' + entity.offer.guests + ' гостей';

      var time = card.querySelector('.popup__text--time');
      time.textContent = 'Заезд после ' + entity.offer.checkin + ', выезд до ' + entity.offer.checkout + '.';


      var features = card.querySelector('.popup__features');
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

      var description = card.querySelector('.popup__description');
      description.textContent = entity.offer.description;

      var photos = card.querySelector('.popup__photos');
      if (entity.offer.photos.length > 0) {
        photos.querySelector('img').src = entity.offer.photos[0];

        if (entity.offer.photos.length > 1) {
          var photosFragment = document.createDocumentFragment();

          for (var j = 1; j < entity.offer.photos.length; j++) {
            var img = photos.querySelector('img').cloneNode(true);
            img.src = entity.offer.photos[j];
            photosFragment.appendChild(img);
          }

          photos.appendChild(photosFragment);
        }
      } else {
        photos.remove();
      }

      var avatar = card.querySelector('.popup__avatar');
      avatar.src = entity.author.avatar;

      card.id = 'card' + cardId;

      return card;
    }
  };
})();
