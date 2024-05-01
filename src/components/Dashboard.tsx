import React from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import {InvestmentForm} from '@/components/InvestmentForm'
import {Chart} from '@/components/Chart'

import {useInvestmentStore} from '@/types/investment'

export const InvestmentDashboard = () => {
    const {investmentConfig, snapshotConfig, setInvestmentConfig, submitted, setStartDate, setSubmitted} = useInvestmentStore()

    return (
        <div>
            <InvestmentForm investmentConfig={investmentConfig} setInvestmentConfig={setInvestmentConfig} setStartDate={setStartDate} setSubmitted={setSubmitted} />
            {submitted && <Chart investmentConfig={snapshotConfig} />}
        </div>
    )
}
