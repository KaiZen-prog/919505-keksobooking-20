'use strict';

(function () {
  var KEY_CODE_MOUSE_LEFT = 0;
  var KEY_CODE_ENTER = 13;
  var KEY_CODE_ESCAPE = 27;

  window.utils = {
    mapPins: document.querySelector('.map__pins'),
    mainPin: document.querySelector('.map__pin--main'),

    getRandomArrayElement: function (array) {
      var rand = Math.floor(Math.random() * array.length);
      return array[rand];
    },

    getRandomNumber: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },

    createRandomArray: function (array) {
      var newArray = [];
      var newArrayLength = this.getRandomNumber(0, array.length);
      for (var i = 0; i < newArrayLength; i++) {
        newArray.push(array[i]);
      }
      return newArray;
    },

    getElementProperties: function (element) {
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
    },

    // Для автоматически генерируемых элементов мы используем id типа pin1, pin2 и т.д.
    // Данная функция возвращает число из произвольного id, которое можно будет использовать как порядковый номер элемента.
    getIntegerFromElementID: function (elementId) {
      var r = /\d+/;
      return elementId.match(r);
    },

    isLeftMouseDown: function (evt, action) {
      if (evt.button === KEY_CODE_MOUSE_LEFT) {
        action();
      }
    },

    isEnterDown: function (evt, action) {
      if (evt.keyCode === KEY_CODE_ENTER) {
        action();
      }
    },

    isEscapeDown: function (evt, action) {
      if (evt.keyCode === KEY_CODE_ESCAPE) {
        action(evt);
      }
    }
  };
})();
