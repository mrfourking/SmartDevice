'use strict';

/**
 * Аккордеон для футера в мобильном разрешении
 */
(function () {
  var accordionBlocks = document.querySelectorAll('.accordion');
  var accordionTitles = document.querySelectorAll('.footer__title');
  var activeBlock;

  var toggleAccordion = function (button) {
    button.classList.add('footer__title--active');
    button.nextElementSibling.classList.add('accordion--open');

    if (activeBlock) {
      activeBlock.classList.remove('footer__title--active');
      activeBlock.nextElementSibling.classList.remove('accordion--open');
    }

    activeBlock = (activeBlock === button) ? 0 : button;
  };

  var onAccordionClick = function (button) {
    return function () {
      toggleAccordion(button);
    };
  };

  accordionBlocks.forEach(function (item) {
    item.classList.remove('accordion--nojs');
  });

  accordionTitles.forEach(function (item) {
    item.addEventListener('click', onAccordionClick(item));
  });
})();

/**
 * Сокращение контентных блоков при большой длине в блоке О компании
 */
(function () {
  var TABLET_WIDTH = 1023;
  var STRING_LENGTH = 200;
  var END_CHARACTER = '..';

  var contentBlocks = document.querySelectorAll('.about p');
  var contents = [];

  contentBlocks.forEach(function (item) {
    contents.push(item.innerText);
  });

  var onResize = function () {
    if (document.body.clientWidth <= TABLET_WIDTH) {
      contentBlocks.forEach(function (item) {
        var content = item.innerText;

        if (content.length > STRING_LENGTH) {
          item.innerText = content.substr(0, STRING_LENGTH) + END_CHARACTER;
        }
      });
    } else {
      contentBlocks.forEach(function (item, index) {
        item.innerText = contents[index];
      });
    }
  };

  window.addEventListener('resize', resizeThrottler, false);

  var resizeTimeout;

  function resizeThrottler() {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        onResize();
      }, 66);
    }
  }
})();

/**
 * Маска телефона
 */
(function () {
  var START_SYMBOLS = '+7(';
  var CLOSE_SYMBOL = ')';
  var SEPARATOR = '-';
  var MIN_LENGTH = 4;
  var MAX_LENGTH = 16;
  var BACKSPACE_KEYCODE = 8;
  var ERROR_MESSAGE = 'Номер телефона не соответствует формату +7(ХХХ)ХХХ-ХХ-ХХ';

  var phoneInputs = document.querySelectorAll('input[type="tel"');

  var checkPhoneNumber = function (item) {
    var startIndex = 0;
    var longNumber = 3;
    var shortNumber = 2;
    if (item.value.substr(startIndex, START_SYMBOLS.length) !== START_SYMBOLS) {
      item.setCustomValidity(ERROR_MESSAGE);
    } else {
      startIndex += START_SYMBOLS.length;
      if (isNaN(Number(item.value.substr(startIndex, longNumber)))) {
        item.setCustomValidity(ERROR_MESSAGE);
      } else {
        startIndex += longNumber;
        if (item.value.substr(startIndex, 1) !== CLOSE_SYMBOL) {
          item.setCustomValidity(ERROR_MESSAGE);
        } else {
          startIndex += CLOSE_SYMBOL.length;
          if (isNaN(Number(item.value.substr(startIndex, longNumber)))) {
            item.setCustomValidity(ERROR_MESSAGE);
          } else {
            startIndex += longNumber;
            if (item.value.substr(startIndex, 1) !== SEPARATOR) {
              item.setCustomValidity(ERROR_MESSAGE);
            } else {
              startIndex += SEPARATOR.length;
              if (isNaN(Number(item.value.substr(startIndex, shortNumber)))) {
                item.setCustomValidity(ERROR_MESSAGE);
              } else {
                startIndex += shortNumber;
                if (item.value.substr(startIndex, 1) !== SEPARATOR) {
                  item.setCustomValidity(ERROR_MESSAGE);
                } else {
                  if (isNaN(Number(item.value.substr(startIndex, shortNumber)))) {
                    item.setCustomValidity(ERROR_MESSAGE);
                  } else {
                    item.setCustomValidity('');
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  var setValue = function (item, evt) {
    if (item.value.length < MAX_LENGTH) {
      switch (item.value.length) {
        case 0:
        case 1:
        case 2:
        case 3:
          item.value = START_SYMBOLS;
          break;
        case 6:
          item.value += CLOSE_SYMBOL;
          break;
        case 10:
        case 13:
          item.value += SEPARATOR;
          break;
        default:
          if (/[\d]/g.test(evt.key)) {
            item.value += evt.key;
          }
      }
    }
  };

  var onTelKeydown = function (item) {
    return function (evt) {
      if (item.value.length < MIN_LENGTH && evt.keyCode === BACKSPACE_KEYCODE) {
        item.value = START_SYMBOLS;
      }
      if (/[\d]/g.test(evt.key)) {
        setValue(item, evt.key);
      } else {
        item.value = item.value.replace(/[^0-9\+\(\-)]/, '');
      }
    };
  };

  var onTelI = function (item) {
    return function () {
      checkPhoneNumber(item);
    };
  };

  phoneInputs.forEach(function (item) {
    item.addEventListener('focus', function () {
      setValue(item);

      item.addEventListener('keydown', function (evt) {
        evt.stopImmediatePropagation();
        return false;
      });

      item.addEventListener('keypress', function (evt) {
        evt.stopImmediatePropagation();
        return false;
      });

      item.addEventListener('keyup', onTelKeydown(item));

      item.addEventListener('input', onTelI(item));
    });

    item.addEventListener('blur', function () {
      if (item.value.length <= START_SYMBOLS.length) {
        item.value = '';
      }

      item.removeEventListener('keyup', onTelKeydown(item));
    });
  });
})();

/**
 * Скрипт для работы модального окна
 */
(function () {
  var ESC_KEYCODE = 27;
  var openButton = document.querySelector('.header__callback-button');
  var modal = document.querySelector('.modal');
  var closeButton = modal.querySelector('.callback-form__button-close');
  var userName = modal.querySelector('#name-modal');
  var userPhone = modal.querySelector('#phone-modal');
  var userMessage = modal.querySelector('#question-modal');

  var isStorageSupport = true;
  var storageName = '';
  var storagePhone = '';
  var storageMessage = '';

  try {
    storageName = localStorage.getItem('userName');
    storagePhone = localStorage.getItem('userPhone');
    storageMessage = localStorage.getItem('userMessage');
  } catch (err) {
    isStorageSupport = false;
  }

  var closeModal = function () {
    modal.classList.remove('modal--open');
    document.body.classList.remove('scroll-hidden');

    document.removeEventListener('keydown', onModalKeydown);
    document.removeEventListener('click', onRandomAreaClick);
  };

  var onModalButtonsClick = function () {
    closeModal();

    if (isStorageSupport) {
      localStorage.setItem('userName', userName.value);
      localStorage.setItem('userPhone', userPhone.value);
      localStorage.setItem('userMessage', userMessage.value);
    }
  };

  var onModalKeydown = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeModal();
    }
  };

  var onRandomAreaClick = function (evt) {
    if (evt.target !== modal && !(modal.contains(evt.target))) {
      closeModal();
    }
  };


  openButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    modal.classList.add('modal--open');
    document.body.classList.add('scroll-hidden');
    userName.focus();

    if (isStorageSupport) {
      userName.value = storageName;
      userPhone.value = storagePhone;
      userMessage.value = storageMessage;
    }

    document.addEventListener('keydown', onModalKeydown);
    document.addEventListener('click', onRandomAreaClick);
  });

  modal.addEventListener('submit', function () {
    onModalButtonsClick();
  });

  closeButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    onModalButtonsClick();
  });
})();

/**
 * Плавный переход по якорной ссылке
 */
(function () {
  var mainBlock = document.querySelector('.main');
  var links = mainBlock.querySelectorAll('a[href*="#"]');
  var FRAME_COUNT = 20;
  var ANIMATION_TIME = 300;

  var scrollBlock = function (coord) {
    var scrollBy = coord / FRAME_COUNT;

    if (scrollBy > window.pageYOffset - coord && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
      window.scrollBy(0, scrollBy);
    } else {
      window.scrollTo(0, coord);
      clearInterval(window.scroller);
    }
  };

  var intervalCallback = function (coord) {
    return function () {
      scrollBlock(coord);
    };
  };

  links.forEach(function (item) {
    item.addEventListener('click', function (evt) {
      evt.preventDefault();
      var coordY = document.querySelector(item.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset;

      window.scroller = setInterval(intervalCallback(coordY), ANIMATION_TIME / FRAME_COUNT);
    });
  });
})();
