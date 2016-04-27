import $ from 'jquery';

$('.headerButton').on('click', () => {
  setTimeout(() => {
    $('html, body').animate({
      scrollTop: $('.download').offset().top + 1,
    }, 1000);
  }, 500);
});
