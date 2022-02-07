type CurrentTimeType = {
  year: number
  month: number
  day: number
}

type ChangeCurrentTimeType = (_value: CurrentTimeType) => void

type RenderDaysType = {
  cName: string
  year: number
  month: number
  monthCn: string
  day: number
  isLastMonth: boolean
  isCurrentMonth: boolean
  isNextMonth: boolean
  isHoliday: boolean
  isAdjustRest: boolean
  festivalName: string
  todoList?: Array<{
    id: number
    title: string
    description: string
    done: boolean
    creatTime: number
    editTime?: number
  }>
}

type InputInfoType = {
  title: string
  content: string
}

type HandleMonthType = 'LAST' | 'LAST'

type PlacementType = 'right-start' | 'left-start' | 'top' | 'top-start' | 'top-end'

export {
  CurrentTimeType,
  ChangeCurrentTimeType,
  RenderDaysType,
  InputInfoType,
  HandleMonthType,
  PlacementType
}
