import React from "react";
import "./Gifs.css";

const Gifs = (props) => {
  const { images } = props;
  // console.log("images is: ", images)
  // console.log("data type is: ", typeof images)
    // receiving the array of gif object information
  // destructuring the props to grab the object that has the gif information

  // making a function that will map over the urls that are returned via props and insert them into image elements
  const gifsReturned = images.map(
    (gifObj) => {
    return (
      <img src={gifObj.images.original.url} className="gifImage" key={gifObj.id} />
    );
  }
  );

  return (
    <>
    {/* inserting the created image elements as JSX so they will render */}
      <div className="gifsContainer">
        {gifsReturned}
        </div>
    </>
  );
};

export default Gifs;
