import dayjs from 'dayjs'
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { solar2lunar } from 'solarLunar'
import { isEmpty } from 'lodash'

import { CurrentTimeType, RenderDaysType, PlacementType } from '../types'
import { festival, lFestival } from './festivalInfo'

// 要么干掉他，要么管理后台，通过接口动态往里加
import { isHoliday, isAddtionalWorkday } from './chineseWorkday'

enum RenderMonthEnum {
  'LAST' = 'last',
  'NEXT' = 'next',
  'CURRENT' = 'current'
}

const WEEK_DAY: number = 7
const MAX_RENDER_DAY: number = 28

/**
 * @param date Date object
 * @returns {year month day}
 * @description 根据 date 对象返回 year month day
 * @author Lou
 */
const getCurrentTime = (date?: Date): CurrentTimeType => {
  const [year, month, day] = dayjs(date)
    .format('YYYY_MM_DD')
    .split('_')
    .map((time) => Number(time))
  return {
    year,
    month,
    day
  }
}

const defaultTime: CurrentTimeType = getCurrentTime()

/**
 * @param year
 * @param month
 * @param weekStart 一周开始的天数，startMonday | startSunday
 * @returns 当月需要的每一天的日历数据
 * @author Lou
 */
const getRenderDaysConfig = (
  year: number = defaultTime.year,
  month: number = defaultTime.month,
  weekStart: 'startMonday' | 'startSunday'
): RenderDaysType[] => {
  /**
   * 获取当月的时间
   * note: dayjs 中 month 需要减一，0 代表 1 月
   */
  const currentTime = dayjs()
    .set('year', year)
    .set('month', month - 1)

  const isStartSunday = weekStart === 'startSunday'

  // 获取当月的第一天是周几
  let firstDays =
    dayjs(currentTime).startOf('month').day() === 0 ? 7 : dayjs(currentTime).startOf('month').day()

  isStartSunday && firstDays++

  const currentMonthDays = currentTime.daysInMonth()

  // 上个月的时间
  const lastMonth = dayjs(currentTime).subtract(1, 'months')
  // 上个月的天数
  const lastMonthDays = lastMonth.daysInMonth()

  // 下一个的时间
  const nextMonth = dayjs(currentTime).add(1, 'months')
  // 获取下一个月的第一天是周几
  let nextMonthFirstDay =
    nextMonth.startOf('month').day() === 0 ? 7 : dayjs(nextMonth).startOf('month').day()

  isStartSunday && nextMonthFirstDay++

  const lastRenderDays: Array<RenderDaysType> = []
  const currentRenderDays: Array<RenderDaysType> = []
  const nextRenderDays: Array<RenderDaysType> = []

  const pushRenderDays = (
    list: Array<[] | RenderDaysType>,
    year: number,
    month: number,
    day: number,
    type: RenderMonthEnum
  ) => {
    /**
     * term 节气 string
     * dayCn 农历日中文名称 string
     * monthCn 农历月中文名称，如果为闰月，则会在月份前增加 闰 字 string
     * cMonth 公历月 number
     * lMonth 农历月 number
     * lDay 农历日 number
     * @doc：https://www.npmjs.com/package/solarlunar
     */
    const { term, dayCn, monthCn, cMonth, lMonth, lDay } = solar2lunar(year, month, day)

    const getFestivalName = (month: number, day: number, lMonth: number, lDay: number): string => {
      // 先看公历是否有值，再看农历是否有值
      if (!isEmpty(festival[`${month}-${day}`])) {
        return festival[`${month}-${day}`].title
      }
      if (!isEmpty(lFestival[`${lMonth}-${lDay}`])) {
        return lFestival[`${lMonth}-${lDay}`].title
      }
      return ''
    }
    list.push({
      cName: term || (dayCn === '初一' ? monthCn : dayCn), // 优先展示节气，如果是初一，展示农历月份
      year,
      month: cMonth,
      day,
      monthCn,
      isLastMonth: type === RenderMonthEnum.LAST,
      isCurrentMonth: type === RenderMonthEnum.CURRENT,
      isNextMonth: type === RenderMonthEnum.NEXT,
      isHoliday: isHoliday(`${year}-${month}-${day}`),
      isAdjustRest: isAddtionalWorkday(`${year}-${month}-${day}`),
      festivalName: getFestivalName(month, day, lMonth, lDay)
    })
  }

  /**
   * 获取上一月补位的渲染天数
   * note： 为什么 + 1，因为周一得到的数值是 1
   */
  for (let day = lastMonthDays; day > lastMonthDays - firstDays + 1; day--) {
    pushRenderDays(
      lastRenderDays,
      lastMonth.get('year'),
      lastMonth.get('month') + 1,
      day,
      RenderMonthEnum.LAST
    )
  }

  for (let day = 1; day <= currentMonthDays; day++) {
    pushRenderDays(
      currentRenderDays,
      year,
      currentTime.get('month') + 1,
      day,
      RenderMonthEnum.CURRENT
    )
  }

  /**
   * 如果大于 28 天，7 减 下一个月的第一天是周几
   * 如果等于 28 天, 渲染下一个月 7 天的数据
   * 如果小于 28 天，7 减 下一个月的第一天是周几 + 一行 （7天数据）
   */

  let nextMonthRenderTime = 0
  const renderDaysTime = lastRenderDays.length + currentRenderDays.length
  if (renderDaysTime > MAX_RENDER_DAY) {
    if (renderDaysTime > 35) {
      nextMonthRenderTime = WEEK_DAY - nextMonthFirstDay + 1
    } else {
      // +1 原因，for 循环 从 1 开始
      nextMonthRenderTime =
        renderDaysTime === MAX_RENDER_DAY + WEEK_DAY ? 0 : WEEK_DAY - nextMonthFirstDay + 1
    }
  } else if (renderDaysTime === MAX_RENDER_DAY) {
    nextMonthRenderTime = WEEK_DAY
  } else {
    nextMonthRenderTime = WEEK_DAY - nextMonthFirstDay + 1 + 7
  }

  if (nextMonthRenderTime !== 0) {
    for (let day = 1; day <= nextMonthRenderTime; day++) {
      pushRenderDays(
        nextRenderDays,
        nextMonth.get('year'),
        nextMonth.get('month') + 1,
        day,
        RenderMonthEnum.NEXT
      )
    }
  }

  const result: Array<RenderDaysType> = [
    ...lastRenderDays.reverse(),
    ...currentRenderDays,
    ...nextRenderDays
  ]
  return result
}

/**
 * @param index number 遍历的索引值
 * @returns PlacementType
 */
const getPlacement = (index: number, renderDayList: RenderDaysType[]): PlacementType => {
  const rowNum = Math.ceil((index + 1) / 7) // 当前行
  const colNum = (index + 1) % 7 === 0 ? 7 : (index + 1) % 7 // 当前列
  const isLeft = [6, 7].includes(colNum) // 第六列和第七列向左偏

  const maxRow = renderDayList.length / 7 // 最后一行方向是top
  const isTop = maxRow === rowNum
  if (isTop) {
    // 为了防止最后一行的溢出，第一列和最后一列单独处理
    if (colNum === 1) {
      return 'top-start'
    }
    if (colNum === 7) {
      return 'top-end'
    }
    return 'top'
  }
  if (isLeft) {
    return 'left-start'
  }
  return 'right-start'
}

export { getCurrentTime, getRenderDaysConfig, getPlacement }
