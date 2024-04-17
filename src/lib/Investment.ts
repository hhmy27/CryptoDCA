import * as yup from 'yup'
import {createContext, useState} from 'react'

type InvestmentConfig = {
    cryptocurrencies: {name: string; ratio: number}[]
    frequency: 'daily' | 'weekly' | 'monthly'
    amount: number
    changes: {date: Date; amount: number}[]
}

const InvestmentConfigContext = createContext<
    | {
          config: InvestmentConfig
          setConfig: (config: InvestmentConfig) => void
      }
    | undefined
>(undefined)

const investmentConfigSchema = yup.object().shape({
    cryptocurrencies: yup
        .array()
        .of(
            yup.object().shape({
                name: yup.string().required(),
                ratio: yup.number().required().min(0).max(1)
            })
        )
        .required()
        .test('is-total-1', 'The total ratio should be 1', (value) => {
            const total = value.reduce((acc, cur) => acc + cur.ratio, 0)
            return total === 1
        }),
    frequency: yup.string().oneOf(['daily', 'weekly', 'monthly']).required(),
    amount: yup.number().required().positive(),
    changes: yup
        .array()
        .of(
            yup.object().shape({
                date: yup.date().required(),
                amount: yup.number().required().positive()
            })
        )
        .optional()
})
