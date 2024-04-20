import React, {useState, useEffect} from 'react'
import {InvestmentConfig, InvestmentData} from '@/types/investment'
import {calculateMultipleInvestments} from '@/lib/calc'
import {endDate} from '@/lib/config'

export const Chart: React.FC<InvestmentConfig> = (investmentConfig) => {
    // expand investmentConfig
    const [investmentData, setInvestmentData] = useState<InvestmentData[]>([])

    useEffect(() => {
        investmentConfig.investmentTargets.forEach((target) => {
            const csvFilePath = `@/data/prices/${target.currency}.csv`
            calculateMultipleInvestments(
                csvFilePath,
                new Date(investmentConfig.startDate),
                endDate,
                investmentConfig.frequencyConfig,
                (investmentConfig.investmentAmount * target.percentage) / 100
            )
                .then((data) => {
                    setInvestmentData((prevData) => [...prevData, ...data])
                })
                .catch((err) => console.error(err))
        })
    }, [investmentConfig])

    useEffect(() => {
        console.log('Investment data:', investmentData)
    }, [investmentData])

    return (
        <div>
            <h1>Chart</h1>
            <pre>{JSON.stringify(investmentConfig, null, 2)}</pre>
        </div>
    )
}
