'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MIN_HOUSING_PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var adForm = document.querySelector('.ad-form');
  var fieldsetCollection = adForm.querySelectorAll('fieldset');
  var roomsSelect = adForm.querySelector('#room_number');
  var guestsSelect = adForm.querySelector('#capacity');
  var housingTypeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');

  var addressInput = adForm.querySelector('input[name="address"]');

  var avatarChooser = adForm.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');

  var apartmentPhotoChooser = adForm.querySelector('.ad-form__upload input[type=file]');

  var mainPin = document.querySelector('.map__pin--main');

  var successPopupTemplate = document.querySelector('#success').content.querySelector('.success');
  var successPopup = successPopupTemplate.cloneNode(true);

  var errorPopupTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorPopup = errorPopupTemplate.cloneNode(true);

  // Стилизация блока с фотографией жилья
  var setApartmentPhotoBlock = function () {
    var imgContainer = adForm.querySelector('.ad-form__photo');
    imgContainer.style.position = 'relative';

    var img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.width = '100%';
    img.style.height = '100%';

    imgContainer.appendChild(img);

    return img;
  };

  var apartmentPhotoPreview = setApartmentPhotoBlock();

  // Перевод формы в активный режим
  var activate = function () {
    window.utils.toggleFormFields(fieldsetCollection, false);

    adForm.classList.remove('ad-form--disabled');

    addressInput.value = window.mapPins.getPinAddress(mainPin, true);

    checkValidity();

    roomsSelect.addEventListener('change', onFilterChange);
    guestsSelect.addEventListener('change', onFilterChange);
    housingTypeSelect.addEventListener('change', onHousingTypeChange);
    timeInSelect.addEventListener('change', onTimeInChange);
    timeOutSelect.addEventListener('change', onTimeOutChange);

    avatarChooser.addEventListener('change', onAvatarChange);
    apartmentPhotoChooser.addEventListener('change', onApartmentPhotoChange);
  };

  // Перевод формы в неактивный режим
  var deactivate = function () {
    adForm.reset();

    window.utils.toggleFormFields(fieldsetCollection, true);

    addressInput.value = window.mapPins.getPinAddress(mainPin, false);
    avatarPreview.src = 'img/muffin-grey.svg';
    apartmentPhotoPreview.src = 'img/muffin-grey.svg';

    adForm.classList.add('ad-form--disabled');

    roomsSelect.removeEventListener('change', onFilterChange);
    guestsSelect.removeEventListener('change', onFilterChange);
    housingTypeSelect.removeEventListener('change', onHousingTypeChange);
    timeInSelect.removeEventListener('change', onTimeInChange);
    timeOutSelect.removeEventListener('change', onTimeOutChange);

    avatarChooser.removeEventListener('change', onAvatarChange);
    apartmentPhotoChooser.removeEventListener('change', onApartmentPhotoChange);
  };

  // Валидация исходных значений полей формы
  var checkValidity = function () {
    onFilterChange();
    onHousingTypeChange();
    onTimeInChange();
  };

  var onHousingTypeChange = function () {
    var housingType = housingTypeSelect.value;

    switch (housingType) {
      case 'bungalo':
        priceInput.setAttribute('min', MIN_HOUSING_PRICES.bungalo);
        priceInput.setAttribute('placeholder', MIN_HOUSING_PRICES.bungalo);
        break;

      case 'flat':
        priceInput.setAttribute('min', MIN_HOUSING_PRICES.flat);
        priceInput.setAttribute('placeholder', MIN_HOUSING_PRICES.flat);
        break;

      case 'house':
        priceInput.setAttribute('min', MIN_HOUSING_PRICES.house);
        priceInput.setAttribute('placeholder', MIN_HOUSING_PRICES.house);
        break;

      case 'palace':
        priceInput.setAttribute('min', MIN_HOUSING_PRICES.palace);
        priceInput.setAttribute('placeholder', MIN_HOUSING_PRICES.palace);
        break;
    }
  };

  var onTimeInChange = function () {
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
  };

  var onTimeOutChange = function () {
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
  };

  // Предупреждение о неподходящих вариантах комнат
  var onFilterChange = function () {
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
  };

  // Обработка аватарки пользователя и фотографии жилья
  var updateImg = function (fileChooser, preview) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var onAvatarChange = function () {
    updateImg(avatarChooser, avatarPreview);
  };

  var onApartmentPhotoChange = function () {
    updateImg(apartmentPhotoChooser, apartmentPhotoPreview);
  };

  // Обработчики сообщения об успешной отправке формы
  var closeSuccessPopup = function () {
    document.querySelector('.success').remove();

    document.removeEventListener('keydown', onSuccessPopupKeyDown);
    document.removeEventListener('click', onSuccessPopupClick);
  };

  var onSuccessPopupKeyDown = function (evt) {
    if (window.utils.isEscapeDown(evt)) {
      closeSuccessPopup();
    }
  };

  var onSuccessPopupClick = function (evt) {
    if (window.utils.isLeftMouseDown(evt)) {
      closeSuccessPopup();
    }
  };

  var showSuccessMessage = function () {
    document.querySelector('main').appendChild(successPopup);

    document.addEventListener('keydown', onSuccessPopupKeyDown);
    document.addEventListener('click', onSuccessPopupClick);
  };

  // Обработчики сообщения о неуспешной отправке формы
  var closeErrorPopup = function () {
    document.querySelector('.error').remove();

    document.removeEventListener('keydown', onErrorPopupKeyDown);
    document.removeEventListener('click', onErrorPopupClick);
  };

  var onErrorPopupKeyDown = function (evt) {
    if (window.utils.isEscapeDown(evt)) {
      closeErrorPopup();
    }
  };

  var onErrorPopupClick = function (evt) {
    if (window.utils.isLeftMouseDown(evt)) {
      closeErrorPopup();
    }
  };

  var onErrorButtonClick = function () {
    closeErrorPopup();
  };

  var showErrorMessage = function (errorMessage) {
    document.querySelector('main').appendChild(errorPopup);

    var errorParagraph = errorPopup.querySelector('.error__message');
    errorParagraph.textContent = errorMessage;

    var errorButton = document.querySelector('.error__button');

    errorButton.addEventListener('click', onErrorButtonClick);
    document.addEventListener('keydown', onErrorPopupKeyDown);
    document.addEventListener('click', onErrorPopupClick);
  };

  window.adForm = {
    activate: activate,
    deactivate: deactivate,
    onHousingTypeChange: onHousingTypeChange,
    showSuccessMessage: showSuccessMessage,
    showErrorMessage: showErrorMessage
  };
})();
