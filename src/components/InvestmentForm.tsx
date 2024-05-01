import React, {useState, ChangeEvent, FormEvent} from 'react'
import {Input, Button, Note} from '@geist-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {supportedCryptocurrencies} from '@/lib/config'
import {FrequencySelector} from './FrequencySelector'
import {InvestmentFormProps} from '@/types/investment'
import {InvestmentTarget} from '@/components/InvestmentTarget'

export const InvestmentForm: React.FC<InvestmentFormProps> = ({investmentConfig, setInvestmentConfig, setStartDate, setSubmitted}) => {
    const [errors, setErrors] = useState<string[]>([])

    const totalPercentage = investmentConfig.investmentTargets.reduce((total, target) => total + target.percentage, 0)
    const currencySet = new Set(investmentConfig.investmentTargets.map((a) => a.currency))
    const latestStartDate = investmentConfig.investmentTargets
        .map((target) => supportedCryptocurrencies[target.currency].startDate)
        .sort()
        .reverse()[0]

    const distributePercentageEqually = () => {
        const targetCount = investmentConfig.investmentTargets.length
        const equalPercentage = Math.floor(100 / targetCount)
        const remainder = 100 - equalPercentage * (targetCount - 1)

        const newConfig = {...investmentConfig}
        newConfig.investmentTargets.forEach((target, index) => {
            target.percentage = index === targetCount - 1 ? remainder : equalPercentage
        })

        setInvestmentConfig(newConfig)
    }

    const handleCurrencyChange = (index: number, currency: string) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets[index].currency = currency
        setInvestmentConfig(newConfig)

        distributePercentageEqually()
    }

    const handlePercentageChange = (index: number, percentage: number) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets[index].percentage = percentage
        setInvestmentConfig(newConfig)
    }

    const handleAddTarget = () => {
        const newConfig = {...investmentConfig}
        const unselectedCurrencies = Object.keys(supportedCryptocurrencies).filter((currency) => !currencySet.has(currency))
        const newCurrency = unselectedCurrencies.length > 0 ? unselectedCurrencies[0] : ''
        newConfig.investmentTargets.push({currency: newCurrency, percentage: 0})
        setInvestmentConfig(newConfig)

        distributePercentageEqually()
    }

    const handleRemoveTarget = (index: number) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets.splice(index, 1)
        setInvestmentConfig(newConfig)

        distributePercentageEqually()
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

        if (totalPercentage !== 100) {
            newErrors.push('Total investment percentage should be exactly 100%')
        }

        setErrors(newErrors)
        if (newErrors.length > 0) {
            setSubmitted(false)
            return
        }

        setSubmitted(true)
    }
    return (
        <div className="m-4">
            <h1 className="text-2xl font-bold mb-4">Investment Form</h1>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <Note type="default">You still need to distribute {100 - totalPercentage}%</Note>
                {investmentConfig.investmentTargets.map((target, index) => (
                    <div key={index}>
                        <InvestmentTarget
                            target={target}
                            index={index}
                            currencySet={currencySet}
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
                    <Input
                        type="default"
                        min="0"
                        step="0.01"
                        value={String(investmentConfig.investmentAmount)}
                        onChange={handleInvestmentAmountChange}
                        placeholder="Investment amount"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Investment Frequency</label>
                    <FrequencySelector
                        frequencyConfig={investmentConfig.frequencyConfig}
                        onFrequencyConfigChange={(newFrequencyConfig) => setInvestmentConfig({...investmentConfig, frequencyConfig: newFrequencyConfig})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <DatePicker
                        selected={latestStartDate ? new Date(latestStartDate) : new Date()}
                        minDate={latestStartDate ? new Date(latestStartDate) : new Date()}
                        onChange={(date) => {
                            setStartDate(date || new Date())
                        }}
                    />{' '}
                </div>
                {errors.map((error, i) => (
                    <Note key={i} type="error">
                        {error}
                    </Note>
                ))}
                <div>
                    <Button type="success" htmlType="submit" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Invest
                    </Button>
                </div>
            </form>
        </div>
    )
}
