import React, {useState, useRef, useEffect, ChangeEvent, FormEvent} from 'react'
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
    const submittedConfigRef = useRef<InvestmentConfig>(investmentConfig)
    const [submitted, setSubmitted] = useState(false)

    const [update, setUpdate] = useState(0) // Add a new state

    const handleSubmit = () => {
        submittedConfigRef.current = investmentConfig
        setSubmitted(true)
        setUpdate(update + 1)
    }

    return (
        <div>
            <InvestmentForm investmentConfig={investmentConfig} setInvestmentConfig={setInvestmentConfig} submitted={submitted} handleSubmit={handleSubmit} />
            {submitted && <Chart investmentConfig={submittedConfigRef.current} update={update} />}
        </div>
    )
}
