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

export const InvestmentForm: React.FC<InvestmentFormProps> = ({investmentConfig, setInvestmentConfig, submitted, handleSubmit}) => {
    const handleInvestmentAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '' && isNaN(Number(event.target.value))) {
            return
        }
        const newConfig = {...investmentConfig}
        newConfig.investmentAmount = Number(event.target.value)
        setInvestmentConfig(newConfig)
    }

    const [errors, setErrors] = useState<string[]>([])
    const [totalPercentage, setTotalPercentage] = useState<number>(100)
    const [dateSelected, setDateSelected] = useState(false)
    const [selectedCurrencies, setSelectedCurrencies] = useState<Map<string, Cryptocurrency>>(
        new Map([[investmentConfig.investmentTargets[0].currency, supportedCryptocurrencies[investmentConfig.investmentTargets[0].currency]]])
    )

    const [latestStartDate, setLatestStartDate] = useState<Date>(new Date(supportedCryptocurrencies['BTC-USD'].startDate))
    useEffect(() => {
        let latest = new Date(0) // set to the earliest possible date
        console.log(selectedCurrencies.values())
        Array.from(selectedCurrencies.values()).forEach((currency) => {
            const startDate = new Date(currency.startDate)
            if (startDate > latest) {
                latest = startDate
            }
        })
        setLatestStartDate(latest)
        console.log('latest start date:', latest)
    }, [selectedCurrencies])

    const distributePercentageEqually = (newConfig: InvestmentConfig) => {
        const targetCount = newConfig.investmentTargets.length
        const equalPercentage = Math.floor(100 / targetCount)
        const remainder = 100 - equalPercentage * (targetCount - 1)

        newConfig.investmentTargets.forEach((target, index) => {
            target.percentage = index === targetCount - 1 ? remainder : equalPercentage
        })

        const newTotalPercentage = newConfig.investmentTargets.reduce((total, target) => total + target.percentage, 0)
        newConfig.isOverLimit = newTotalPercentage > 100
        setTotalPercentage(newTotalPercentage)
    }

    const handleCurrencyChange = (index: number, value: string) => {
        const newConfig = {...investmentConfig, investmentTargets: [...investmentConfig.investmentTargets]}
        newConfig.investmentTargets[index] = {...newConfig.investmentTargets[index], currency: value}
        setInvestmentConfig(newConfig)
        setSelectedCurrencies(new Map(selectedCurrencies.set(newConfig.investmentTargets[index].currency, supportedCryptocurrencies[value])))

        distributePercentageEqually(newConfig)
        setInvestmentConfig(newConfig)
    }

    const handleAddTarget = () => {
        const newConfig = {...investmentConfig}
        const unselectedCurrencies = Object.keys(supportedCryptocurrencies).filter((currency) => !Array.from(selectedCurrencies.keys()).includes(currency))
        const newCurrency = unselectedCurrencies.length > 0 ? unselectedCurrencies[0] : ''
        newConfig.investmentTargets.push({currency: newCurrency, percentage: 0})
        setSelectedCurrencies(new Map(selectedCurrencies.set(newConfig.investmentTargets[newConfig.investmentTargets.length - 1].currency, supportedCryptocurrencies[newCurrency])))

        distributePercentageEqually(newConfig)
        setInvestmentConfig(newConfig)
    }

    const handlePercentageChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets[index].percentage = Number(event.target.value)
        setInvestmentConfig(newConfig)

        const newTotalPercentage = newConfig.investmentTargets.reduce((total, target) => total + target.percentage, 0)
        newConfig.isOverLimit = newTotalPercentage > 100
        setInvestmentConfig(newConfig)
        setTotalPercentage(newTotalPercentage)
    }

    const handleRemoveTarget = (index: number) => {
        if (investmentConfig.investmentTargets.length === 1) return

        const newConfig = {...investmentConfig}
        const removedCurrency = newConfig.investmentTargets[index].currency
        newConfig.investmentTargets.splice(index, 1)
        setInvestmentConfig(newConfig)
        setSelectedCurrencies(new Map(Array.from(selectedCurrencies.entries()).filter(([key, value]) => key !== removedCurrency)))
        const newTotalPercentage = newConfig.investmentTargets.reduce((total, target) => total + target.percentage, 0)
        newConfig.isOverLimit = newTotalPercentage > 100
        setTotalPercentage(newTotalPercentage)
    }

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault()

        let newErrors: string[] = []

        if (investmentConfig.isOverLimit || totalPercentage < 100) {
            newErrors.push('Total investment percentage should be exactly 100%')
        }

        if (investmentConfig.investmentAmount <= 0) {
            newErrors.push('Investment amount should be greater than 0')
        }

        if (investmentConfig.investmentTargets.length === 0) {
            newErrors.push('Investment targets should not be empty')
        }

        if (newErrors.length > 0) {
            setErrors(newErrors)
            return
        }

        const newConfig = {...investmentConfig}
        if (!dateSelected) {
            newConfig.startDate = latestStartDate
        }

        setInvestmentConfig(newConfig)
        handleSubmit()
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
                            selectedCurrencies={Array.from(selectedCurrencies.values())}
                            setSelectedCurrencies={setSelectedCurrencies}
                            onCurrencyChange={handleCurrencyChange}
                            onPercentageChange={handlePercentageChange}
                            onRemoveTarget={handleRemoveTarget}
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Investment Frequency</label>
                    <FrequencySelector
                        frequencyConfig={investmentConfig.frequencyConfig}
                        onFrequencyConfigChange={(newFrequencyConfig) => setInvestmentConfig({...investmentConfig, frequencyConfig: newFrequencyConfig})}
                    />
                </div>

                <div>
                    <Button type="secondary" onClick={handleAddTarget}>
                        +
                    </Button>
                </div>

                {investmentConfig.isOverLimit && <Note type="error">Total investment percentage exceeds 100%</Note>}
                {submitted && totalPercentage !== 100 && <Note type="error">Total investment percentage should be exactly 100%</Note>}
                {submitted && investmentConfig.investmentAmount <= 0 && <Note type="error">Investment amount should be greater than 0</Note>}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <DatePicker
                        selected={latestStartDate}
                        minDate={latestStartDate}
                        onChange={(date) => {
                            setInvestmentConfig({...investmentConfig, startDate: date || new Date()})
                            setDateSelected(true)
                        }}
                    />{' '}
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
