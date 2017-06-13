/**
 * 解析url参数
 * @example ?id=1234&a=b
 * @return Object {id:1234,a:b}
 */
export function urlParse() {
  const url = window.location.search;
  const obj = {};
  const reg = /[?&][^?&]+=[^?&]+/g;
  const arr = url.match(reg);
  // ['?id=1234.'&a=b]
  if (arr) {
    arr.forEach((item) => {
      const tempArr = item.substr(1).split('=');
      const key = decodeURIComponent(tempArr[0]);
      const val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    }, this);
  }
  return obj;
}
