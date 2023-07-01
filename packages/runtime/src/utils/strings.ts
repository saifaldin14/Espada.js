export function isNotEmptyString(str: string) {
  return str !== "";
}

export function isNotBlankOrEmptyString(str: string) {
  return isNotEmptyString(str.trim());
}
