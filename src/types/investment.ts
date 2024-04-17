import {ChangeEvent} from 'react'

export interface InvestmentTarget {
    currency: string
    percentage: string
}

export interface InvestmentTargetProps {
    target: InvestmentTarget
    index: number
    onCurrencyChange: (index: number, value: string) => void
    onPercentageChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void
    onRemoveTarget: (index: number) => void
}
