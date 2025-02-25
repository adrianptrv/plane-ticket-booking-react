import { useState, useEffect, useRef } from "react";
import Form from "./Form.jsx";
import List from "./List.jsx";


import "../styles/App.scss";

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  
  // Here we hold the number which we will use in out GET bookings request. The initial value is 0 so we can get the first page of bookings when we load the page.
  // We create the variable + function here in "App.jsx", so we can use it's value in both other components - "Form.jsx" and "List.jsx"
  const [pageNum, setPageNum] = useState(0);

  // The variable which we will use for storing the airports fetch result
  const [airports, setAirports] = useState("");

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
    fetch(
      `https://interview.fio.de/core-frontend/api/airports?authToken=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAirports(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Fetch error:", error);
        alert(
          "There was an error with retrieving the information, please try again later."
        );
      });
  }, []);

  return (
    <>
      <Form
        airports={airports}
        changePageNum={changePageNum}
        changeSFetch={changeSFetch}
        apiKey={apiKey}
      />
      <List
        airports={airports}
        changePageNum={changePageNum}
        pageNum={pageNum}
        sFetch={sFetch}
        changeSFetch={changeSFetch}
        apiKey={apiKey}
      />
    </>
  );
}

export default App;
