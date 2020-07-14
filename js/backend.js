'use strict';

(function () {
  var URL_SEND = 'https://javascript.pages.academy/keksobooking';
  var URL_GET = 'https://javascript.pages.academy/keksobooking/data';

  var TIMEOUT_IN_MS = 10000;

  var StatusCode = {
    OK: 200
  };

  var dataExchangeHandler = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
  };

  var errorHandler = function (xhr, onError) {
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
  };

  window.renderErrorPopup = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    dataExchangeHandler(xhr, onLoad, onError);
    errorHandler(xhr, onError);

    xhr.open('POST', URL_SEND);
    xhr.send(data);
  };

  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    dataExchangeHandler(xhr, onSuccess, onError);
    errorHandler(xhr, onError);

    xhr.open('GET', URL_GET);
    xhr.send();
  };
})();
