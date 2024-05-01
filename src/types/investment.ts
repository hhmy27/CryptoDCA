import _ from 'lodash'

import * as yup from 'yup'
import {ChangeEvent, createContext} from 'react'
import {create} from 'zustand'

export type FrequencyConfig = {
    frequency: 'daily' | 'weekly' | 'monthly'
    dayOfWeek?: number // 1-7 represents Monday to Sunday
    dayOfMonth?: number
}

export type InvestmentData = {
    date: Date
    currentTotalValue: number
    totalInvestment: number
    currentProfit: number
    profitRate: number
    holdingCost: number
}
export type PortfolioStats = {
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
type Store = {
    investmentConfig: InvestmentConfig
    snapshotConfig: InvestmentConfig
    setInvestmentConfig: (config: InvestmentConfig) => void
    submitted: boolean
    setStartDate: (date: Date) => void
    setSubmitted: (value: boolean) => void
}

export const useInvestmentStore = create<Store>((set, get) => ({
    investmentConfig: {
        investmentTargets: [{currency: 'BTC-USD', percentage: 100}],
        frequencyConfig: {frequency: 'daily'},
        startDate: new Date('2014-09-17'),
        investmentAmount: 0,
        isOverLimit: false
    },
    snapshotConfig: {
        investmentTargets: [{currency: 'BTC-USD', percentage: 100}],
        frequencyConfig: {frequency: 'daily'},
        startDate: new Date(),
        investmentAmount: 0,
        isOverLimit: false
    },
    submitted: false,
    setInvestmentConfig: (config) => set({investmentConfig: config}),
    setStartDate: (date) => set({investmentConfig: {...get().investmentConfig, startDate: date}}),
    setSubmitted: (value) => {
        const state = get()
        if (value && !_.isEqual(state.investmentConfig, state.snapshotConfig)) {
            set({submitted: value, snapshotConfig: state.investmentConfig})
        } else {
            set({submitted: value})
        }
    }
}))

export interface InvestmentAllocation {
    currency: string
    percentage: number
}

export type InvestmentFormProps = {
    investmentConfig: InvestmentConfig
    setInvestmentConfig: Store['setInvestmentConfig']
    setSubmitted: Store['setSubmitted']
    setStartDate: Store['setStartDate']
}

export interface InvestmentTargetProps {
    target: InvestmentAllocation
    index: number
    currencySet: Set<string>
    onCurrencyChange: (index: number, currency: string) => void
    onPercentageChange: (index: number, percentage: number) => void
    onRemoveTarget: (index: number) => void
}

export interface FrequencySelectorProps {
    frequencyConfig: FrequencyConfig
    onFrequencyConfigChange: (value: FrequencyConfig) => void
}
