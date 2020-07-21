'use strict';

(function () {
  var DEFAULT = 'any';

  var HOUSING_PRICES_LOW = {
    value: 'low',
    maxPrice: 10000
  };

  var HOUSING_PRICES_MIDDLE = {
    value: 'middle',
    minPrice: 10000,
    maxPrice: 50000
  };

  var HOUSING_PRICES_HIGH = {
    value: 'high',
    minPrice: 50000
  };

  var map = document.querySelector('.map');

  var filterForm = map.querySelector('form');
  var housingTypeFilter = filterForm.querySelector('#housing-type');
  var housingPriceFilter = filterForm.querySelector('#housing-price');
  var housingRoomsFilter = filterForm.querySelector('#housing-rooms');
  var housingGuestsFilter = filterForm.querySelector('#housing-guests');

  var filterByHousingType = function (value) {
    return value.offer.type === housingTypeFilter.value || housingTypeFilter.value === DEFAULT;
  };

  var filterByHousingPrice = function (value) {
    switch (housingPriceFilter.value) {
      case HOUSING_PRICES_LOW.value:
        return value.offer.price < HOUSING_PRICES_LOW.maxPrice;

      case HOUSING_PRICES_MIDDLE.value:
        return value.offer.price >= HOUSING_PRICES_MIDDLE.minPrice && value.offer.price < HOUSING_PRICES_MIDDLE.maxPrice;

      case HOUSING_PRICES_HIGH.value:
        return value.offer.price >= HOUSING_PRICES_HIGH.minPrice;

      default:
        return true;
    }
  };

  var filterByRooms = function (value) {
    return value.offer.rooms.toString() === housingRoomsFilter.value || housingRoomsFilter.value === DEFAULT;
  };

  var filterByGuests = function (value) {
    return value.offer.guests.toString() === housingGuestsFilter.value || housingGuestsFilter.value === DEFAULT;
  };

  var filterByFeatures = function (value) {
    var inputs = filterForm.querySelectorAll('input[type="checkbox"]:checked');
    if (inputs.length === 0) {
      return true;
    }

    var selectedFeatures = [];
    for (var i = 0; i < inputs.length; i++) {
      selectedFeatures.push(inputs[i].value);
    }

    var matchingFeatures = selectedFeatures.filter(function (feature) {
      return value.offer.features.indexOf(feature) > -1;
    });

    return matchingFeatures.length === selectedFeatures.length;
  };

  window.getFilteredArray = function () {
    return window.apartmentsArray.filter(function (value) {
      return (filterByHousingType(value) &&
        filterByHousingPrice(value) &&
        filterByRooms(value) &&
        filterByGuests(value) &&
        filterByFeatures(value));
    });
  };
})();
