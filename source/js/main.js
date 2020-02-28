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
