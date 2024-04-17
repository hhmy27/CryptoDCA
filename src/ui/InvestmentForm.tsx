import React, {useState, ChangeEvent, FormEvent} from 'react'
import {Select, Input, Button, Text, Note} from '@geist-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {supportedCryptocurrencies} from '@/lib/config'

interface InvestmentTarget {
    currency: string
    percentage: string
}

export const InvestmentForm = () => {
    const [investmentTargets, setInvestmentTargets] = useState<InvestmentTarget[]>([{currency: '', percentage: ''}])
    const [frequency, setFrequency] = useState<string>('')
    const [dayOfWeek, setDayOfWeek] = useState<string>('')
    const [dayOfMonth, setDayOfMonth] = useState<number>()
    const [isOverLimit, setIsOverLimit] = useState<boolean>(false)

    const [startDate, setStartDate] = useState(new Date())

    const handleCurrencyChange = (index: number, value: string) => {
        const newTargets = [...investmentTargets]
        newTargets[index].currency = value
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
                <div key={index}>
                    <Text h4>Investment target {index + 1}</Text>
                    <Select value={target.currency} onChange={(value) => handleCurrencyChange(index, value.toString())}>
                        {supportedCryptocurrencies.map((crypto) => (
                            <Select.Option key={crypto} value={crypto}>
                                {crypto}
                            </Select.Option>
                        ))}
                    </Select>
                    <Input type="default" value={target.percentage} onChange={(e) => handlePercentageChange(index, e)} />
                    <Button type="error" onClick={() => handleRemoveTarget(index)}>
                        -
                    </Button>
                </div>
            ))}
            <Button type="secondary" onClick={handleAddTarget}>
                +
            </Button>
            <Select value={frequency} onChange={(value) => setFrequency(value.toString())}>
                <Select.Option value="Daily">Daily</Select.Option>
                <Select.Option value="Weekly">Weekly</Select.Option>
                <Select.Option value="Monthly">Monthly</Select.Option>
            </Select>
            {frequency === 'Weekly' && (
                <Select value={dayOfWeek} onChange={(value) => setDayOfWeek(value.toString())}>
                    <Select.Option value="Monday">Monday</Select.Option>
                    <Select.Option value="Tuesday">Tuesday</Select.Option>
                    <Select.Option value="Wednesday">Wednesday</Select.Option>
                    <Select.Option value="Thursday">Thursday</Select.Option>
                    <Select.Option value="Friday">Friday</Select.Option>
                    <Select.Option value="Saturday">Saturday</Select.Option>
                    <Select.Option value="Sunday">Sunday</Select.Option>
                </Select>
            )}
            {frequency === 'Monthly' && (
                <Select value={dayOfMonth?.toString()} onChange={(value) => setDayOfMonth(Number(value))}>
                    {Array.from({length: 31}, (_, i) => (
                        <Select.Option key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                        </Select.Option>
                    ))}
                </Select>
            )}
            {isOverLimit && <Note type="error">Total investment percentage exceeds 100%</Note>}
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date || new Date())} />
            <Button type="success" htmlType="submit">
                Invest
            </Button>
        </form>
    )
}
