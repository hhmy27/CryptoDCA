import React from 'react'
import {InvestmentForm} from '@/components/InvestmentForm'
import {NextUIProvider} from '@nextui-org/react'
import {InvestmentDashboard} from '@/components/Dashboard'

const Home = () => {
    return (
        <NextUIProvider>
            <InvestmentDashboard />
        </NextUIProvider>
    )
}

export default Home
