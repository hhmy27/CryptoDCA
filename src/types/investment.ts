import * as yup from 'yup'
import {ChangeEvent, createContext} from 'react'

export type FrequencyConfig = {
    frequency: 'daily' | 'weekly' | 'monthly'
    dayOfWeek?: number // 1-7 represents Monday to Sunday
    dayOfMonth?: number
}

export type InvestmentFormProps = {
    investmentConfig: InvestmentConfig
    setInvestmentConfig: React.Dispatch<React.SetStateAction<InvestmentConfig>>
    submitted: boolean
    handleSubmit: () => void
}

export type InvestmentData = {
    currentTotalValue: number
    totalInvestment: number
    currentProfit: number
    profitRate: number
    holdingCost: number
}

export type InvestmentResult = {
    totalInvestment: number
    totalValue: number
    totalReturn: number
    annualizedReturn: number
}

export type PriceDataResult = {
    allData: PriceData[]
    filteredData: PriceData[]
}

export type PriceData = {
    date: Date
    close: number
}

export interface Cryptocurrency {
    startDate: string
    marketCap: number
    marketCapRank: number
    icon: string
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
    selectedCurrencies: string[]
    setSelectedCurrencies: React.Dispatch<React.SetStateAction<Map<string, Cryptocurrency>>>
    onCurrencyChange: (index: number, currency: string) => void
    onPercentageChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void
    onRemoveTarget: (index: number) => void
}

export interface FrequencySelectorProps {
    frequencyConfig: FrequencyConfig
    onFrequencyConfigChange: (value: FrequencyConfig) => void
}
