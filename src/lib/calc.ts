import {FrequencyConfig, PriceDataResult, PriceData, InvestmentData} from '@/types/investment'
import Papa from 'papaparse'
function calculateInvestmentData(priceData: PriceData[], investmentAmount: number): InvestmentData[] {
    console.log('priceData:', priceData, 'investmentAmount:', investmentAmount)
    const results: InvestmentData[] = []
    let totalInvestment = 0
    let totalShares = 0

    for (const data of priceData) {
        totalInvestment += investmentAmount
        totalShares += investmentAmount / data.close

        const date = data.date
        const currentTotalValue = totalShares * data.close
        const currentProfit = currentTotalValue - totalInvestment
        const profitRate = currentProfit / totalInvestment
        const holdingCost = totalInvestment / totalShares

        results.push({
            date,
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
    console.log('csvFilePath:', csvFilePath, 'startDate:', startDate, 'endDate:', endDate, 'frequencyConfig:', frequencyConfig)
    return fetch(csvFilePath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.text()
        })
        .then((csvData) => {
            csvData = csvData.trim()
            console.log('csvData:', csvData)
            return new Promise<PriceDataResult>((resolve, reject) => {
                // Specify the return type as Promise<PriceDataResult>
                Papa.parse(csvData, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results) => {
                        if (results.errors.length > 0) {
                            console.error('Papa parse errors:', results.errors)
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

                        console.log('priceData:', priceData)

                        const filteredPriceData: PriceData[] = []

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

                        console.log('filteredPriceData:', filteredPriceData)

                        resolve({
                            allData: priceData,
                            filteredData: filteredPriceData
                        })
                    },
                    error: (err) => {
                        console.error('Papa parse error:', err)
                        reject(err)
                    }
                })
            })
        })
        .catch((err) => {
            console.error('Error in readPriceData:', err)
            throw err
        })
}

export function calculateMultipleInvestments(
    csvFilePath: string,
    startDate: Date,
    endDate: Date,
    frequencyConfig: FrequencyConfig,
    investmentAmount: number
): Promise<{priceData: PriceData[]; investmentData: InvestmentData[]}> {
    return readPriceData(csvFilePath, startDate, endDate, frequencyConfig).then((priceDataResult) => {
        const investmentData = calculateInvestmentData(priceDataResult.filteredData, investmentAmount)
        return {
            priceData: priceDataResult.filteredData,
            investmentData
        }
    })
}
