export default function onMac() {
  const userAgent = navigator.userAgent;
  const mac = userAgent.indexOf('Mac') !== -1;
  const iPhone = userAgent.indexOf('iPhone') !== -1;
  const iPad = userAgent.indexOf('iPad') !== -1;
  return mac && !iPhone && !iPad;
}
