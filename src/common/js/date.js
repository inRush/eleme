function padLeftZero(str) {
  return '00'.concat(str).substr(str.length);
}

export default function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1,
      (''.concat(date.getFullYear())).substr(4 - RegExp.$1.length));
  }

  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = ''.concat(o[k]);
      fmt = fmt.replace(RegExp.$1,
        (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}
