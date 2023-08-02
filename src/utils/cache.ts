export const setCache = function (key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
};
export const getCache = function (key: string) {
  const value = window.localStorage.getItem(key);
  if (value && value !== "undefined") {
    return JSON.parse(value);
  }
};
