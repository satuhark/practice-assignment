import { useState } from "react"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DatePicking = () => {
    const [startDate, setStartDate] = useState(new Date())
    return (
        <DatePicker
        showIcon
        toggleCalendarOnIconClick
        selected={startDate}
        onChange={(date) => setStartDate(date)}
    />
    )
}

export default DatePicking