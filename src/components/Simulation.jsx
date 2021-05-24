import * as BABYLON from "@babylonjs/core";
import SceneComponent from "./SceneComponent";
import React, { useState } from "react";
import "./Simulation.css";

const Simulation = (props) => {
    // Units are all in standard SI units (kg, m)
    // Mass and radius taken from https://solarsystem.nasa.gov/solar-system/sun/by-the-numbers/ and https://ssd.jpl.nasa.gov/?planet_phys_par
    // Equatorial radius data used for radius
    // Size is double the radius
    // Initial x values represent distance from sun. Taken from https://www.jpl.nasa.gov/edu/pdfs/scaless_reference.pdf
    const defaults = {
        timestep: 10,
        gravitationalConstant: 6.674 * 10**(-11),
        currentBodyInfo: {name: "", mass: 100, color:"#000000", size: 10, x: 0, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
        // bodiesInfo: [
        //     {name: "Sun", color: null, mass: 19891 * 10**26, size: 695508, x: 0, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
        //     {name: "Mercury", color: null, mass: 330114 * 10**18, size: 2440.53, x: 57900000, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
        //     {name: "Venus", color: null, mass: 486747 * 10**19, size: 6051.8, x: 108200000, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
        //     {name: "Earth", color: null, mass: 597237 * 10**19, size: 6378.1366, x: 149600000, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
        //     {name: "Mars", color: null, mass: 641712 * 10**18, size: 3396.19, x: 227900000, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
        //     {name: "Jupiter", color: null, mass: 1898187 * 10**21, size: 71492, x: 778600000, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
        //     {name: "Saturn", color: null, mass: 5683174 * 10**20, size: 60268, x: 1433500000, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
        //     {name: "Uranus", color: null, mass: 868127 * 10**20, size: 25559, x: 2872500000, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
        //     {name: "Neptune", color: null, mass: 1024126 * 10**20, size: 24764, x: 4495100000, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0}
        // ]
        bodiesInfo: [
            {name: "Sun", color: "#FFFF00", mass: 10000000000000, size: 30, x: 0, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
            {name: "Mercury", color: "#FF0000", mass: 1000, size: 10, x: 50, y: 100, z: 50, velocityX: 0.3, velocityY: -0.3, velocityZ: 0},
            {name: "Venus", color: null, mass: 1000, size: 10, x: 100, y: 50, z: 150, velocityX: 0, velocityY: 0, velocityZ: -0.3},
            {name: "Earth", color: "#00FFFF", mass: 1000, size: 10, x: 150, y: 0, z: 100, velocityX: 0, velocityY: 0, velocityZ: -0.3},
            // {name: "Mars", color: null, mass: 1000, size: 10, x: 200, y: -50, z: 100, velocityX: 0, velocityY: 0.2, velocityZ: -0.1},
            // {name: "Jupiter", color: null, mass: 1000, size: 10, x: 250, y: -100, z: 100, velocityX: 0, velocityY: 0, velocityZ: 0},
            // {name: "Saturn", color: null, mass: 1000, size: 10, x: 300, y: 75, z: 100, velocityX: 0, velocityY: 0, velocityZ: 0},
            // {name: "Uranus", color: null, mass: 1000, size: 10, x: 350, y: -75, z: 100, velocityX: 0, velocityY: 0, velocityZ: 0},
            // {name: "Neptune", color: null, mass: 1000, size: 10, x: 400, y: 50, z: 100, velocityX: 0, velocityY: 0, velocityZ: 0}
        ]
    };
    const [timestep, setTimestep] = useState(defaults.timestep);
    const [gravitationalConstant, setGravitationalContant] = useState(defaults.gravitationalConstant);
    const [bodiesInfo, setBodiesInfo] = useState(defaults.bodiesInfo);
    let [simulationIsRunning, setSimulationIsRunning] = useState(false);

    const createBody = (bodyOptions, scene) => {
        const {name = "Unnamed", x=0, y=0, z=0, velocityX=0, velocityY=0, velocityZ=0, size=1, color, mass=1, ...rest} = bodyOptions;
        let body = BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, scene);
        body.physicsImpostor = new BABYLON.PhysicsImpostor(body, BABYLON.PhysicsImpostor.SphereImpostor, {mass: mass}, scene);
        body.position = new BABYLON.Vector3(x, y, z);
        body.metadata = rest;
        body.metadata.velocity = new BABYLON.Vector3(velocityX, velocityY, velocityZ);
        body.checkCollisions = true;
    };

    const clearScene = (scene) => {
        scene.meshes.forEach((mesh) => {
            // scene.removeMesh(mesh);
            mesh.dispose();
        })
    };

    const resetScene = (scene) => {
        clearScene(scene);
        defaults.bodiesInfo.forEach((body) => createBody(body, scene));
    };

    const addInputToState = () => {
        let bodies = [];
        const bodiesValues = document.querySelectorAll(".celestial-body-info");
        for (let i = 0; i < bodiesValues.length; i++) {
            const name = bodiesValues[i].querySelector(".input__name").value;
            const color = bodiesValues[i].querySelector(".input__color").value;
            const size = bodiesValues[i].querySelector(".input__size").value;
            const mass = bodiesValues[i].querySelector(".input__mass").value;
            const x = bodiesValues[i].querySelector(".input__x").value;
            const y = bodiesValues[i].querySelector(".input__y").value;
            const z = bodiesValues[i].querySelector(".input__z").value;
            const velocityX = bodiesValues[i].querySelector(".input__velocity-x").value;
            const velocityY = bodiesValues[i].querySelector(".input__velocity-y").value;
            const velocityZ = bodiesValues[i].querySelector(".input__velocity-z").value;
            bodies.push({name: name, color: color, size: size, mass: mass, 
                         x: x, y: y, z: z, velocityX: velocityX, velocityY: velocityY, velocityZ: velocityZ});
        }
        setBodiesInfo(bodies);
        const gravitationalConstant = document.querySelector(".input__g").value;
        const timestep = document.querySelector(".input__timestep").value;
        setGravitationalContant(gravitationalConstant);
        setTimestep(timestep);
    };

    const startSimulation = () => {
        // addInputToState();
        // console.log(bodiesInfo);
        setSimulationIsRunning(true);
    }

    const help = () => {
        alert("Fill in the table fields on to change parameters for the simulation or the celestial bodies.\nWhen ready, press start to run the simulation. To stop the simulation, press refresh your page.\nUse the mouse wheel to zoom in or out inside the simulation, and use the arrow keys to move around. Drag the mouse to rotate the camera in the simulation.");
    };

    const getAcceleration = (body, bodies) => {
        let acceleration = BABYLON.Vector3.Zero();
        for (let i=0; i < bodies.length; i++) {
            if (body === bodies[i]) continue;
            const otherBody = bodies[i];
            const distanceSquared = BABYLON.Vector3.DistanceSquared(body.position, otherBody.position);
            const unitVector = otherBody.position.subtract(body.position).normalize();
            acceleration.addInPlace(unitVector.scale(otherBody.physicsImpostor.mass / distanceSquared));
        }
        acceleration.scaleInPlace(gravitationalConstant);
        return acceleration;
    };

    const updateBodiesInfo = (bodies) => {
        if (!bodies) return;
        let infoArray = [];
        bodies.forEach((body) => {
            let bodyObject = {};
            bodyObject.name = body.name;
            bodyObject.color = body.metadata.color;
            bodyObject.mass = body.physicsImpostor.mass;
            bodyObject.x = body.position.x;
            bodyObject.y = body.position.y;
            bodyObject.z = body.position.z;
            bodyObject.velocityX = body.metadata.velocity.x;
            bodyObject.velocityY = body.metadata.velocity.y;
            bodyObject.velocityZ = body.metadata.velocity.z;
            infoArray.push(bodyObject);
        });
        setBodiesInfo(infoArray);
    };

    const updateBodies = (bodies, scene) => {
        const deltaTime = timestep * scene.getEngine().getDeltaTime() / 1000;
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].metadata.acceleration = getAcceleration(bodies[i], bodies);
        }
        for (let i = 0; i < bodies.length; i++) {
            const currentBody = bodies[i];
            const acceleration = currentBody.metadata.acceleration ?? BABYLON.Vector3.Zero();
            const velocity = currentBody.metadata.velocity ?? BABYLON.Vector3.Zero();
            // Update position
            let displacementVector = velocity.scale(deltaTime).add(acceleration.scale(deltaTime ** 2 /2));
            currentBody.moveWithCollisions(displacementVector);
            // Update velocity
            currentBody.metadata.velocity = velocity.add(acceleration.scale(deltaTime));
        }
        updateBodiesInfo(bodies);
    };

    const onSceneReady = (scene) => {
        let camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 5, -500), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        const canvas = scene.getEngine().getRenderingCanvas();
        camera.inputs.addMouseWheel();
        camera.attachControl(canvas, true);
        let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        if (bodiesInfo) bodiesInfo.forEach((body) => {createBody(body, scene)});
        // scene.metadata = {isRunning: simulationIsRunning};
        
        // document.querySelector("#start-btn").addEventListener("click", (e) => {
        //     scene.metadata = {timestep: timestep, gravitationalConstant: gravitationalConstant, isRunning: true};
        // });
        // document.querySelector("#reset-btn").addEventListener("click", (e) => {resetScene(scene)});
};

    const onRender = (scene) => {updateBodies(scene.meshes, scene)};

    return (
        <div className="Simulation">
            <h1 className="title">Simulation</h1>
            {simulationIsRunning && <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="canvas" />}
            {/* {!simulationIsRunning && 
            <table className="bodies-info-table">
                <tr>
                    <th colspan="10" className="table__title">Simulation Settings</th>
                </tr>
                <tr>
                    <th colspan="5">Gravitational Constant</th>
                    <th colspan="5">Timestep</th>
                </tr>
                <tr>
                    <td colspan="5">
                        <input className="input_g" type="number" step="0.00001" value={gravitationalConstant} />
                    </td>
                    <td colspan="5">
                        <input className="input__timestep" type="number" value={timestep} />
                    </td>
                </tr>
                <tr>
                    <th colspan="10" className="table__title">Celestial Bodies</th>
                </tr>
                <tr>
                    <th>Name</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Mass</th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Z</th>
                    <th>Velocity X</th>
                    <th>Velocity Y</th>
                    <th>Velocity Z</th>
                </tr>
                {bodiesInfo.map((body) => { 
                    return (
                    <tr className="celestial-body-info">
                        <td>
                            <input className="input__name" value={body.name} />
                        </td>
                        <td>
                            <input className="input__color" type="color" value={body.color} />
                        </td>
                        <td>
                            <input className="input__size" type="number" min="1" value={body.size} />
                        </td>
                        <td>
                            <input className="input__mass" type="number" min="1" value={body.mass} />
                        </td>
                        <td>
                            <input className="input__x" type="number" min="1" value={body.x} />
                        </td>
                        <td>
                            <input className="input__y" type="number" min="1" value={body.y} />
                        </td>
                        <td>
                            <input className="input__z" type="number" min="1" value={body.z} />
                        </td>
                        <td>
                            <input className="input__velocity-x" type="number" step="0.0001" value={body.velocityX} />
                        </td>
                        <td>
                            <input className="input__velocity-y" type="number" step="0.0001" value={body.velocityY} />
                        </td>
                        <td>
                            <input className="input__velocity-z" type="number" step="0.0001" value={body.velocityZ} />
                        </td>
                    </tr>
                    )
                })}
            </table>
            } */}
            {!simulationIsRunning && 
            <table className="bodies-info-table">
                <thead>
                    <tr>
                        <th colSpan="9" className="table__title">Simulation Settings</th>
                    </tr>
                    <tr>
                        <th colSpan="4">Gravitational Constant</th>
                        <th></th>
                        <th colSpan="4">Timestep</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="4">{gravitationalConstant}</td>
                        <td></td>
                        <td colSpan="4">{timestep}</td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th colSpan="9" className="table__title">Celestial Bodies</th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Mass</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Z</th>
                        <th>Velocity X</th>
                        <th>Velocity Y</th>
                        <th>Velocity Z</th>
                    </tr>
                </thead>
                <tbody>
                    {bodiesInfo.map((body) => { 
                        return (
                        <tr key={body.name} className="celestial-body-info">
                            <td>{body.name}</td>
                            <td>{body.size}</td>
                            <td>{body.mass}</td>
                            <td>{body.x}</td>
                            <td>{body.y}</td>
                            <td>{body.z}</td>
                            <td>{body.velocityX}</td>
                            <td>{body.velocityY}</td>
                            <td>{body.velocityZ}</td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
            }
            <div className="buttons">
                <button type="button" id="reset-btn" onClick={()=>{setSimulationIsRunning(false); setBodiesInfo(defaults.bodiesInfo)}}>Reset</button>
                <button type="button" onClick={help}>Help</button>
                <button type="button" id="start-btn" onClick={startSimulation}>Start Simulation</button>
            </div>
        </div>
    );
};

export default Simulation;
