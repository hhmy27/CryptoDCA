import React, {useState, useEffect} from 'react'
import {InvestmentConfig, InvestmentData, PorfolioStats} from '@/types/investment'
import {calculateMultipleInvestments} from '@/lib/calc'
import {endDate} from '@/lib/config'
export const Chart: React.FC<{investmentConfig: InvestmentConfig}> = ({investmentConfig}) => {
    const [investmentDataByCurrency, setInvestmentDataByCurrency] = useState<{[key: string]: InvestmentData[]}>({})
    const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({currentTotalValue: 0, totalInvestment: 0, currentProfit: 0, profitRate: 0})
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        setIsLoading(true)

        if (!Array.isArray(investmentConfig.investmentTargets)) {
            console.error('investmentConfig.investmentTargets is not an array:', investmentConfig.investmentTargets)
            console.log(JSON.stringify(investmentConfig, null, 2))
            return
        }

        const promises = investmentConfig.investmentTargets.map((target) => {
            return calculateMultipleInvestments(
                `/api/data?currency=${target.currency}`,
                new Date(investmentConfig.startDate),
                endDate,
                investmentConfig.frequencyConfig,
                (investmentConfig.investmentAmount * target.percentage) / 100
            )
        })

        Promise.all(promises)
            .then((dataArrays) => {
                const newInvestmentDataByCurrency: {[key: string]: InvestmentData[]} = {} // Create a new empty object
                dataArrays.forEach((data, index) => {
                    newInvestmentDataByCurrency[investmentConfig.investmentTargets[index].currency] = data
                })
                setInvestmentDataByCurrency(newInvestmentDataByCurrency)

                let currentTotalValue = 0
                let totalInvestment = 0
                Object.values(newInvestmentDataByCurrency).forEach((investmentData) => {
                    // Only take the last investment data
                    const lastInvestmentData = investmentData[investmentData.length - 1]
                    currentTotalValue += lastInvestmentData.currentTotalValue
                    totalInvestment += lastInvestmentData.totalInvestment
                })
                const currentProfit = currentTotalValue - totalInvestment
                const profitRate = currentProfit / totalInvestment
                console.log('investmentDataByCurrency', investmentDataByCurrency)
                console.log({currentTotalValue, totalInvestment, currentProfit, profitRate})
                setPortfolioStats({currentTotalValue, totalInvestment, currentProfit, profitRate})
                setIsLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setIsLoading(false)
            })
    }, [investmentConfig])

    return (
        <div>
            <h1>Chart</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <pre>{JSON.stringify(investmentConfig, null, 2)}</pre>
                    <pre>{JSON.stringify(investmentDataByCurrency, null, 2)}</pre>
                    <pre>{JSON.stringify(portfolioStats, null, 2)}</pre>
                </>
            )}
        </div>
    )
}
