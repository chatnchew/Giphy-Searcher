import { useState, useEffect } from "react";
import "./App.css";
import Gifs from "./components/Gifs";

function App() {
  // useState variable that will contain the gif object that is returned
  const [gifs, setGifs] = useState([]);
  // setGifs would be used in the fetch functions to update the gifs variable with the fetched information

  // useState variable that will contain the user's search term
  const [search, setSearch] = useState("");

  // useState variable that will take the user's search term and pass it to the fetch call
  const [searchFetch, setSearchFetch] = useState("");

  // useState variable that will be used to change the limit when a "load more" button is clicked
  const [limit, setLimit] = useState(25);
  // this is actually not needed - gifs should be limited to 25 as stated in requirements - but leaving it in for now to prevent further issues

  // useState variable that will be used to change the offset when a "load more" button is clicked
  const [offsetVal, setOffset] = useState(0);

  // function that takes setSearch function so the state can be updated with the user's search term
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // function that will set the new state variable so the search fetch will occur
  const handleSubmit = (event) => {
    // prevent default form behavior - will stop this function from bubbling up to parent elements and causing issues, as well as from refreshing the page
    event.preventDefault();
    // prevent searching with empty strings
    if (!search) return;
    // update search state variable with user's input, which will then run as a search term
    setSearchFetch(search);
  }

  // function that is passed setOffset function so the state can be updated with a new value - this will update the "offset" value required by the API upon user action
  const handleSetOffset = () => {
    setOffset(offsetVal + 25);
  };

  // defining variable for the API key for easier insertion
  let apiKey = "73H9V6lKlhDik4GLmoJG2CeTj9eTRuUS";

  // state variable that will have the initial fetch call run so gifs are always present on the page
  const [count, setCount] = useState(0);

  // function that will update the count every minute so the useEffect will run
  const handleSetCount = () => {
    // conditional that will immediately update the count so gifs load in
    if (count === 0) {
      setCount(1);
    }
  };

  // fetch call for trending gifs - this will run on load so the page is not empty
  useEffect(() => {
    fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}&offset=${offsetVal}&rating=g`,
      {
        method: "GET",
        // as query parameters:
        // utilizing the given API key
        // using state variables for limit and offset so they are updated when button is clicked
        // making sure these gifs are school appropriate!
      },
    )
      .then((response) => {
        // if there is a network error, display an error message
        if (!response.ok) {
          throw new Error(
            `Cannot connect because status is: ${response.status}`,
          );
        }

        // otherwise, return the response and parse it
        return response.json();
      })
      // parsing the json response into a usable js object
      .then((data) => setGifs(data.data))
      // saving the returned data (and drilling down to get the data array) to the gifs state variable
      // console.log("data is: ", data.data)
      // accessing url inside of returned object - data.data[<index number here>]['url']
      .catch((err) => console.error("Unable to fetch data, error is: ", err));

      handleSetCount();
  }, [count]);
  // state variable in the dependency so the gifs will load in automatically

  // console.log("gifs is: ", gifs);
    // updated the state variable to an array, as data.data is an array, not an object literal

  // fetch call for trending gifs that will load more when state variables are updated
  useEffect(() => {
    fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}&offset=${offsetVal}&rating=g`,
      {
        method: "GET",
      },
    )
      .then((response) => {
        // if there is a network error, display an error message
        if (!response.ok) {
          throw new Error(
            `Cannot connect because status is: ${response.status}`,
          );
        }

        // otherwise, return the response and parse it
        return response.json();
      })
      // parsing the json response into a usable js object
      .then((data) => setGifs(data.data))
      // saving the returned data (and drilling down to get the data array) to the gifs state variable
      .catch((err) => console.error("Unable to fetch data, error is: ", err));
  }, [offsetVal]);
  // will run if the limit or offsetVal variables are changed - ie each time the load more button is clicked

  // fetch call for search - this will call to the api and return gif images based on the search endpoint
  useEffect(() => {
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&limit=${limit}&rating=g&q=${search}`,
      {
        method: "GET",
        // as query parameters:
        // utilizing the given API key
        // implementing state variable here for the search
        // making sure these gifs are school appropriate!
      },
    )
      .then((response) => {
        // if there is a network error, display an error message
        if (!response.ok) {
          throw new Error(
            `Cannot connect because status is: ${response.status}`,
          );
        }

        // otherwise, return the response and parse it
        return response.json();
      })
      // parsing the json response into a usable js object
      .then((data) => setGifs(data.data))
      // saving the returned data (and drilling down to get the data array) to the gifs state variable
      .catch((err) => console.error("Unable to fetch data, error is: ", err));
  }, [searchFetch]);

  // fetch call that will return more gifs based on the user's search if the limit variable is changed - ie when the user clicks the load more button
  useEffect(() => {
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&offset=${offsetVal}&rating=g&q=${search}`,
      {
        method: "GET",
      },
    )
      .then((response) => {
        // if there is a network error, display an error message
        if (!response.ok) {
          throw new Error(
            `Cannot connect because status is: ${response.status}`,
          );
        }

        // otherwise, return the response and parse it
        return response.json();
      })
      // parsing the json response into a usable js object
      .then((data) => setGifs(data.data))
      // saving the returned data (and drilling down to get the data array) to the gifs state variable
      .catch((err) => console.error("Unable to fetch data, error is: ", err));
  }, [offsetVal]);

  // console.log("gifs is: ", gifs)

  return (
    <>
      <h1>Giphy Searcher!</h1>
      {/* search container to take user's search input */}
      <div className="searchContainer">
        {/* form to handle the submission associated with the search functionality - function will only run on change (ie submission) */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search for a gif..."
            onChange={handleSearch}
          />
          <button type="submit">Submit</button>
        </form>
        <button
          onClick={() => {
            // runs function that will update the offset, loading more gifs
            handleSetOffset();
          }}
        >
          Load More
        </button>
      </div>
      {/* child component that holds the gif images themselves */}
      <Gifs images={gifs} />
    </>
  );
};

export default App;
