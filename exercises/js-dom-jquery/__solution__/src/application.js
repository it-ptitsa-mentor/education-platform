// @ts-check

import $ from 'jquery';

export default () => {
  $('.carousel').each(function initCarousel() {
    const carousel = $(this);
    const items = carousel.find('.carousel-item');

    const move = (direction) => {
      const active = carousel.find('.carousel-item.active');
      const current = items.index(active);
      const next = direction === 'next'
        ? (current + 1) % items.length
        : (current - 1 + items.length) % items.length;
      active.removeClass('active');
      items.eq(next).addClass('active');
    };

    carousel.find('[data-slide="next"]').on('click', (event) => {
      event.preventDefault();
      move('next');
    });
    carousel.find('[data-slide="prev"]').on('click', (event) => {
      event.preventDefault();
      move('prev');
    });
  });
};
