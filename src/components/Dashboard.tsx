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

import {useInvestmentStore} from '@/types/investment'

export const InvestmentDashboard = () => {
    const {investmentConfig, submitted, formValidated, setInvestmentConfig, submit} = useInvestmentStore()

    return (
        <div>
            <InvestmentForm investmentConfig={investmentConfig} setInvestmentConfig={setInvestmentConfig} submitted={submitted} handleSubmit={submit} />
            {submitted && formValidated && <Chart investmentConfig={investmentConfig} />}
        </div>
    )
}
