import { useState, useEffect } from "react";
import "./App.css";
import Gifs from "./components/Gifs";

const API_KEY = "73H9V6lKlhDik4GLmoJG2CeTj9eTRuUS";
const PAGE_SIZE = 25;

function App() {
  // useState variable that will contain the gif object that is returned
  const [gifs, setGifs] = useState([]);
  // setGifs would be used in the fetch functions to update the gifs variable with the fetched information

  // useState variable that will contain the user's search term
  const [search, setSearch] = useState("");

  // useState variable that will take the user's search term and pass it to the fetch call
  const [searchFetch, setSearchFetch] = useState("");

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
    const trimmedSearch = search.trim();
    // prevent searching with empty strings
    if (!trimmedSearch) return;
    setOffset(0);
    // update search state variable with user's input, which will then run as a search term
    setSearchFetch(trimmedSearch);
  };

  // function that is passed setOffset function so the state can be updated with a new value - this will update the "offset" value required by the API upon user action
  const handleSetOffset = () => {
    setOffset((currentOffset) => currentOffset + PAGE_SIZE);
  };

  // useEffect that controls the fetch for image search
  useEffect(() => {
    const endpoint = searchFetch
      ? "https://api.giphy.com/v1/gifs/search"
      : "https://api.giphy.com/v1/gifs/trending";

    const params = new URLSearchParams({
      api_key: API_KEY,
      limit: String(PAGE_SIZE),
      offset: String(offsetVal),
      rating: "g",
    });

    if (searchFetch) {
      params.set("q", searchFetch);
    }

    const fetchGifs = async () => {
      try {
        const response = await fetch(`${endpoint}?${params.toString()}`);

        if (!response.ok) {
          throw new Error(
            `Cannot connect because status is: ${response.status}`,
          );
        }

        const data = await response.json();
        setGifs(data.data);
      } catch (err) {
        console.error("Unable to fetch data, error is: ", err);
      }
    };

    fetchGifs();
  }, [offsetVal, searchFetch]);

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
}

export default App;
