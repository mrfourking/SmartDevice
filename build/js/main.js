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
    $('#phone').inputmask('+7(9{3})9{3}-9{2}-9{2}', {jitMasking: 3});
  });
})();
