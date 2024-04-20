import {FrequencyConfig, PriceDataResult, PriceData, InvestmentData} from '@/types/investment'
import Papa from 'papaparse'

function calculateInvestmentData(priceData: PriceData[], investmentAmount: number): InvestmentData[] {
    const results: InvestmentData[] = []
    let totalInvestment = 0
    let totalShares = 0

    for (const data of priceData) {
        totalInvestment += investmentAmount
        totalShares += investmentAmount / data.close

        const currentTotalValue = totalShares * data.close
        const currentProfit = currentTotalValue - totalInvestment
        const profitRate = currentProfit / totalInvestment
        const holdingCost = totalInvestment / totalShares

        results.push({
            currentTotalValue,
            totalInvestment,
            currentProfit,
            profitRate,
            holdingCost
        })
    }

    return results
}

function readPriceData(csvFilePath: string, startDate: Date, endDate: Date, frequencyConfig: FrequencyConfig): Promise<PriceDataResult> {
    return new Promise((resolve, reject) => {
        Papa.parse(csvFilePath, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    reject(results.errors)
                    return
                }

                const priceData: PriceData[] = results.data
                    .map((row: any) => ({
                        date: new Date(row.Date),
                        close: row.Close
                    }))
                    .filter((data: PriceData) => data.date >= startDate && data.date <= endDate)
                    .sort((a: PriceData, b: PriceData) => a.date.getTime() - b.date.getTime())

                const filteredPriceData: PriceData[] = []

                // Calculate the initial investment date based on the frequency and the specific day
                let nextInvestmentDate = new Date(startDate)
                if (frequencyConfig.frequency === 'weekly' && frequencyConfig.dayOfWeek) {
                    while (nextInvestmentDate.getDay() !== frequencyConfig.dayOfWeek) {
                        nextInvestmentDate.setDate(nextInvestmentDate.getDate() + 1)
                    }
                } else if (frequencyConfig.frequency === 'monthly' && frequencyConfig.dayOfMonth) {
                    nextInvestmentDate.setDate(frequencyConfig.dayOfMonth)
                }

                for (const data of priceData) {
                    if (data.date < nextInvestmentDate) {
                        continue
                    }

                    filteredPriceData.push(data)

                    // Calculate the next investment date
                    switch (frequencyConfig.frequency) {
                        case 'daily':
                            nextInvestmentDate.setDate(nextInvestmentDate.getDate() + 1)
                            break
                        case 'weekly':
                            nextInvestmentDate.setDate(nextInvestmentDate.getDate() + 7)
                            break
                        case 'monthly':
                            nextInvestmentDate.setMonth(nextInvestmentDate.getMonth() + 1)
                            break
                    }
                }

                resolve({
                    allData: priceData,
                    filteredData: filteredPriceData
                })
            }
        })
    })
}

export function calculateMultipleInvestments(
    csvFilePath: string,
    startDate: Date,
    endDate: Date,
    frequencyConfig: FrequencyConfig,
    investmentAmount: number
): Promise<InvestmentData[]> {
    return readPriceData(csvFilePath, startDate, endDate, frequencyConfig).then((priceDataResult) => {
        return calculateInvestmentData(priceDataResult.filteredData, investmentAmount)
    })
}