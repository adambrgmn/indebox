import $ from 'jquery';
import onMac from './on-mac';

if (onMac()) {
  $('.downloadRequirementsFullfilled').css('display', 'block');
  $('.downloadRequirementsUnfullfilled').hide();
}
