import React from 'react'
import {InvestmentForm} from '@/ui/InvestmentForm'
import {NextUIProvider} from '@nextui-org/react'

const Home = () => {
    return (
        <NextUIProvider>
            <InvestmentForm />
        </NextUIProvider>
    )
}

export default Home
