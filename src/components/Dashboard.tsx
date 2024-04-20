import React, {useState, useEffect, ChangeEvent, FormEvent} from 'react'
import {Select, Input, Button, Text, Note} from '@geist-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {supportedCryptocurrencies} from '@/lib/config'
import {FrequencySelector} from './FrequencySelector'
import {InvestmentAllocation} from '@/types/investment'
import {InvestmentTarget} from '@/components/InvestmentTarget'
import {InvestmentConfig, FrequencyConfig} from '@/types/investment'
import {Cryptocurrency} from '@/types/investment'
import {InvestmentForm} from '@/components/InvestmentForm'
import {Chart} from '@/components/Chart'

export const InvestmentDashboard = () => {
    const [investmentConfig, setInvestmentConfig] = useState<InvestmentConfig>({
        investmentTargets: [{currency: 'BTC-USD', percentage: 100}],
        frequencyConfig: {frequency: 'daily'},
        startDate: new Date(),
        investmentAmount: 0,
        isOverLimit: false
    })
    const [submitted, setSubmitted] = useState(false)

    return (
        <div>
            <InvestmentForm investmentConfig={investmentConfig} setInvestmentConfig={setInvestmentConfig} submitted={submitted} setSubmitted={setSubmitted} />
            <Chart></Chart>
        </div>
    )
}
