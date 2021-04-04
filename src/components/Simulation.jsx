// import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import React, { useState, useEffect, useRef } from "react";
import Planet from "./Planet";

const defaultPlanets = [
        {name: "Sun", mass: 0, radius: 0, x: 0, y: 0},
        {name: "Mercury", mass: 0, radius: 0, x: 0, y: 0},
        {name: "Venus", mass: 0, radius: 0, x: 0, y: 0},
        {name: "Earth", mass: 0, radius: 0, x: 0, y: 0},
        {name: "Mars", mass: 0, radius: 0, x: 0, y: 0},
        {name: "Jupiter", mass: 0, radius: 0, x: 0, y: 0},
        {name: "Saturn", mass: 0, radius: 0, x: 0, y: 0},
        {name: "Uranus", mass: 0, radius: 0, x: 0, y: 0},
        {name: "Neptune", mass: 0, radius: 0, x: 0, y: 0},
    ];

const Simulation = (props) => {
    const [planets, setPlanets] = useState(defaultPlanets);
    const canvasRef = useRef(null);

    const createPlanet = (name, radius, mass, x, y) => {
        setPlanets([...planets, {name: name, radius: radius, mass: mass, x: x, y: y}]);
    };
    
    const draw = (ctx, frameCount) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI);
        ctx.fill();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        let frameCount = 0;
        let animationFrameId;

        const render = () => {
            frameCount++;
            draw(context, frameCount);
            animationFrameId = window.requestAnimationFrame(render);
        };
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        };
    }, [draw]);

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
            <div className="planets-info">
                <h2>Planet Information</h2>
                <div className="planets">
                    {planets.map(planet =>
                        <Planet key={planet.name} name={planet.name} 
                            mass={planet.mass} radius={planet.radius} 
                            x={planet.x} y={planet.y} />
                        )
                    }
                </div>
            </div>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}

export default Simulation;
