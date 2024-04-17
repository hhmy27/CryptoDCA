import React from 'react'
import {Select, Input, Button, Text, Note} from '@geist-ui/react'
import {FrequencySelectorProps} from '@/types/investment'

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({frequency, dayOfWeek, dayOfMonth, onFrequencyChange, onDayOfWeekChange, onDayOfMonthChange}) => {
    return (
        <div>
            <Select value={frequency} onChange={(value) => onFrequencyChange(value.toString())}>
                <Select.Option value="Daily">Daily</Select.Option>
                <Select.Option value="Weekly">Weekly</Select.Option>
                <Select.Option value="Monthly">Monthly</Select.Option>
            </Select>
            {frequency === 'Weekly' && (
                <Select value={dayOfWeek} onChange={(value) => onDayOfWeekChange(value.toString())}>
                    <Select.Option value="Monday">Monday</Select.Option>
                    <Select.Option value="Tuesday">Tuesday</Select.Option>
                    <Select.Option value="Wednesday">Wednesday</Select.Option>
                    <Select.Option value="Thursday">Thursday</Select.Option>
                    <Select.Option value="Friday">Friday</Select.Option>
                    <Select.Option value="Saturday">Saturday</Select.Option>
                    <Select.Option value="Sunday">Sunday</Select.Option>
                </Select>
            )}
            {frequency === 'Monthly' && (
                <Select value={dayOfMonth?.toString()} onChange={(value) => onDayOfMonthChange(Number(value))}>
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
