import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Select, Button, Input, Text, Note } from '@geist-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { supportedCryptocurrencies } from '@/lib/config'
import { InvestmentTargetProps } from '@/types/investment'

export const InvestmentTarget: React.FC<InvestmentTargetProps> = ({
    target,
    index,
    selectedCurrencies,
    setSelectedCurrencies,
    onCurrencyChange,
    onPercentageChange,
    onRemoveTarget
}) => {
    const [sortedCryptos, setSortedCryptos] = useState([]);

    useEffect(() => {
        const sorted = Object.entries(supportedCryptocurrencies)
            .sort((a, b) => a[1].marketCapRank - b[1].marketCapRank)
            .map(entry => entry[0]);
        setSortedCryptos(sorted);
    }, []);

    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Don't allow non-numeric input
        if (e.target.value !== '' && isNaN(Number(e.target.value))) {
            return
        }
        onPercentageChange(index, e)
    }
    const handleSelectChange = (value: string) => {
        onCurrencyChange(index, value)
        setSelectedCurrencies((prevSelectedCurrencies) => {
            const newSelectedCurrencies = new Map(prevSelectedCurrencies)
            newSelectedCurrencies.set(index, value)
            return newSelectedCurrencies
        })
    }

    return (
        <div>
            <Text h4>Investment target {index + 1}</Text>
            <Select value={target.currency} onChange={handleSelectChange}>
                {sortedCryptos.map((crypto) => {
                    const isSelected = selectedCurrencies.includes(crypto)
                    return (
                        <Select.Option key={crypto} value={crypto} disabled={isSelected && crypto !== target.currency}>
                            {crypto}
                        </Select.Option>
                    )
                })}
            </Select>
            <Input type="default" value={target.percentage} onChange={handlePercentageChange} />
            <Button type="error" onClick={() => onRemoveTarget(index)}>
                -
            </Button>
        </div>
    )
}
