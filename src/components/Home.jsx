import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="Home">
      <h1 className="title">Home</h1>
      <div className="Home__container">
        <p className="intro">
          Simulate the motion of celestial bodies in our universe! Interact with
          the simulation, and see how your changes affect the results!
        </p>
        <a className="button" href="/simulation">
          Enter Simulation
        </a>
      </div>
    </div>
  );
};

export default Home;
