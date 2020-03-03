'use strict';

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

(function () {
  var TABLET_WIDTH = 1023;
  var STRING_LENGTH = 200;
  var END_CHARACTER = '..';

  var contentBlocks = document.querySelectorAll('.about__content');

  if (document.body.clientWidth <= TABLET_WIDTH) {
    contentBlocks.forEach(function (item) {
      var content = item.innerText;

      if (content.length > STRING_LENGTH) {
        item.innerText = content.substr(0, STRING_LENGTH) + END_CHARACTER;
      }
    });
  }
})();

(function () {
  $(function () {
    $('#phone').inputmask('+7(9{3})9{3}-9{2}-9{2}', {
      jitMasking: 3
    });
  });

  $(function () {
    $('#phone-modal').inputmask('+7(9{3})9{3}-9{2}-9{2}', {
      jitMasking: 3
    });
  });
})();

(function () {
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
    if (evt.keyCode === 27) {
      closeModal();
    }
  };

  // var on = function (evt) {
  //   var innerSuccessBlock = window.render.mainBlock.querySelector('.success__inner');
  //   if (evt.target !== innerSuccessBlock && !(innerSuccessBlock.contains(evt.target))) {
  //     closeSuccessBlock();
  //   }
  // };

  var onRandomAreaClick = function (evt) {
    if (evt.target !== modal && !(modal.contains(evt.target))) {
      closeModal();
    }
  };


  openButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    modal.classList.add('modal--open');
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
