import { Engine, Scene, Vector3, CannonJSPlugin } from "@babylonjs/core";
import React, { useEffect, useRef } from "react";

const SceneComponent = (props) => {
  const reactCanvas = useRef(null);
  const {
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    ...rest
  } = props;

  useEffect(() => {
    if (reactCanvas.current) {
      // Prevents page scrolling using the arrow keys
      reactCanvas.current.addEventListener("keydown", (e) => {
        if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          e.preventDefault();
        }
      });
      const engine = new Engine(
        reactCanvas.current,
        antialias,
        engineOptions,
        adaptToDeviceRatio
      );
      const scene = new Scene(engine, sceneOptions);
      let gravityVector = new Vector3(0, 0, 0);
      let physicsPlugin = new CannonJSPlugin();
      scene.enablePhysics(gravityVector, physicsPlugin);
      scene.collisionsEnabled = true;
      if (scene.isReady()) {
        props.onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => props.onSceneReady(scene));
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === "function") {
          onRender(scene);
        }
        scene.render();
      });

      const resize = () => {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener("resize", resize);
      }

      return () => {
        scene.getEngine().dispose();

        if (window) {
          window.removeEventListener("resize", resize);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactCanvas]);

  return <canvas ref={reactCanvas} {...rest} />;
};

export default SceneComponent;
