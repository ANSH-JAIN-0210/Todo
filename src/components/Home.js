import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="navbar">
        <h1>To-Do</h1>
        <div className="button-group">
          <Link to="/signin">
            <button>Sign-In</button>
          </Link>
          <Link to="/signup">
            <button>Sign-Up</button>
          </Link>
        </div>
      </div>
      <div className="hero">
        <div className="hero-text">
          <h2>Boost Your Productivity</h2>
          <p>Focus on Being Productive Instead of Busy</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
