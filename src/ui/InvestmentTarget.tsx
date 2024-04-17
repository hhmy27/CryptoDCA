import React, {useState, ChangeEvent, FormEvent} from 'react'
import {Select, Input, Button, Text, Note} from '@geist-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {supportedCryptocurrencies} from '@/lib/config'
import {InvestmentTargetProps} from '@/types/investment'

export const InvestmentTarget: React.FC<InvestmentTargetProps> = ({target, index, onCurrencyChange, onPercentageChange, onRemoveTarget}) => {
    return (
        <div>
            <Text h4>Investment target {index + 1}</Text>
            <Select value={target.currency} onChange={(value) => onCurrencyChange(index, value.toString())}>
                {supportedCryptocurrencies.map((crypto) => (
                    <Select.Option key={crypto} value={crypto}>
                        {crypto}
                    </Select.Option>
                ))}
            </Select>
            <Input type="default" value={target.percentage} onChange={(e) => onPercentageChange(index, e)} />
            <Button type="error" onClick={() => onRemoveTarget(index)}>
                -
            </Button>
        </div>
    )
}
