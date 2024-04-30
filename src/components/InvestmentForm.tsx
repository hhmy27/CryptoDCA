import React, {useState, useEffect, ChangeEvent, FormEvent} from 'react'
import {Select, Input, Button, Text, Note} from '@geist-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {supportedCryptocurrencies} from '@/lib/config'
import {FrequencySelector} from './FrequencySelector'
import {InvestmentAllocation, InvestmentFormProps} from '@/types/investment'
import {InvestmentTarget} from '@/components/InvestmentTarget'
import {InvestmentConfig, FrequencyConfig} from '@/types/investment'
import {Cryptocurrency} from '@/types/investment'
import {useInvestmentStore} from '@/types/investment'

export const InvestmentForm: React.FC = () => {
    const {investmentConfig, setInvestmentConfig, submit, submitted, errors, setErrors} = useInvestmentStore()

    const handleCurrencyChange = (currency: string, index: number) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets[index].currency = currency
        setInvestmentConfig(newConfig)
    }

    const handlePercentageChange = (percentage: number, index: number) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets[index].percentage = percentage
        setInvestmentConfig(newConfig)
    }

    const handleAddTarget = () => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets.push({currency: 'BTC-USD', percentage: 0})
        setInvestmentConfig(newConfig)
    }

    const handleRemoveTarget = (index: number) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets.splice(index, 1)
        setInvestmentConfig(newConfig)
    }

    const handleInvestmentAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentAmount = Number(e.target.value)
        setInvestmentConfig(newConfig)
    }

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault()
        let newErrors: string[] = []

        if (investmentConfig.investmentAmount <= 0) {
            newErrors.push('Investment amount should be greater than 0')
        }

        if (investmentConfig.investmentTargets.length === 0) {
            newErrors.push('Investment targets should not be empty')
        }

        const totalPercentage = investmentConfig.investmentTargets.reduce((sum, target) => sum + target.percentage, 0)

        if (totalPercentage !== 100) {
            newErrors.push('Total investment percentage should be exactly 100%')
        }

        setErrors(newErrors)
        if (newErrors.length > 0) {
            submit(false)
            return
        }

        submit(true)
    }
    return (
        <div className="m-4">
            <h1 className="text-2xl font-bold mb-4">Investment Form</h1>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                {investmentConfig.investmentTargets.map((target, index) => (
                    <div key={index}>
                        <InvestmentTarget
                            target={target}
                            index={index}
                            onCurrencyChange={handleCurrencyChange}
                            onPercentageChange={handlePercentageChange}
                            onRemoveTarget={handleRemoveTarget}
                        />
                    </div>
                ))}
                <div>
                    <Button type="secondary" onClick={handleAddTarget}>
                        +
                    </Button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
                    <Input type="default" min="0" step="0.01" value={investmentConfig.investmentAmount} onChange={handleInvestmentAmountChange} placeholder="Investment amount" />
                </div>
                {errors.map((error, i) => (
                    <Note key={i} type="error">
                        {error}
                    </Note>
                ))}
                <div>
                    <Button type="success" htmlType="submit">
                        Invest
                    </Button>
                </div>
            </form>
        </div>
    )
}
