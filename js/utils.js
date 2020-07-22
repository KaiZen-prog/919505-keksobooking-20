'use strict';

(function () {
  var KEY_CODE_MOUSE_LEFT = 0;
  var KEY_CODE_ENTER = 13;
  var KEY_CODE_ESCAPE = 27;

  window.PIN_MIN_Y = 130;
  window.PIN_MAX_Y = 630;

  var getElementProperties = function (element) {
    var elementWidth = window.getComputedStyle(element).width;
    var elementHeight = window.getComputedStyle(element).height;
    var elementTop = window.getComputedStyle(element).top;
    var elementLeft = window.getComputedStyle(element).left;

    return {
      width: parseInt(elementWidth, 10),
      height: parseInt(elementHeight, 10),
      top: parseInt(elementTop, 10),
      left: parseInt(elementLeft, 10)
    };
  };

  var getMinMaxTop = function (minCoord, maxCoord, elementHeight, pointyEndHeight) {
    return {
      min: minCoord - elementHeight - pointyEndHeight,
      max: maxCoord - elementHeight - pointyEndHeight,
    };
  };

  // Для автоматически генерируемых элементов мы используем id типа pin01, pin02 и т.д.
  // Данная функция возвращает число из произвольного id, которое можно будет использовать как порядковый номер элемента.
  var getNumberFromString = function (string) {
    var number = '';
    for (var i = 0; i < string.length; i++) {
      if (parseInt(string[i], 10)) {
        number += string[i];
      }
    }
    return parseInt(number, 10);
  };

  var isLeftMouseDown = function (evt) {
    return evt.button === KEY_CODE_MOUSE_LEFT;
  };

  var isEnterDown = function (evt) {
    return evt.keyCode === KEY_CODE_ENTER;
  };

  var isEscapeDown = function (evt) {
    return evt.keyCode === KEY_CODE_ESCAPE;
  };

  var toggleFormFields = function (fieldCollection, disableFields) {
    fieldCollection.forEach(function (el) {
      el.disabled = disableFields;
    });
  };

  window.utils = {
    getElementProperties: getElementProperties,
    getNumberFromString: getNumberFromString,
    isLeftMouseDown: isLeftMouseDown,
    isEnterDown: isEnterDown,
    isEscapeDown: isEscapeDown,
    getMinMaxTop: getMinMaxTop,
    toggleFormFields: toggleFormFields
  };
})();
