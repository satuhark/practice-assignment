import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DatePicking = ({ selectedDate, setSelectedDate }) => {
    const handleDateChange = (date) => {
        setSelectedDate(date)
    }
    return (
      <DatePicker 
      className="react-datepicker"
      todayButton="Today"
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy"
      minDate={new Date()}
      placeholderText="Select deadline"
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      utcOffset={new Date().getTimezoneOffset()}
      onKeyDown={(e) => {
        e.preventDefault()
    }}
    />
)
}

DatePicking.propTypes = {
    selectedDate: PropTypes.instanceOf(Date),
    setSelectedDate: PropTypes.func.isRequired
}

export default DatePicking
