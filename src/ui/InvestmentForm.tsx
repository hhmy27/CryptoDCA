import React, {useState, ChangeEvent, FormEvent} from 'react'
import {Select, Input, Button, Text, Note} from '@geist-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {supportedCryptocurrencies} from '@/lib/config'
import {FrequencySelector} from './FrequencySelector'
import {InvestmentAllocation} from '@/types/investment'
import {InvestmentTarget} from '@/ui/InvestmentTarget'
import {InvestmentConfig, FrequencyConfig} from '@/types/investment'

export const InvestmentForm = () => {
    const [investmentConfig, setInvestmentConfig] = useState<InvestmentConfig>({
        investmentTargets: [{currency: '', percentage: 0}],
        frequencyConfig: {frequency: 'daily'},
        startDate: new Date(),
        isOverLimit: false
    })

    const handleCurrencyChange = (index: number, value: string) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets[index].currency = value
        setInvestmentConfig(newConfig)
    }

    const handlePercentageChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets[index].percentage = Number(event.target.value)
        setInvestmentConfig(newConfig)

        const totalPercentage = newConfig.investmentTargets.reduce((total, target) => total + target.percentage, 0)
        newConfig.isOverLimit = totalPercentage > 100
        setInvestmentConfig(newConfig)
    }

    const handleAddTarget = () => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets.push({currency: '', percentage: 0})
        setInvestmentConfig(newConfig)
    }

    const handleRemoveTarget = (index: number) => {
        if (investmentConfig.investmentTargets.length === 1) return

        const newConfig = {...investmentConfig}
        newConfig.investmentTargets.splice(index, 1)
        setInvestmentConfig(newConfig)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (investmentConfig.isOverLimit) {
            console.error('Total investment percentage exceeds 100%')
            return
        }
        console.log(investmentConfig)
    }

    return (
        <form onSubmit={handleSubmit}>
            {investmentConfig.investmentTargets.map((target, index) => (
                <InvestmentTarget
                    key={index}
                    target={target}
                    index={index}
                    onCurrencyChange={handleCurrencyChange}
                    onPercentageChange={handlePercentageChange}
                    onRemoveTarget={handleRemoveTarget}
                />
            ))}

            <FrequencySelector
                frequencyConfig={investmentConfig.frequencyConfig}
                onFrequencyConfigChange={(newFrequencyConfig) => setInvestmentConfig({...investmentConfig, frequencyConfig: newFrequencyConfig})}
            />
            <Button type="secondary" onClick={handleAddTarget}>
                +
            </Button>

            {investmentConfig.isOverLimit && <Note type="error">Total investment percentage exceeds 100%</Note>}
            <DatePicker selected={investmentConfig.startDate} onChange={(date) => setInvestmentConfig({...investmentConfig, startDate: date || new Date()})} />
            <Button type="success" htmlType="submit">
                Invest
            </Button>
        </form>
    )
}
