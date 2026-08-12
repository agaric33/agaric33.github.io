// 获取两个日期的相对时间
export function getRelativeTime(startDate: Date, endDate = new Date()) {
  const diffSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
  if (diffSeconds < 0) {
    return null
  }
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 10) {
    return '刚刚'
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前`
  }
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} 小时前`
  }
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 10) {
    return `${diffDays} 天前`
  }
  return null
}

// China timezone offset (UTC+8) in milliseconds. Date formatters below
// compute China wall-clock time from the absolute timestamp, independent of
// the runtime's local timezone. This keeps output consistent whether the code
// runs on a local dev machine (UTC+8) or a UTC-based build/CI environment.
const CHINA_OFFSET_MS = 8 * 60 * 60 * 1000

// Return wall-clock components in China time (UTC+8). By shifting the
// timestamp by the offset and reading UTC components, we get deterministic
// China-time values regardless of the host timezone.
export function getChinaParts(date: Date) {
  const shifted = new Date(date.getTime() + CHINA_OFFSET_MS)
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hours: shifted.getUTCHours(),
    minutes: shifted.getUTCMinutes(),
    dayOfWeek: shifted.getUTCDay(),
  }
}

// 获取一个格式化的日期，格式为：2024 年 1 月 1 日 星期一
export function getFormattedDate(date: Date) {
  const { year, month, day, dayOfWeek } = getChinaParts(date)
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][dayOfWeek]

  return `${year % 100} 年 ${month} 月 ${day} 日 ${week}`
}

// 数字前补 0
function padZero(number: number, len = 2) {
  return number.toString().padStart(len, '0')
}

// 获取格式化后的日期时间，格式：2024 年 01 月 01 日 12:00
export function getFormattedDateTime(date: Date) {
  const { year, month, day, hours, minutes } = getChinaParts(date)

  return `${year} 年 ${padZero(month)} 月 ${padZero(day)} 日 ${padZero(hours)}:${padZero(minutes)}`
}

// 获取两个日期的相差的天数
export function getDiffInDays(startDate: Date, endDate = new Date()) {
  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 86400))
}

// 获取一个短的日期，格式为：04-20
export function getShortDate(date: Date) {
  const { month, day } = getChinaParts(date)

  return `${padZero(month)}-${padZero(day)}`
}

// 获取日期所在的年一共多少天
export function getDaysInYear(date: Date) {
  const year = date.getFullYear()
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return 366
  }
  return 365
}

// 获取日期所在的年的开始日期
export function getStartOfYear(date: Date) {
  const year = date.getFullYear()
  return new Date(year, 0, 1)
}

// 获取日期所在的天的开始日期
export function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
