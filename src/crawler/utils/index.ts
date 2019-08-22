export function isArrayString(value: any): boolean {
  if (value instanceof Array) {
    let isNotString: boolean = false;
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      if (typeof v !== 'string') {
        isNotString = true;
      }
    }
    if (!isNotString && 0 < value.length) {
      return true;
    }
  }
  return false;
}
