import React from "react";

const About = () => {
    return (
        <div className="About">
            <h1 className="title">About</h1>
            <p>Hey, I am Stevon Wright, the developer of this web app. I wrote this for fun, to improve my programming skills, and as a final project for Physics class. My goal was to make a cool simulation to show how planets move in orbit and how it relates to a planet's mass and distance from another object</p>
            <h2>The Math</h2>
            <h3>Kepler's laws of planetary motion</h3>
            <h3>Newton's law of gravitation</h3>
            <p>Equation: F = G(m<sub>1</sub>m<sub>2</sub>)/R<sup>2</sup></p>
            <h2>Accuracy</h2>
            <p>As said <a href="https://www.britannica.com/science/Keplers-laws-of-planetary-motion" target="_blank" rel="noopener noreferrer">here</a>, Kepler's laws of planetary motion do not "take into account the gravitational interactions (as perturbing effects) of the various planets on each other." This is simply the easiest way to approximate planetary or satellite motion, as Kepler's laws are also useful for approximating "motions of natural and artificial satellites, as well as to stellar systems and extrasolar planets".</p>
            <h2>Credits</h2>
            <p>Obviously, I programmed this myself. However, I did use various sources to learn the math and get inspiration. Here they are:</p>
        </div>
    );
};

export default About;