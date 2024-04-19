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
        investmentTargets: [{currency: supportedCryptocurrencies[0], percentage: 0}],
        frequencyConfig: {frequency: 'daily'},
        startDate: new Date(),
        investmentAmount: 0,
        isOverLimit: false
    })
    const handleInvestmentAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '' && isNaN(Number(event.target.value))) {
            return
        }
        const newConfig = {...investmentConfig}
        newConfig.investmentAmount = Number(event.target.value)
        setInvestmentConfig(newConfig)
    }

    const [totalPercentage, setTotalPercentage] = useState<number>(0)
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false)
    const [selectedCurrencies, setSelectedCurrencies] = useState<Map<number, string>>(new Map([[0, supportedCryptocurrencies[0]]]))

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
        const newConfig = {...investmentConfig}
        newConfig.investmentTargets[index].currency = value
        setInvestmentConfig(newConfig)
        setSelectedCurrencies(new Map(selectedCurrencies.set(index, value)))

        distributePercentageEqually(newConfig)
        setInvestmentConfig(newConfig)
    }

    const handleAddTarget = () => {
        const newConfig = {...investmentConfig}
        const unselectedCurrencies = supportedCryptocurrencies.filter((currency) => !Array.from(selectedCurrencies.values()).includes(currency))
        const newCurrency = unselectedCurrencies.length > 0 ? unselectedCurrencies[0] : ''
        newConfig.investmentTargets.push({currency: newCurrency, percentage: 0})
        setSelectedCurrencies(new Map(selectedCurrencies.set(newConfig.investmentTargets.length, newCurrency)))

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
        newConfig.investmentTargets.splice(index, 1)
        setInvestmentConfig(newConfig)
        setSelectedCurrencies(new Map(Array.from(selectedCurrencies.entries()).filter(([key, value]) => key !== index)))

        const newTotalPercentage = newConfig.investmentTargets.reduce((total, target) => total + target.percentage, 0)
        newConfig.isOverLimit = newTotalPercentage > 100
        setTotalPercentage(newTotalPercentage)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setHasAttemptedSubmit(true)

        if (investmentConfig.isOverLimit || totalPercentage < 100) {
            console.error('Total investment percentage should be exactly 100%')
            return
        }

        console.log(investmentConfig)
    }

    return (
        <div>
            <h1>Investment Form</h1>
            <form onSubmit={handleSubmit}>
                <Note type="default">You still need to distribute {100 - totalPercentage}%</Note>
                {investmentConfig.investmentTargets.map((target, index) => (
                    <InvestmentTarget
                        key={index}
                        target={target}
                        index={index}
                        selectedCurrencies={Array.from(selectedCurrencies.values())}
                        setSelectedCurrencies={setSelectedCurrencies}
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
                {hasAttemptedSubmit && totalPercentage !== 100 && <Note type="error">Total investment percentage should be exactly 100%</Note>}
                <DatePicker selected={investmentConfig.startDate} onChange={(date) => setInvestmentConfig({...investmentConfig, startDate: date || new Date()})} />
                <Input type="default" min="0" step="0.01" value={investmentConfig.investmentAmount} onChange={handleInvestmentAmountChange} placeholder="Investment amount" />
                <Button type="success" htmlType="submit">
                    Invest
                </Button>
            </form>
        </div>
    )
}
