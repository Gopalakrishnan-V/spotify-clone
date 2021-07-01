export const toHHMMSS = (secs, options) => {
  const showLabels = options?.showLabels ?? false;
  const labels = options?.labels || [' hr', ' min', ' sec'];
  const separator = options?.separator ?? ':';

  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v, i) => (v < 10 ? '0' + v : v) + (showLabels ? labels[i] : ''))
    .filter((v, i) => !v.startsWith('00') || i > 0)
    .join(separator);
};
