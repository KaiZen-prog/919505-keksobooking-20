'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var fieldsetCollection = adForm.querySelectorAll('fieldset');
  var roomsSelect = adForm.querySelector('#room_number');
  var guestsSelect = adForm.querySelector('#capacity');
  var housingTypeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');

  var addressInput = adForm.querySelector('input[name="address"]');

  window.form = {
    activateForm: function () {
      for (var i = 0; i < fieldsetCollection.length; i++) {
        fieldsetCollection[i].disabled = false;
      }

      addressInput.value = window.pin.getPinAddress(window.utils.mainPin, true);

      adForm.classList.remove('ad-form--disabled');

      roomsSelect.addEventListener('change', window.form.onFilterChange);
      guestsSelect.addEventListener('change', window.form.onFilterChange);
      housingTypeSelect.addEventListener('change', window.form.onHousingTypeChange);
      timeInSelect.addEventListener('change', window.form.onTimeInChange);
      timeOutSelect.addEventListener('change', window.form.onTimeOutChange);
    },

    onHousingTypeChange: function () {
      var housingType = housingTypeSelect.value;

      switch (housingType) {
        case 'bungalo':
          priceInput.setAttribute('min', '0');
          priceInput.setAttribute('placeholder', '0');
          break;

        case 'flat':
          priceInput.setAttribute('min', '1000');
          priceInput.setAttribute('placeholder', '1000');
          break;

        case 'house':
          priceInput.setAttribute('min', '5000');
          priceInput.setAttribute('placeholder', '5000');
          break;

        case 'palace':
          priceInput.setAttribute('min', '10000');
          priceInput.setAttribute('placeholder', '10000');
          break;
      }
    },

    onTimeInChange: function () {
      var timeIn = timeInSelect.value;

      switch (timeIn) {
        case '12:00':
          timeOutSelect.value = timeIn;
          break;

        case '13:00':
          timeOutSelect.value = timeIn;
          break;

        case '14:00':
          timeOutSelect.value = timeIn;
          break;
      }
    },

    onTimeOutChange: function () {
      var timeOut = timeOutSelect.value;

      switch (timeOut) {
        case '12:00':
          timeInSelect.value = timeOut;
          break;

        case '13:00':
          timeInSelect.value = timeOut;
          break;

        case '14:00':
          timeInSelect.value = timeOut;
          break;
      }
    },

    // Предупреждение о неподходящих вариантах комнат
    onFilterChange: function () {
      var selectedRoomsOption = roomsSelect.value;
      var selectedGuestsOption = guestsSelect.value;
      if ((selectedRoomsOption === '100') && (selectedGuestsOption !== '0')) {
        guestsSelect.setCustomValidity('Вы выбрали 100 комнат. Подходящим вариантом для них является: "не для гостей"');
        roomsSelect.setCustomValidity('');
      } else {
        if (selectedRoomsOption < selectedGuestsOption) {
          guestsSelect.setCustomValidity('Вы выбрали слишком много гостей для вашего количества комнат');
          roomsSelect.setCustomValidity('');
        } else {
          if ((selectedGuestsOption === '0') && (selectedRoomsOption !== '100')) {
            roomsSelect.setCustomValidity('Для вашего числа гостей подойдет только 100 комнат');
            guestsSelect.setCustomValidity('');
          } else {
            guestsSelect.setCustomValidity('');
            roomsSelect.setCustomValidity('');
          }
        }
      }
    }
  };
})();
