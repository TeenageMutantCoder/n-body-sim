import React from "react";
import Planet from "./Planet";

class Simulation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            planets: [
                {name: "Sun", mass: 0, radius: 0, x: 0, y: 0},
                {name: "Mercury", mass: 0, radius: 0, x: 0, y: 0},
                {name: "Venus", mass: 0, radius: 0, x: 0, y: 0},
                {name: "Earth", mass: 0, radius: 0, x: 0, y: 0},
                {name: "Mars", mass: 0, radius: 0, x: 0, y: 0},
                {name: "Jupiter", mass: 0, radius: 0, x: 0, y: 0},
                {name: "Saturn", mass: 0, radius: 0, x: 0, y: 0},
                {name: "Uranus", mass: 0, radius: 0, x: 0, y: 0},
                {name: "Neptune", mass: 0, radius: 0, x: 0, y: 0},
            ]
        };
    }

    createPlanet(name, radius, mass, x, y) {
        this.setState({planets: this.state.planets.push(
            {name: name, radius: radius, mass: mass, x: x, y: y}
        )});
    }

    render() {
        return(
            <div className="Simulation">
                <h1 className="title">Simulation</h1>
                <div className="planets-info">
                    <h2>Planet Information</h2>
                    <div className="planets">
                        {this.state.planets.map(planet =>
                            <Planet key={planet.name} name={planet.name} 
                                mass={planet.mass} radius={planet.radius} 
                                x={planet.x} y={planet.y} />
                            )
                        }
                    </div>
                </div>
                <canvas id="glCanvas"></canvas>
            </div>
        );
    }
}

export default Simulation;
