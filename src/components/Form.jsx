import { useState } from 'react';
// Style
import '../styles/Form.scss';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';

function Form({
  SUPABASE_FLIGHTS_URL,
  SUPABASE_API_KEY,
  airports,
}) {
  // Form data variable
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    departure_airport: '',
    arrival_airport: '',
    departure_date: '',
    return_date: '',
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
  const [thanksM, setThanksM] = useState(false);

  // Prepare all of the airport option elements throught mapping the fetch result
  const writeAirports =
    airports &&
    airports.map((port) => (
      <option value={port.id} key={port.id}>
        {port.title}
      </option>
    ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Checks if there are any errors with the input fields
    const errorHolder = validateForm(formData);
    setErrors(errorHolder);

    // Coverting the input to JSON and sending it
    if (Object.keys(errorHolder).length === 0) {
      let holder = { ...formData };
      holder.departure_date = new Date(holder.departure_date).toISOString();
      holder.return_date = new Date(holder.return_date).toISOString();

      const res = await fetch(SUPABASE_FLIGHTS_URL, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
          'Content-Type': 'application/json',
          //   Prefer: "return=representation",
        },
        body: JSON.stringify(holder),
      });

      const errorText = await res.text();
      // Resets form values back to empty
      setFormData({
        first_name: '',
        last_name: '',
        departure_airport: '',
        arrival_airport: '',
        departure_date: '',
        return_date: '',
      });
      // Showing the thank you message
      setThanksM(true);

      setTimeout(() => {
        setThanksM(false);
      }, 3000);
    }
  };

  // Checks if all of the input values are valid
  const validateForm = (data) => {
    const errorsList = {};

    if (!data.first_name.trim()) {
      errorsList.first_name = 'Please enter first name';
    }

    if (/\d/.test(data.first_name)) {
      errorsList.first_name = 'First name cannot contain numbers';
    }

    if (!data.last_name.trim()) {
      errorsList.last_name = 'Please enter last name';
    }

    if (/\d/.test(data.last_name)) {
      errorsList.last_name = 'Last name cannot contain numbers';
    }

    if (data.departure_airport === data.arrival_airport) {
      errorsList.departure = 'Cannot fly to the same destination';
    }

    if (data.departure_airport == '' || data.arrival_airport == '') {
      errorsList.departure = 'Please select departure and arrival airport';
    }

    if (data.departure_date > data.return_date) {
      errorsList.dates = 'The departure date cannot be after the return date';
    }

    if (!data.departure_date.trim() || !data.return_date.trim()) {
      errorsList.dates = 'Please select dates';
    }

    return errorsList;
  };

  // Today date variable, which we use as a minimum in the departure date field
  var today = new Date().toISOString().slice(0, -8);

  return (
    <>
      <div className="formWrapper">
        <div className="formHeader">
          <i>
            <FontAwesomeIcon icon={faPenToSquare} />
          </i>
          <h2>Book your new adventure:</h2>
        </div>
        <form className="formEl" onSubmit={handleSubmit}>
          <div className="input-container">
            <label>First name</label>
            <input
              type="text"
              id="firstName"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            ></input>
            {/* Checking if there are any errors with the inputs. If there are, error element is displayed */}
            {errors.first_name && (
              <span className="error-message">
                <i>
                  <FontAwesomeIcon icon={faCircleExclamation} />
                </i>
                {errors.first_name}
              </span>
            )}
          </div>

          <div className="input-container">
            <label>Last name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            ></input>
            {errors.last_name && (
              <span className="error-message">
                <i>
                  <FontAwesomeIcon icon={faCircleExclamation} />
                </i>
                {errors.last_name}
              </span>
            )}
          </div>

          <div className="input-container select">
            <label>Departure airport</label>
            <select
              name="departure_airport"
              value={formData.departure_airport}
              onChange={handleChange}
            >
              {/* Adding the options, which we prepared in the writeAirports */}
              <option disabled label="Departure airport" />
              {writeAirports}
            </select>
          </div>

          <div className="input-container select">
            <label>Arrival airport</label>
            <select
              name="arrival_airport"
              value={formData.arrival_airport}
              onChange={handleChange}
            >
              <option disabled label="Arrival airport" />
              {writeAirports}
            </select>
            {errors.departure && (
              <span className="error-message">
                <i>
                  <FontAwesomeIcon icon={faCircleExclamation} />
                </i>
                {errors.departure}
              </span>
            )}
          </div>

          <div className="input-container">
            <label>Departure date</label>
            <input
              type="datetime-local"
              name="departure_date"
              min={today}
              value={formData.departure_date}
              onChange={handleChange}
            ></input>
          </div>

          <div className="input-container">
            <label>Return date</label>
            <input
              type="datetime-local"
              name="return_date"
              min={today}
              value={formData.return_date}
              onChange={handleChange}
            ></input>
            {errors.dates && (
              <span className="error-message">
                <i>
                  <FontAwesomeIcon icon={faCircleExclamation} />
                </i>
                {errors.dates}
              </span>
            )}
          </div>

          <div className="btnHolder">
            <button type="submit">Submit</button>
          </div>
        </form>
        {/* Thank you message */}
        {thanksM && (
          <div className="thanks">
            <h1>Thank you</h1>
            <p>
              Your flight was booked successfully and can be seen in the
              bookings list. You can always cancel it.
            </p>
            <h2>Safe travels!</h2>
          </div>
        )}
      </div>
    </>
  );
}

export default Form;
