import React from 'react'
import {InvestmentConfig} from '@/types/investment'
export const Chart: React.FC<InvestmentConfig> = (investmentConfig) => {
    // expand investmentConfig
    return (
        <div>
            <h1>Chart</h1>
            <pre>{JSON.stringify(investmentConfig, null, 2)}</pre>
        </div>
    )
}
