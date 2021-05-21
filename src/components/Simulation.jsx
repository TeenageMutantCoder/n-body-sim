import * as BABYLON from "@babylonjs/core";
import SceneComponent from "./SceneComponent";
import React, { useState, useRef } from "react";
import "./Simulation.css";

const Simulation = (props) => {
    // Units are all in standard SI units (kg, m)
    // Mass and radius taken from https://solarsystem.nasa.gov/solar-system/sun/by-the-numbers/ and https://ssd.jpl.nasa.gov/?planet_phys_par
    // Equatorial radius data used for radius
    // Size is double the radius
    // Initial x values represent distance from sun. Taken from https://www.jpl.nasa.gov/edu/pdfs/scaless_reference.pdf
    const defaults = {
        timestep: 100000,
        gravitationalConstant: 6.674 * 10**(-11),
        softeningParameter: 0,
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
            {name: "Sun", color: "#FFFF00", mass: 10000, size: 10, x: 0, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
            {name: "Mercury", color: "#FF0000", mass: 100, size: 10, x: 50, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
            {name: "Venus", color: null, mass: 100, size: 10, x: 100, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
            {name: "Earth", color: "#00FFFF", mass: 100, size: 10, x: 150, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
            {name: "Mars", color: null, mass: 100, size: 10, x: 200, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
            {name: "Jupiter", color: null, mass: 100, size: 10, x: 250, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
            {name: "Saturn", color: null, mass: 100, size: 10, x: 300, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
            {name: "Uranus", color: null, mass: 100, size: 10, x: 350, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0},
            {name: "Neptune", color: null, mass: 1000, size: 10, x: 400, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0}
        ]
    };
    let { timestep, gravitationalConstant, softeningParameter } = defaults;
    const [bodiesInfo, setBodiesInfo] = useState(defaults.bodiesInfo);
    let playButton = useRef();
    let [simulationRunning, setSimulationRunning] = useState(false);

    const createBody = (bodyOptions, scene) => {
        const {name = "Unnamed", x = 0, y = 0, z = 0, size, color, mass, ...rest} = bodyOptions;
        let body = BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, scene);
        body.physicsImpostor = new BABYLON.PhysicsImpostor(body, BABYLON.PhysicsImpostor.SphereImpostor, {mass: mass}, scene);
        body.position = new BABYLON.Vector3(x, y, z);
        body.metadata = rest;
    };

    const clearScene = (scene) => {
        if(!scene.meshes) return;
        scene.meshes.forEach((mesh) => mesh.dispose());
    };

    const resetScene = (scene) => {
        clearScene(scene);
        defaults.bodiesInfo.forEach((body) => createBody(body, scene));
    };

    const handlePlay = () => {
        // If simulation already running (or vice versa), this will pause (or play) simulation and change button text.
        if (simulationRunning) {
            playButton.current.innerHTML = "Play";
        } else {
            playButton.current.innerHTML = "Pause";
        }
        setSimulationRunning(!simulationRunning);
    }

    const help = () => {

    };

    // Perfectly elastic collision for convenience
    // https://www.khanacademy.org/science/physics/linear-momentum/elastic-and-inelastic-collisions/a/what-are-elastic-and-inelastic-collisions
    const onCollision = (bodyA, bodyB) => {
        let velocityFinalA = BABYLON.Vector3.Zero();
        let velocityFinalB = BABYLON.Vector3.Zero();
        const massA = bodyA.physicsImpostor.mass;
        const massB = bodyB.physicsImpostor.mass;
        const velocityA = bodyA.metadata.velocity;
        const velocityB = bodyB.metadata.velocity;
        velocityFinalA = velocityA.scale((massA - massB) / (massA + massB)).add(velocityB.scale(2 * massB / (massA + massB)));
        velocityFinalB = velocityA.scale(2 * massA / (massA + massB)).add(velocityB.scale((massB - massA) / (massA + massB)));
        bodyA.metadata.velocity = velocityFinalA;
        bodyB.metadata.velocity = velocityFinalB;
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
        if (simulationRunning) {
            const deltaTime = timestep * scene.getEngine().getDeltaTime() / 1000;
            for (let i = 0; i < bodies.length; i++) {
                bodies[i].metadata.acceleration = getAcceleration(bodies[i], bodies);
            }
            for (let i = 0; i < bodies.length; i++) {
                const currentBody = bodies[i];
                const acceleration = currentBody.metadata.acceleration ?? BABYLON.Vector3.Zero();
                const velocity = currentBody.metadata.velocity ?? BABYLON.Vector3.Zero();
                // Update position
                let translationVector = velocity.scale(deltaTime).add(acceleration.scale(deltaTime ** 2 /2));
                currentBody.position.addInPlace(translationVector);
                // Update velocity
                currentBody.metadata.velocity = velocity.add(acceleration.scale(deltaTime));
            }
            updateBodiesInfo(bodies);
        }
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
};

    const onRender = (scene) => {
        updateBodies(scene.meshes, scene);
      };

    return (
        <div className="Simulation">
            <h1 className="title">Simulation</h1>
            <div className="Simulation__Container">
                <div className="Simulation__Controls">
                    <h2>Options</h2>
                    <div className="Simulation__Controls__General">
                        <h3>General settings</h3>
                        <label for="input__timestep">Timestep:</label>
                        <input name="input__timestep" id="input__timestep" type="text" />
                        <br />
                        <label for="input__G">G:</label>
                        <input name="input__G" id="input__G" type="text" />
                        <br />
                        <label for="input__softening">Softening:</label>
                        <input name="input__softening" id="input__softening" type="text" />
                    </div>
                    <div className="Simulation__Controls__Body">
                        <h3>Body settings</h3>
                        <label for="input__name">Name:</label>
                        <input name="input__name" id="input__name" type="text" />
                        <br />
                        <label for="input__color">Color:</label>
                        <input name="input__color" id="input__color" type="color" />
                        <br />
                        <label for="input__mass">Mass:</label>
                        <input name="input__mass" id="input__mass" type="text" />
                        <br />
                        <label for="input_size">Size:</label>
                        <input name="input_size" id="input__size" type="text" />
                        <br />
                        <label for="input__position-x">X:</label>
                        <input name="input__position-x" id="input__position-x" type="text" />
                        <br />
                        <label for="input__position-y">Y:</label>
                        <input name="input__position-y" id="input__position-y" type="text" />
                        <br />
                        <label for="input__position-z">Z:</label>
                        <input name="input__position-z" id="input__position-z" type="text" />
                        <br />
                        <label for="input__velocity-x">Velocity X:</label>
                        <input name="input__velocity-x" id="input__velocity-x" type="text" />
                        <br />
                        <label for="input__velocity-y">Velocity Y:</label>
                        <input name="input__velocity-y" id="input__velocity-y" type="text" />
                        <br />
                        <label for="input__velocity-z">Velocity Z:</label>
                        <input name="input__velocity-z" id="input__velocity-z" type="text" />
                    </div>
                    <button onClick={clearScene}>Clear Scene</button>
                    <br />
                    <button onClick={resetScene}>Reset Scene</button>
                    <br />
                    <button ref={playButton} onClick={handlePlay}>Play</button>
                    <br />
                    <button onClick={help}>Help</button>
                </div>
                <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="canvas" />
            </div>
        </div>
    );
};

export default Simulation;
