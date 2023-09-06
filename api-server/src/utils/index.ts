
/**
 * 转换时间长度，默认为秒
 * @param value 
 * @param millisecond 
 * @returns 
 */
export function toTime (value: string | number, millisecond?: boolean) {
  let [ val, num, tag ] = /^([0-9]+)(h|m|s)?$/.exec(String(value)) ?? []
  if (!val) return 0
  let opt = { h: 3600, m: 60, s: 1 }
  return Number(num) * (opt?.[tag??'s']??1) * (millisecond?1000:1)
}