import { useState } from "react"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DatePicking = () => {
    const [startDate, setStartDate] = useState(null);
    return (
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        minDate={(new Date())}
        placeholderText="Select deadline"
      />
    )
  }

export default DatePicking