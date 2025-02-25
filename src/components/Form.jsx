import { useState } from 'react'
// Style
import '../styles/Form.scss'
// Icons 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

function Form({ airports, changePageNum, changeSFetch, apiKey }) {

  // Form data variable
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    departureAirportId: '',
    arrivalAirportId: '',
    departureDate: '',
    returnDate: ''
  });

  // Variable for storing errors with the input fields.
  const [errors, setErrors] = useState({});

  // Function for setting the form input values to the input variable 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Thank you message
  const [thanksM, setThanksM] = useState(false)

  // Prepare all of the airport option elements throught mapping the fetch result
  const writeAirports = airports && airports.map((port) => <option value={port.id} key={port.id}>{port.title}</option>)

  const handleSubmit = (e) => {
    e.preventDefault();
    // Checks if there are any errors with the input fields
    const errorHolder = validateForm(formData);
    setErrors(errorHolder)

    // Coverting the input to JSON and sending it 
    if (Object.keys(errorHolder).length === 0) {
      let holder = { ...formData };
      holder.departureDate = new Date(holder.departureDate).toISOString();
      holder.returnDate = new Date(holder.returnDate).toISOString();
      fetch(`https://interview.fio.de/core-frontend/api/bookings/create?authToken=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(holder)
      })
      changePageNum(0)
      changeSFetch(true)
      // Resets form values back to empty
      setFormData({
        firstName: '',
        lastName: '',
        departureAirportId: '',
        arrivalAirportId: '',
        departureDate: '',
        returnDate: ''
      })
      // Showing the thank you message
      setThanksM(true)

      setTimeout(() => {
        setThanksM(false);
      }, 3000);
    }
  }

  // Checks if all of the input values are valid
  const validateForm = (data) => {
    const errorsList = {};

    if (!data.firstName.trim()) {
      errorsList.firstName = 'Please enter first name';
    }

    if (/\d/.test(data.firstName)) {
      errorsList.firstName = 'First name cannot contain numbers';
    }

    if (!data.lastName.trim()) {
      errorsList.lastName = 'Please enter last name';
    }

    if (/\d/.test(data.lastName)) {
      errorsList.lastName = 'Last name cannot contain numbers';
    }

    if (data.departureAirportId === data.arrivalAirportId) {
      errorsList.departure = 'Cannot fly to the same destination';
    }

    if (data.departureAirportId == '' || data.arrivalAirportId == '') {
      errorsList.departure = "Please select departure and arrival airport"
    }

    if (data.departureDate > data.returnDate) {
      errorsList.dates = "The departure date cannot be after the return date"
    }

    if (!data.departureDate.trim() || !data.returnDate.trim()) {
      errorsList.dates = "Please select dates"
    }

    return errorsList
  };

  // Today date variable, which we use as a minimum in the departure date field
  var today = new Date().toISOString().slice(0, -8)

  return (
    <>
      <div className='formWrapper'>
        <div className='formHeader'>
          <i><FontAwesomeIcon icon={faPenToSquare} /></i><h2>Book your new adventure:</h2>
        </div>
        <form className="formEl" onSubmit={handleSubmit}>
          <div className='input-container'>
            <label>First name</label>
            <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange}></input>
            {/* Checking if there are any errors with the inputs. If there are, error element is displayed */}
            {errors.firstName && (<span className="error-message"><i><FontAwesomeIcon icon={faCircleExclamation} /></i>{errors.firstName}</span>)}
          </div>


          <div className='input-container'>
            <label>Last name</label>
            <input type='text' name='lastName' value={formData.lastName} onChange={handleChange}></input>
            {errors.lastName && (<span className="error-message"><i><FontAwesomeIcon icon={faCircleExclamation} /></i>{errors.lastName}</span>)}
          </div>


          <div className='input-container select'>
            <label>Departure airport</label>
            <select name='departureAirportId' value={formData.departureAirportId} onChange={handleChange}>
              {/* Adding the options, which we prepared in the writeAirports */}
              <option disabled label='Departure airport' />
              {writeAirports}
            </select>
          </div>

          <div className='input-container select'>
            <label>Arrival airport</label>
            <select name='arrivalAirportId' value={formData.arrivalAirportId} onChange={handleChange}>
              <option disabled label='Arrival airport' />
              {writeAirports}
            </select>
            {errors.departure && (<span className="error-message"><i><FontAwesomeIcon icon={faCircleExclamation} /></i>{errors.departure}</span>)}
          </div>


          <div className='input-container'>
            <label>Departure date</label>
            <input type='datetime-local' name='departureDate' min={today} value={formData.departureDate} onChange={handleChange}></input>
          </div>

          <div className='input-container'>
            <label>Arrival date</label>
            <input type='datetime-local' name='returnDate' min={today} value={formData.returnDate} onChange={handleChange}></input>
            {errors.dates && (<span className="error-message"><i><FontAwesomeIcon icon={faCircleExclamation} /></i>{errors.dates}</span>)}
          </div>


          <div className='btnHolder'>
            <button type='submit'>Submit</button>
          </div>
        </form>
        {/* Thank you message */}
        {thanksM && <div className='thanks'>
          <h1>Thank you</h1>
          <p>Your flight was booked successfully and can be seen in the bookings list. You can always cancel it.</p>
          <h2>Safe travels!</h2>
        </div>}
      </div>
    </>
  )
}

export default Form
