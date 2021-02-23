/**
 * @description 深拷贝 解决循环引用问题
 * @param obj
 * @param hash
 */
export function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) { return obj }
  if (obj instanceof Date) { return new Date(obj) }
  if (obj instanceof RegExp) { return new RegExp(obj) }
  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  if (typeof obj !== 'object') { return obj }
  // 是对象的话就要进行深拷贝
  if (hash.get(obj)) { return hash.get(obj) }
  const cloneObj = Array.isArray(obj) ? [] : {}
  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
  hash.set(obj, cloneObj)
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
  return cloneObj
}