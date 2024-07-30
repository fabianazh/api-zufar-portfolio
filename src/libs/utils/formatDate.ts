import {
    format,
    isToday,
    isThisYear,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
} from 'date-fns'
import { id } from 'date-fns/locale'

export default function formatDate() {
    return {
        detailedFormatDate: (seconds: number) => {
            const date = new Date(seconds * 1000)
            const now = new Date()
            const dayDifference = differenceInDays(now, date)
            const hourDifference = differenceInHours(now, date)
            const minuteDifference = differenceInMinutes(now, date)
            const secondDifference = differenceInSeconds(now, date)

            if (dayDifference < 30) {
                if (hourDifference < 24) {
                    if (minuteDifference < 60) {
                        if (secondDifference < 60) {
                            return `${format(date, 'eee, dd MMM yyyy, HH:mm', {
                                locale: id,
                            })} (${secondDifference} detik yang lalu)`
                        } else {
                            return `${format(date, 'eee, dd MMM yyyy, HH:mm', {
                                locale: id,
                            })} (${minuteDifference} menit yang lalu)`
                        }
                    } else {
                        return `${format(date, 'eee, dd MMM yyyy, HH:mm', {
                            locale: id,
                        })} (${hourDifference} jam yang lalu)`
                    }
                } else {
                    return `${format(date, 'eee, dd MMM yyyy, HH:mm', {
                        locale: id,
                    })} (${dayDifference} hari yang lalu)`
                }
            } else {
                return format(date, 'eee, dd MMM yyyy, HH:mm', { locale: id })
            }
        },
        simpleFormatDate: (seconds: number) => {
            const date = new Date(seconds * 1000)
            const now = new Date()

            if (isToday(date)) {
                return format(date, 'HH:mm')
            } else if (isThisYear(date) && differenceInHours(now, date) >= 24) {
                return format(date, 'd MMM')
            } else if (isThisYear(date)) {
                return format(date, 'd MMM')
            } else {
                return format(date, 'dd/MM/yyyy')
            }
        },
        relativeFormatDate: (seconds: number) => {
            const date = new Date(seconds * 1000)
            const now = new Date()
            const dayDifference = differenceInDays(now, date)
            const hourDifference = differenceInHours(now, date)
            const minuteDifference = differenceInMinutes(now, date)
            const secondDifference = differenceInSeconds(now, date)

            if (dayDifference < 30) {
                if (hourDifference < 24) {
                    if (minuteDifference < 60) {
                        if (secondDifference < 60) {
                            return `${secondDifference} detik yang lalu`
                        } else {
                            return `${minuteDifference} menit yang lalu`
                        }
                    } else {
                        return `${hourDifference} jam yang lalu`
                    }
                } else {
                    return `${dayDifference} hari yang lalu`
                }
            } else {
                return format(date, 'd MMM yyyy')
            }
        },
    }
}
