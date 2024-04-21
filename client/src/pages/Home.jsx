import React, { useState } from "react";
import logo from "/assets/x-twitter.svg";
import ParticleSystem from "../components/ParticleSystem";
import Login from "../components/Login";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  const toggleLoginModal = () => setShowLogin(!showLogin);

  return (
    <>
      <div className="intro-wrapper">
        <div className="intro">
          <div>
            <img src={logo} alt="" height={50} />
            <h2>Evolutions</h2>
          </div>
          <h1 style={{ fontFamily: "TwitterChirpExtendedHeavy", fontSize: "50px" }}>
            Seek <br /> Self-Discovery
          </h1>
          <button onClick={toggleLoginModal}>
            <div>
              <span className="sign-text">Sign In</span>
            </div>
          </button>
          {showLogin && <Login />}
        </div>
      </div>
      <ParticleSystem />
    </>
  );
};

export default Home;
