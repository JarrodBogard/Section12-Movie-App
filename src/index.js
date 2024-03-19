import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
import StarRating from "./StarRating-v2";

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating color="orange" onSetRating={setMovieRating} />
      <p>This movie was rated {movieRating} stars.</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating maxRating={10} defaultValue={5} />
    <StarRating size={24} color="red" className="test" />
    <StarRating
      defaultValue={3}
      size={36}
      color="pink"
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <Test />
  </React.StrictMode>
);
