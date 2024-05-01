import React, {useState, useEffect} from 'react'
import {InvestmentConfig, InvestmentData, PortfolioStats} from '@/types/investment'
import {calculateMultipleInvestments} from '@/lib/calc'
import {PriceData} from '@/types/investment'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Scatter, ResponsiveContainer} from 'recharts'
import {endDate} from '@/lib/config'

type ChartData = PriceData & Partial<InvestmentData> & {isInvestment: boolean}

export const useInvestmentData = (investmentConfig: InvestmentConfig) => {
    const [investmentDataByCurrency, setInvestmentDataByCurrency] = useState<{[key: string]: {priceData: PriceData[]; investmentData: InvestmentData[]}}>({})
    const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({currentTotalValue: 0, totalInvestment: 0, currentProfit: 0, profitRate: 0, holdingCost: 0})
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
                const newInvestmentDataByCurrency: {[key: string]: {priceData: PriceData[]; investmentData: InvestmentData[]}} = {} // Create a new empty object
                dataArrays.forEach((data, index) => {
                    newInvestmentDataByCurrency[investmentConfig.investmentTargets[index].currency] = {
                        priceData: data.priceData,
                        investmentData: data.investmentData
                    }
                })

                let currentTotalValue = 0
                let totalInvestment = 0
                let holdingCost = 0
                Object.values(newInvestmentDataByCurrency).forEach((investmentData) => {
                    // Only take the last investment data
                    const lastInvestmentData = investmentData.investmentData[investmentData.investmentData.length - 1]
                    currentTotalValue += lastInvestmentData.currentTotalValue
                    totalInvestment += lastInvestmentData.totalInvestment
                    holdingCost += lastInvestmentData.holdingCost
                })
                const currentProfit = currentTotalValue - totalInvestment
                const profitRate = currentProfit / totalInvestment
                setPortfolioStats({currentTotalValue, totalInvestment, currentProfit, profitRate, holdingCost})
                setInvestmentDataByCurrency(newInvestmentDataByCurrency)
                setIsLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setIsLoading(false)
            })
    }, [investmentConfig])

    return {investmentDataByCurrency, portfolioStats, isLoading}
}

const CustomDot = (props) => {
    console.log('CustomDot props:', props)
    const {cx, cy, payload} = props

    if (payload.isInvestment) {
        return <circle cx={cx} cy={cy} r={6} stroke="red" strokeWidth={3} fill="red" />
    }

    return null
}

export const Chart: React.FC<{investmentConfig: InvestmentConfig}> = ({investmentConfig}) => {
    const {investmentDataByCurrency, portfolioStats, isLoading} = useInvestmentData(investmentConfig)

    let data: ChartData[] = []

    if (investmentDataByCurrency['BTC-USD']) {
        const priceData = investmentDataByCurrency['BTC-USD'].priceData
        const investmentData = investmentDataByCurrency['BTC-USD'].investmentData

        data = priceData.map((item) => ({
            ...item,
            isInvestment: false
        }))

        investmentData.forEach((item) => {
            const index = data.findIndex((d) => d.date === item.date)
            if (index !== -1) {
                data[index] = {
                    ...data[index],
                    ...item,
                    isInvestment: true
                }
            }
        })
    }

    return (
        <div>
            <h1>Chart</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {/* <pre>{JSON.stringify(investmentConfig, null, 2)}</pre> */}
                    {/* <pre>{JSON.stringify(investmentDataByCurrency, null, 2)}</pre> */}
                    {/* <pre>{JSON.stringify(portfolioStats, null, 2)}</pre> */}
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{r: 8}} />
                        <Scatter dataKey="isInvestment" />
                    </LineChart>
                </>
            )}
        </div>
    )
}
