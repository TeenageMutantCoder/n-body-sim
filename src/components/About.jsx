import React from "react";
import "./About.css";

const About = () => {
    return (
        <div className="About">
            <h1 className="title">About</h1>
            <p>Hey, I am Stevon Wright, the developer of this web app. I wrote this for fun, to improve my programming skills, and as a final project for Physics class. My goal was to make a cool simulation to show how planets move in orbit and how it relates to a planet's mass and distance from another object</p>
            <p>Here is the GitHub repository with my code: <a href="https://github.com/TeenageMutantCoder/planetary-motion-sim" target="_blank" rel="noopener noreferrer">https://github.com/TeenageMutantCoder/planetary-motion-sim</a></p>
            <p>Also, if you want to see other projects made by me, you can head over to my website at <a href="https://stevon-wright.netlify.app" target="_blank" rel="noopener noreferrer">https://stevon-wright.netlify.app</a></p>
            <h2>The Math</h2>
            <h3>Kepler's laws of planetary motion</h3>
            <p>The first place I was directed to were Kepler's laws of planetary motion. There are 3, but I did not directly use these. I did not understand it well enough, and I did not think that these laws would get me the result I wanted. Instead, I used Newton's improvement on Kepler's model, which I discovered while researching Kepler's laws.</p>
            <h3>Newton's law of gravitation</h3>
            <p>
                Newton's laws of gravitation are:
                <ul>
                    <li>All bodies in the Solar System attract one another.</li>
                    <li>The force between two bodies is in direct proportion to the product of their masses and in inverse proportion to the square of the distance between them.</li>
                </ul>
            </p>
            <p>
                According to Wikipedia, "As the planets have small masses compared to that of the Sun, the orbits conform approximately to Kepler's laws. Newton's model improves upon Kepler's model, and fits actual observations more accurately." In other words, Kepler's laws only take into account the planet's interactions with a much larger body of mass, like a star, while Newton's laws can really apply to anything. Therefore, if F represents the gravitational force, G is the universal gravitational constant (6.674×10<sup>−11</sup> m<sup>3</sup>⋅kg<sup>−1</sup>⋅s<sup>−2</sup>), R is the distance between the two objects, and m is each object's mass, the equation for the gravitational force between two objects is:
                <br />
                <span className="equation">F = G(m<sub>1</sub>m<sub>2</sub>)/R<sup>2</sup></span>
                <br />
                However, I did not care very much about the force between the two objects because to determine how the objects move, I needed to know the acceleration and calculate the change in velocity and position from there. Since F = ma, the equation for the acceleration due to gravity would then be:
                <br />
                <span className="equation">a = G(m<sub>2</sub>)/R<sup>2</sup></span>
                <br />
                Thankfully, in Physics class, I was taught equations to make it easy to derive the velocity and position from the information that I have. Where d is displacement, v is velocity, a is acceleration, and t is time:
                <ul>
                    <li className="equation">v<sub>final</sub> = v<sub>initial</sub> + at</li>
                    <li className="equation">d = v<sub>initial</sub> t + &frac12; at<sup>2</sup></li>
                </ul>
            </p>
            
            <h3>N-Body Simulation</h3>
            <p>With the equations above, I was able to get a working simulation... until the distance between the objects approached zero. Basically, what would happen is that the "celestial bodies" would go inside each other until they were almost in the same place. When that happens, the gravitational force goes to infinity and the "celestial bodies" shoot away from each other. I did research to find the solution, and found that my simulation was actually called an N-body simulation. One technique used is called softening, which slightly changes the number used for distance so that it never will equal 0. The equation for this is</p>
            <h2>Accuracy</h2>
            <p>This is only an approximated simulation, and I make a few assumptions here and there. For example, instead of calculating the velocity normally every frame, I multiply it by a timestep in order to speed up the process. Also, in order to fix a problem caused by the "celestial bodies" going inside each other, I added perfectly elastic collisions. These collisions do not actually exist in real life, but they made my job easier programming the simulationa and getting it to work properly. The formula is not important but can be found in one of the links in the credits below. This simulation is only an approximation and should not be considered to be exactly accurate.</p>
            <h2>Credits</h2>
            <p>
                Obviously, I programmed this myself. However, I did use various sources to learn the math and get inspiration. Here they are:
                <ul>
                    <li>When I was confused on how to apply the equations, I looked at this interpretation of the simulation: <a href="https://github.com/DennisChunikhin/Orbit-Lab" rel="noopener noreferrer" target="_blank">https://github.com/DennisChunikhin/Orbit-Lab</a></li>
                    <li>If you want a more detailed explanation, this is a great article by someone who did a more in-depth simulation of the solar system using similar math: <a href="https://compphys.go.ro/newtonian-gravity/" rel="noopener noreferrer" target="_blank">https://compphys.go.ro/newtonian-gravity/</a></li>
                    <li>This is how I learned about Kepler's laws and discovered the relevance of Newton's law of gravitation: <a href="https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion#Newton's_law_of_gravitation" rel="noopener noreferrer" target="_blank">https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion#Position_as_a_function_of_time</a></li>
                    <li>This equation (and the one in the section after) is essentially what I used: <a href="https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation#Vector_form" rel="noopener noreferrer" target="_blank">https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation#Vector_form</a></li>
                    <li>To learn about N-body simulations and find a solution to one of my problems, I went here: <a href="https://en.wikipedia.org/wiki/N-body_simulation#Softening" rel="noopener noreferrer" target="_blank">https://en.wikipedia.org/wiki/N-body_simulation#Softening</a></li>
                    <li>To learn about elastic (and inelastic collisions, which I did not use), I went here: <a href="https://www.khanacademy.org/science/physics/linear-momentum/elastic-and-inelastic-collisions/a/what-are-elastic-and-inelastic-collisions" rel="noopener noreferrer" target="_blank">https://www.khanacademy.org/science/physics/linear-momentum/elastic-and-inelastic-collisions/a/what-are-elastic-and-inelastic-collisions</a></li>
                </ul>
            </p>
        </div>
    );
};

export default About;