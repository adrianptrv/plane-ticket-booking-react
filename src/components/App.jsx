import { useState, useEffect, useRef } from 'react';
import Form from './Form.jsx';
import List from './List.jsx';

import '../styles/App.scss';

function App() {
  const SUPABASE_AIRPORTS_URL = import.meta.env.SUPABASE_AIRPORTS_URL;
  const SUPABASE_FLIGHTS_URL = import.meta.env.SUPABASE_FLIGHTS_URL;
  const SUPABASE_API_KEY = import.meta.env.SUPABASE_API_KEY;

  // Here we hold the number which we will use in out GET bookings request. The initial value is 0 so we can get the first page of bookings when we load the page.
  // We create the variable + function here in "App.jsx", so we can use it's value in both other components - "Form.jsx" and "List.jsx"
  const [pageNum, setPageNum] = useState(0);

  // The variable which we will use for storing the airports fetch result
  const [airports, setAirports] = useState('');

  const sFetch = useRef(false);

  // Change page number function
  const changePageNum = (num) => {
    setPageNum(num);
  };

  // Change the trigger for resetting the bookings fetch
  const changeSFetch = (sta) => {
    sFetch.current = sta;
    console.log(sFetch);
  };

  // Fetching the airports information from the API
  useEffect(() => {
    fetch(`${SUPABASE_AIRPORTS_URL}`, {
      headers: {
        apikey: SUPABASE_API_KEY,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAirports(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
        alert(
          'There was an error with retrieving the information, please try again later.',
        );
      });
  }, []);

  return (
    <>
      <Form
        SUPABASE_FLIGHTS_URL={SUPABASE_FLIGHTS_URL}
        SUPABASE_API_KEY={SUPABASE_API_KEY}
        airports={airports}
        changePageNum={changePageNum}
        changeSFetch={changeSFetch}
      />
      <List
        SUPABASE_FLIGHTS_URL={SUPABASE_FLIGHTS_URL}
        SUPABASE_API_KEY={SUPABASE_API_KEY}
        airports={airports}
        changePageNum={changePageNum}
        pageNum={pageNum}
        sFetch={sFetch}
        changeSFetch={changeSFetch}
      />
    </>
  );
}

export default App;
