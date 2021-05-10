// import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import React, { useState, useEffect, useRef } from "react";

const Simulation = (props) => {
    // Units are all in standard SI units (kg, m)
    // Mass and radius taken from https://solarsystem.nasa.gov/solar-system/sun/by-the-numbers/ and https://ssd.jpl.nasa.gov/?planet_phys_par
    // Equatorial radius data used for radius
    // Initial x values represent distance from sun. Taken from https://www.jpl.nasa.gov/edu/pdfs/scaless_reference.pdf
    const defaults = {
        // gravitationalConstant: 6.674 * 10**(-11),
        gravitationalConstant: 0.001,
        // zoomScale: 1/1000,
        zoomScale: 1,
        shouldInvertCamera: false,
        // cameraSpeed: 100,
        cameraSpeed: 50,
        zoomScaleStep: 1.1,
        cameraSpeedStep: 100,
        paused: false,
        // planets: [
        //     {name: "Sun", color: null, mass: 19891 * 10**26, radius: 695508, x: 0, y: 0, dx: 0, dy: 0},
        //     {name: "Mercury", color: null, mass: 330114 * 10**18, radius: 2440.53, x: 57900000, y: 0, dx: 0, dy: 0},
        //     {name: "Venus", color: null, mass: 486747 * 10**19, radius: 6051.8, x: 108200000, y: 0, dx: 0, dy: 0},
        //     {name: "Earth", color: null, mass: 597237 * 10**19, radius: 6378.1366, x: 149600000, y: 0, dx: 0, dy: 0},
        //     {name: "Mars", color: null, mass: 641712 * 10**18, radius: 3396.19, x: 227900000, y: 0, dx: 0, dy: 0},
        //     {name: "Jupiter", color: null, mass: 1898187 * 10**21, radius: 71492, x: 778600000, y: 0, dx: 0, dy: 0},
        //     {name: "Saturn", color: null, mass: 5683174 * 10**20, radius: 60268, x: 1433500000, y: 0, dx: 0, dy: 0},
        //     {name: "Uranus", color: null, mass: 868127 * 10**20, radius: 25559, x: 2872500000, y: 0, dx: 0, dy: 0},
        //     {name: "Neptune", color: null, mass: 1024126 * 10**20, radius: 24764, x: 4495100000, y: 0, dx: 0, dy: 0}
        // ]
        planets: [
            {name: "Sun", color: "#FFFF00", mass: 1000, radius: 10, x: 0, y: 0, dx: 0, dy: 0},
            // {name: "Mercury", color: "#FF0000", mass: 100, radius: 10, x: 50, y: 0, dx: 0, dy: 0},
            // {name: "Venus", color: null, mass: 100, radius: 10, x: 100, y: 0, dx: 0, dy: 0},
            // {name: "Earth", color: "#00FFFF", mass: 100, radius: 10, x: 150, y: 0, dx: 0, dy: 0},
            // {name: "Mars", color: null, mass: 100, radius: 10, x: 200, y: 0, dx: 0, dy: 0},
            // {name: "Jupiter", color: null, mass: 100, radius: 10, x: 250, y: 0, dx: 0, dy: 0},
            // {name: "Saturn", color: null, mass: 100, radius: 10, x: 300, y: 0, dx: 0, dy: 0},
            // {name: "Uranus", color: null, mass: 100, radius: 10, x: 350, y: 0, dx: 0, dy: 0},
            {name: "Neptune", color: null, mass: 1000, radius: 10, x: 200, y: 0, dx: 2, dy: 2}
        ]
    };
    let zoomScale = defaults.zoomScale;
    let xOffset = 0;
    let yOffset = 0;
    let cameraSpeed = defaults.cameraSpeed;
    let shouldInvertCamera = defaults.shouldInvertCamera;
    let paused = defaults.paused;

    const [planets, setPlanets] = useState(defaults.planets);
    const canvasRef = useRef(null);

    // eslint-disable-next-line no-unused-vars
    const createPlanet = (planet) => {
        setPlanets([...planets, {name: planet.name, color: planet.color, 
                                 radius: planet.radius, mass: planet.mass, 
                                 x: planet.x, y: planet.y, dx: planet.dx, dy: planet.dy}]);
    };

    const getDistance = (objectA, objectB) => {
        return Math.sqrt((objectB.y - objectA.y) ** 2 + (objectB.x - objectA.x) ** 2);
    }

    const getGravitationalForce = (objectA, objectB) => {
        const distance = getDistance(objectA, objectB);
        if (distance === 0) return 0;
        return (defaults.gravitationalConstant * objectA.mass * objectB.mass) / (distance ** 2);
    };

    const getDirection = (fromObject, toObject) => {
        const distance = getDistance(fromObject, toObject);
        if (distance === 0) return 0;
        const distanceX = toObject.x - fromObject.x;
        return Math.acos(distanceX / distance);
    };

    const getForceVector = (force, direction) => {
        const forceX = Math.cos(direction) * force;
        const forceY = Math.sin(direction) * force;
        return {x: forceX, y: forceY};
    }

    const updatePlanets = () => {
        const star = planets[0];
        planets.forEach((planet) => {
            if (planet === star) {
                console.log("star");
                return;}
            const force = getGravitationalForce(star, planet);
            const direction = getDirection(planet, star);
            const {x: forceX, y: forceY} = getForceVector(force, direction);
            planet.dx += forceX;
            planet.dy += -forceY; // Adding negative forceY because y axis is inverted in computer graphics

            const nextX = planet.x + planet.dx;
            const nextY = planet.y + planet.dy;

            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            if (nextX >= rect.width - rect.width/2 || nextX <= 0 - rect.width/2) {
                planet.dx = -planet.dx;
            }
            if (nextY >= rect.height - rect.height/2 || nextY <= 0 - rect.height/2) {
                    planet.dy = -planet.dy;
            }
            // planet.x += forceX;
            // planet.y += forceY;
            planet.x += planet.dx;
            planet.y += planet.dy;
        });
        setPlanets(planets);
    };

    const handleKeyDown = (event, speed, shouldInvert) => {
        speed = shouldInvert ? speed : -speed;
        switch (event.key.toLowerCase()) {
            // Camera movement controls
            case "arrowup":
                yOffset += speed;
                break;
            case "arrowdown":
                yOffset -= speed;
                break;
            case "arrowleft":
                xOffset += speed;
                break;
            case "arrowright":
                xOffset -= speed;
                break;
            // Reset
            case "r":
                xOffset = 0;
                yOffset = 0;
                cameraSpeed = defaults.cameraSpeed;
                zoomScale = defaults.zoomScale;
                shouldInvertCamera = defaults.shouldInvertCamera;
                break;
            // Zoom controls
            case "w":
                zoomScale *= defaults.zoomScaleStep;
                break;
            case "s":
                zoomScale /= defaults.zoomScaleStep;
                break;
            // Camera speed controls
            case "a":
                if (cameraSpeed === defaults.cameraSpeedStep) break;
                cameraSpeed -= defaults.cameraSpeedStep;
                break;
            case "d":
                cameraSpeed += defaults.cameraSpeedStep;
                break;
            // Camera invert toggle
            case "i":
                shouldInvertCamera = !shouldInvertCamera;
                break;
            // Pause
            case " ":
                paused = !paused;
                break;
            default:
                return;
        }
    }

    const draw = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Draw each planet
        planets.forEach(planet => {
            ctx.fillStyle = planet.color ? planet.color : '#FFFFFF';
            ctx.beginPath();
            ctx.arc(Math.round(planet.x * zoomScale + ctx.canvas.width/2) - xOffset,
                    Math.round(planet.y * zoomScale + ctx.canvas.height/2) - yOffset, 
                    Math.round(planet.radius * zoomScale), 0, 2*Math.PI);
            ctx.fill();
        });
        // Draw camera information text
        ctx.fillStyle = "#FF0000";
        ctx.font = "2rem sans-serif"
        ctx.fillText("Camera speed: " + cameraSpeed, 5, 25);
        ctx.fillText("Zoom scale: " + Number.parseFloat(zoomScale).toFixed(6), 5, 75);
        ctx.fillText("Inverted camera: " + shouldInvertCamera, 5, 125);
        ctx.fillText("Camera position: (" + xOffset + " " + yOffset + ")", 5, 175);
        if (paused) ctx.fillText("Paused", 5, 225);
    };
    
    useEffect(() => {
        document.addEventListener("keydown", event => {
            event.preventDefault();
            handleKeyDown(event, cameraSpeed, shouldInvertCamera);
        });

        const canvas = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const context = canvas.getContext("2d")
        context.scale(dpr, dpr);
        let animationFrameId;

        const render = () => {
            draw(context, dpr);
            if (!paused) updatePlanets();
            animationFrameId = window.requestAnimationFrame(render);
        };
        render();
        return () => {
            window.cancelAnimationFrame(animationFrameId)
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [planets]);

    // let box;

    // const onSceneReady = (scene) => {
    //     var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    //     camera.setTarget(Vector3.Zero());
    //     const canvas = scene.getEngine().getRenderingCanvas();
    //     camera.attachControl(canvas, true);
    //     var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    //     light.intensity = 0.7;
    //     box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
    //     box.position.y = 1;
    //     MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    //   };

    // const onRender = (scene) => {
    //     if (box !== undefined) {
    //       var deltaTimeInMillis = scene.getEngine().getDeltaTime();
    //       const rpm = 10;
    //       box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    //     }
    //   };
    
    // useEffect(() => {
    //     if (canvas.current) {
    //       const engine = new Engine(canvas.current);
    //       const scene = new Scene(engine);
    //       if (scene.isReady()) {
    //         onSceneReady(scene);
    //       } else {
    //         scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    //       }
    //       engine.runRenderLoop(() => {
    //         onRender(scene);
    //         scene.render();
    //       });
    //       const resize = () => {
    //         scene.getEngine().resize();
    //       };
    //       if (window) {
    //         window.addEventListener("resize", resize);
    //       }
    //       return () => {
    //         scene.getEngine().dispose();
    //         if (window) {
    //           window.removeEventListener("resize", resize);
    //         }
    //       };
    //     }
    //   }, [canvas]);

    return (
        <div className="Simulation">
            <h1 className="title">Simulation</h1>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default Simulation;
