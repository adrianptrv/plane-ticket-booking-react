import { useState, useEffect, useRef } from 'react';
import Form from './Form.jsx';
import List from './List.jsx';

import '../styles/App.scss';

function App() {
  const SUPABASE_AIRPORTS_URL = import.meta.env.VITE_SUPABASE_AIRPORTS_URL;
  const SUPABASE_FLIGHTS_URL = import.meta.env.VITE_SUPABASE_FLIGHTS_URL;
  const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

  // The variable which we will use for storing the airports fetch result
  const [airports, setAirports] = useState('');

  const sFetch = useRef(false);

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
