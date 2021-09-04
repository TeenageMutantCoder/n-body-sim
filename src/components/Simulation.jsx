/* eslint-disable no-unused-vars */
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
    gravitationalConstant: 6.674 * 10 ** -11,
    currentBodyInfo: {
      name: "",
      mass: 100,
      color: "#000000",
      size: 10,
      x: 0,
      y: 0,
      z: 0,
      velocityX: 0,
      velocityY: 0,
      velocityZ: 0,
    },
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
      {
        name: "Sun",
        color: "#FFFF00",
        mass: 10000000000000,
        size: 30,
        x: 0,
        y: 0,
        z: 0,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
      },
      {
        name: "Mercury",
        color: "#FF0000",
        mass: 1000,
        size: 10,
        x: 50,
        y: 100,
        z: 50,
        velocityX: 0.3,
        velocityY: -0.3,
        velocityZ: 0,
      },
      {
        name: "Venus",
        color: "#FFFF00",
        mass: 1000,
        size: 10,
        x: 100,
        y: 50,
        z: 150,
        velocityX: 0,
        velocityY: 0,
        velocityZ: -0.3,
      },
      {
        name: "Earth",
        color: "#00FFFF",
        mass: 1000,
        size: 10,
        x: 150,
        y: 0,
        z: 100,
        velocityX: 0,
        velocityY: 0,
        velocityZ: -0.3,
      },
      {
        name: "Mars",
        color: "#FFFF00",
        mass: 1000,
        size: 10,
        x: 200,
        y: -50,
        z: 100,
        velocityX: 0,
        velocityY: 0.2,
        velocityZ: -0.1,
      },
      {
        name: "Jupiter",
        color: "#FFFF00",
        mass: 1000,
        size: 10,
        x: 250,
        y: -100,
        z: 100,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
      },
      {
        name: "Saturn",
        color: "#FFFF00",
        mass: 1000,
        size: 10,
        x: 300,
        y: 75,
        z: 100,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
      },
      {
        name: "Uranus",
        color: "#FFFF00",
        mass: 1000,
        size: 10,
        x: 350,
        y: -75,
        z: 100,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
      },
      {
        name: "Neptune",
        color: "#FFFF00",
        mass: 1000,
        size: 10,
        x: 400,
        y: 50,
        z: 100,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
      },
    ],
  };
  const [timestep, setTimestep] = useState(defaults.timestep);
  const [gravitationalConstant, setGravitationalContant] = useState(
    defaults.gravitationalConstant
  );
  const [bodiesInfo, setBodiesInfo] = useState(defaults.bodiesInfo);
  let [simulationIsRunning, setSimulationIsRunning] = useState(false);

  const createBody = (bodyOptions, scene) => {
    const {
      name = "Unnamed",
      x = 0,
      y = 0,
      z = 0,
      velocityX = 0,
      velocityY = 0,
      velocityZ = 0,
      size = 1,
      color,
      mass = 1,
      ...rest
    } = bodyOptions;
    let body = BABYLON.MeshBuilder.CreateSphere(
      name,
      { diameter: size },
      scene
    );
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: mass },
      scene
    );
    body.position = new BABYLON.Vector3(x, y, z);
    body.metadata = rest;
    body.metadata.velocity = new BABYLON.Vector3(
      velocityX,
      velocityY,
      velocityZ
    );
    body.checkCollisions = true;
  };

  const clearScene = (scene) => {
    scene.meshes.forEach((mesh) => {
      // scene.removeMesh(mesh);
      mesh.dispose();
    });
  };

  const resetScene = (scene) => {
    clearScene(scene);
    defaults.bodiesInfo.forEach((body) => createBody(body, scene));
  };

  // When a table input is edited, change the respective body information in state
  const editBodyState = (index, property, value) => {
    const temp = bodiesInfo;
    Object.defineProperty(temp[index], property, { value: value });
    setBodiesInfo(temp);
  };

  const startSimulation = () => {
    // addInputToState();
    console.log(bodiesInfo);
    setSimulationIsRunning(true);
  };

  const getAcceleration = (body, bodies) => {
    let acceleration = BABYLON.Vector3.Zero();
    for (let i = 0; i < bodies.length; i++) {
      if (body === bodies[i]) continue;
      const otherBody = bodies[i];
      const distanceSquared = BABYLON.Vector3.DistanceSquared(
        body.position,
        otherBody.position
      );
      const unitVector = otherBody.position.subtract(body.position).normalize();
      acceleration.addInPlace(
        unitVector.scale(otherBody.physicsImpostor.mass / distanceSquared)
      );
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
    const deltaTime = (timestep * scene.getEngine().getDeltaTime()) / 1000;
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].metadata.acceleration = getAcceleration(bodies[i], bodies);
    }
    for (let i = 0; i < bodies.length; i++) {
      const currentBody = bodies[i];
      const acceleration =
        currentBody.metadata.acceleration ?? BABYLON.Vector3.Zero();
      const velocity = currentBody.metadata.velocity ?? BABYLON.Vector3.Zero();
      // Update position
      let displacementVector = velocity
        .scale(deltaTime)
        .add(acceleration.scale(deltaTime ** 2 / 2));
      currentBody.moveWithCollisions(displacementVector);
      // Update velocity
      currentBody.metadata.velocity = velocity.add(
        acceleration.scale(deltaTime)
      );
    }
    updateBodiesInfo(bodies);
  };

  const onSceneReady = (scene) => {
    let camera = new BABYLON.UniversalCamera(
      "camera",
      new BABYLON.Vector3(0, 5, -500),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.inputs.addMouseWheel();
    camera.attachControl(canvas, true);
    let light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.7;
    if (bodiesInfo)
      bodiesInfo.forEach((body) => {
        createBody(body, scene);
      });
  };

  const onRender = (scene) => {
    updateBodies(scene.meshes, scene);
  };

  return (
    <div className="Simulation">
      <h1 className="title">Simulation</h1>
      <div className="buttons">
        <button
          type="button"
          id="reset-btn"
          onClick={() => {
            setSimulationIsRunning(false);
            setBodiesInfo(defaults.bodiesInfo);
          }}
        >
          Reset
        </button>
        <button type="button" id="start-btn" onClick={startSimulation}>
          Start Simulation
        </button>
      </div>
      {simulationIsRunning && (
        <SceneComponent
          antialias
          onSceneReady={onSceneReady}
          onRender={onRender}
          id="canvas"
        />
      )}
    </div>
  );
};

export default Simulation;
