import {ChangeEvent} from 'react'

export interface InvestmentAllocation {
    currency: string
    percentage: string
}

export interface InvestmentTargetProps {
    target: InvestmentAllocation
    index: number
    onCurrencyChange: (index: number, value: string) => void
    onPercentageChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void
    onRemoveTarget: (index: number) => void
}

export interface FrequencySelectorProps {
    frequency: string
    dayOfWeek: string
    dayOfMonth: number | undefined
    onFrequencyChange: (value: string) => void
    onDayOfWeekChange: (value: string) => void
    onDayOfMonthChange: (value: number) => void
}
