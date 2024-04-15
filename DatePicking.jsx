import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import PropTypes from 'prop-types'

const DatePicking = ({ value, onChange, placeholder }) => {

    return (
        <DatePicker
            selected={value}
            onChange={date => onChange(date)}
            placeholderText={placeholder}
            dateFormat="dd-MM-yyyy"
        />
    )
}

DatePicking.propTypes = {
    value: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
}

export default DatePicking