import React, {useState, ChangeEvent, FormEvent} from 'react'
import {Select, Input, Button, Text, Note} from '@geist-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {supportedCryptocurrencies} from '@/lib/config'
import {FrequencySelector} from './FrequencySelector'
import {InvestmentAllocation} from '@/types/investment'
import {InvestmentTarget} from '@/ui/InvestmentTarget'

export const InvestmentForm = () => {
    const [investmentTargets, setInvestmentTargets] = useState<InvestmentAllocation[]>([{currency: '', percentage: ''}])
    const [frequency, setFrequency] = useState<string>('')
    const [dayOfWeek, setDayOfWeek] = useState<string>('')
    const [dayOfMonth, setDayOfMonth] = useState<number>()
    const [isOverLimit, setIsOverLimit] = useState<boolean>(false)

    const [startDate, setStartDate] = useState(new Date())

    const handleCurrencyChange = (index: number, value: string) => {
        const newTargets = [...investmentTargets]
        newTargets[index].currency = value
        setInvestmentTargets(newTargets)
        setInvestmentTargets(newTargets)
    }

    const handlePercentageChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const newTargets = [...investmentTargets]
        newTargets[index].percentage = event.target.value
        setInvestmentTargets(newTargets)

        const totalPercentage = newTargets.reduce((total, target) => total + Number(target.percentage), 0)
        setIsOverLimit(totalPercentage > 100)
    }

    const handleAddTarget = () => {
        setInvestmentTargets([...investmentTargets, {currency: '', percentage: ''}])
    }

    const handleRemoveTarget = (index: number) => {
        if (investmentTargets.length === 1) return

        const newTargets = [...investmentTargets]
        newTargets.splice(index, 1)
        setInvestmentTargets(newTargets)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (isOverLimit) {
            console.error('Total investment percentage exceeds 100%')
            return
        }
        console.log({
            investmentTargets,
            frequency,
            dayOfWeek,
            dayOfMonth
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            {investmentTargets.map((target, index) => (
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
                frequency={frequency}
                dayOfWeek={dayOfWeek}
                dayOfMonth={dayOfMonth}
                onFrequencyChange={setFrequency}
                onDayOfWeekChange={setDayOfWeek}
                onDayOfMonthChange={setDayOfMonth}
            />

            <Button type="secondary" onClick={handleAddTarget}>
                +
            </Button>

            {isOverLimit && <Note type="error">Total investment percentage exceeds 100%</Note>}
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date || new Date())} />
            <Button type="success" htmlType="submit">
                Invest
            </Button>
        </form>
    )
}
