import { useState, useEffect, useRef } from "react";
// Styles
import "../styles/List.scss";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture, faTrash } from "@fortawesome/free-solid-svg-icons";

function Lists({ airports, changePageNum, pageNum, sFetch, apiKey }) {

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const [page, setPage] = useState(0); // Start page from 1 (not 0) to align with API paging

  const containerRef = useRef(null); // Reference to the container element
  const initialFetchDone = useRef(false); // Flag to track if the initial fetch has been done

  // Fetch data from the API
  const fetchData = async (pageNum) => {
    if (loading || !hasMore) return; // Prevent fetching if already loading or no more data

    setLoading(true);
    try {
      const response = await fetch(
        `https://interview.fio.de/core-frontend/api/bookings?pageIndex=${pageNum}&authToken=${apiKey}`
      );
      const result = await response.json();

      if (result.list.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setLists((prevData) => [...prevData, ...result.list]);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if the user has scrolled to the bottom of the container
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      // Check if we are near the bottom of the container
      const nearBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;
      if (nearBottom && !loading && hasMore) {
        changePageNum(pageNum + 1); // Increment the page when scrolled to the bottom
      }
    }
  };

  // Fetch data when the page value changes (only for page > 0)
  useEffect(() => {
    if (pageNum > 0) {
      fetchData(pageNum); // Fetch data for the new page when user scrolls to bottom
    }
  }, [pageNum]); // Trigger this effect when the page changes

  // Fetch the initial data only once when the component mounts
  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchData(0); // Fetch data for the first page on initial mount
      initialFetchDone.current = true; // Mark the initial fetch as done
    }
  }, [initialFetchDone.current]); // Empty dependency array ensures this effect runs only once on mount

  // Attach scroll event listener to the container
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll); // Attach scroll event listener
    }
    return () => {
      const container = containerRef.current;
      if (container) {
        container.removeEventListener("scroll", handleScroll); // Cleanup scroll event listener
      }
    };
  }, [loading, hasMore]); // Reattach listener when loading or hasMore changes

  // Function for checking the airport array for specific id, and returning it's title (We call this function when we visualise the airports information - lines 103,104)
  const checkAirport = (num) => {
    if (airports) {
      var portIndex = airports.findIndex((port) => {
        return port.id === num;
      });
      return airports[portIndex].title;
    }
  };

  // Delete booking function
  const handleRemove = async (id) => {
    await fetch(
      `https://interview.fio.de/core-frontend/api/bookings/delete/${id}?authToken=${apiKey}`,
      { method: "DELETE" }
    );
    setLists([]); // Reset the data
    setHasMore(true); // Reset the 'hasMore' flag
    changePageNum(0);
    initialFetchDone.current = false;
  };

  // Resets the fetching of bookings, everytime a new booking is added. sFetch is located in App.jsx and it's value is changed when the form submit button is clicked
  useEffect(() => {
    if (sFetch.current) {
      setLists([]); // Reset the data
      setHasMore(true); // Reset the 'hasMore' flag
      changePageNum(0);
      initialFetchDone.current = false;
    }
  }, [sFetch.current]);

  return (
    <>
      <div className="listWrapper">
        <div className="listHeader">
          <i>
            <FontAwesomeIcon icon={faPlaneDeparture} />
          </i>
          <h2>Bookings:</h2>
        </div>
        <div className="listEl" ref={containerRef}>
          <table>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Departure airport</th>
              <th>Arrival airport</th>
              <th>Departure date</th>
              <th>Arrival date</th>
              <th></th>
            </tr>

            {/*We map throught all of the fetched records and create table row for each one*/}
            {lists &&
              lists.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.firstName}</td>
                  <td>{entry.lastName}</td>
                  <td>{checkAirport(entry.departureAirportId)}</td>
                  <td>{checkAirport(entry.arrivalAirportId)}</td>
                  <td>{entry.departureDate.substring(0, 10)}</td>
                  <td>{entry.returnDate.substring(0, 10)}</td>
                  <td>
                    <i onClick={() => handleRemove(entry.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </i>
                  </td>
                </tr>
              ))}
          </table>
          {/* Here we check if the button content was sent to empty from line 25, and don't show it  */}
          <div className="btnWrapper">
            {loading && <p>Loading...</p>}
            {!hasMore && <p>No more data</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Lists;
