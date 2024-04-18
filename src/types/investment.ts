import * as yup from 'yup'
import {ChangeEvent, createContext} from 'react'

export type FrequencyConfig = {
    frequency: 'daily' | 'weekly' | 'monthly'
    dayOfWeek?: number // 1-7 represents Monday to Sunday
    dayOfMonth?: number
}

export type InvestmentConfig = {
    investmentTargets: InvestmentAllocation[]
    frequencyConfig: FrequencyConfig
    startDate: Date
    investmentAmount: number
    isOverLimit: boolean
}

export interface InvestmentAllocation {
    currency: string
    percentage: number
}

export interface InvestmentTargetProps {
    target: InvestmentAllocation
    index: number
    onCurrencyChange: (index: number, value: string) => void
    onPercentageChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void
    onRemoveTarget: (index: number) => void
}

export interface FrequencySelectorProps {
    frequencyConfig: FrequencyConfig
    onFrequencyConfigChange: (value: FrequencyConfig) => void
}
