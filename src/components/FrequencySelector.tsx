import React from 'react'
import {Select, Input, Button, Text, Note} from '@geist-ui/react'
import {FrequencySelectorProps} from '@/types/investment'

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({frequencyConfig, onFrequencyConfigChange}) => {
    const handleFrequencyChange = (value: string) => {
        onFrequencyConfigChange({...frequencyConfig, frequency: value as 'daily' | 'weekly' | 'monthly'})
    }

    const handleDayOfWeekChange = (value: number) => {
        onFrequencyConfigChange({...frequencyConfig, dayOfWeek: value})
    }

    const handleDayOfMonthChange = (value: number) => {
        onFrequencyConfigChange({...frequencyConfig, dayOfMonth: value})
    }

    return (
        <div>
            <Select value={frequencyConfig.frequency} onChange={handleFrequencyChange}>
                <Select.Option value="daily">Daily</Select.Option>
                <Select.Option value="weekly">Weekly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
            </Select>
            {frequencyConfig.frequency === 'weekly' && (
                <Select value={frequencyConfig.dayOfWeek?.toString()} onChange={(value) => handleDayOfWeekChange(Number(value))}>
                    {Array.from({length: 7}, (_, i) => (
                        <Select.Option key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                        </Select.Option>
                    ))}
                </Select>
            )}
            {frequencyConfig.frequency === 'monthly' && (
                <Select value={frequencyConfig.dayOfMonth?.toString()} onChange={(value) => handleDayOfMonthChange(Number(value))}>
                    {Array.from({length: 31}, (_, i) => (
                        <Select.Option key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                        </Select.Option>
                    ))}
                </Select>
            )}
        </div>
    )
}
