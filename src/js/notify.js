import $ from 'jquery';
import onMac from './on-mac';
import validEmail from './valid-email';

const notifyInput = $('.notifyInput');
const notifyButton = $('.notifyButton');

function toggleSent() {
  $('.notifyForm').toggle(600);
  $('.notifySent').toggle(600);
}

function sendData(noTimeout) {
  // const timeout = onMac() || noTimeout ? 0 : 1000;
  const email = notifyInput.val();
  const valid = validEmail(email);

  if (valid) {
    $.getJSON('http://localhost:3000/send?callback?', {
      to: email,
      subject: 'A small reminder',
      text: ' A small reminder to download Indebox app',
    })
      .done((data) => {
        console.log('From done');
        console.log(data);
        toggleSent();
      })
      .fail((err) => {
        console.log('From fail');
        console.log(err);
      })
      .always(() => {
        console.log('From always');
        setTimeout(() => {
          $('.notifyInput').val('');
          toggleSent();
        }, 5000);
      });
    // setTimeout(() => toggleSent(), timeout);
  } else {
    notifyInput.addClass('error');
  }
}

notifyInput.on('blur', () => {
  const email = notifyInput.val();
  const valid = validEmail(email);

  if (!valid) {
    notifyInput.addClass('error');
  } else {
    notifyInput.removeClass('error');
  }
});

notifyInput.keypress((e) => {
  if (e.keyCode === 13) sendData(true);
});

notifyButton.on('click', () => {
  sendData();
});
