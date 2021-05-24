import React from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import Simulation from "./Simulation";
import "./App.css";

const routes = [
    {
        path: "/simulation",
        title: "Simulation",
        content: () => <Simulation />
    },
    {
        path: "/about",
        title: "About",
        content: () => <About />
    },
    {
        path: "/",
        title: "Home",
        content: () => <Home />
    }
];

const App = () => {
    // Will close navigation menu if user clicks outside of it
    document.addEventListener("pointerup", (e) => {
        if (e.target.className === "navigation" || e.target.className === "hamburger" ||
            e.target.className === "hamburger__line" || e.target.className === "navigation__list" ||
            e.target.className === "navigation__separator") return;
        const menuToggle = document.querySelector("input#menu-toggle");
        if (menuToggle.checked) {
            menuToggle.checked = false;
        }
    });

    return (
        <BrowserRouter>
            <input type="checkbox" id="menu-toggle" />
            <label htmlFor="menu-toggle" className="hamburger">
                <span className="hamburger__line"></span>
                <span className="hamburger__line"></span>
                <span className="hamburger__line"></span>
            </label>
            <nav className="navigation">
                <ul className="navigation__list">
                    <li className="navigation__item">
                        <Link to="/">Home</Link>
                    </li>
                    <hr className="navigation__separator"/>
                    <li className="navigation__item">
                        <Link to="/simulation">Simulation</Link>
                    </li>
                    <hr className="navigation__separator"/>
                    <li className="navigation__item">
                        <Link to="/about">About</Link>
                    </li>
                </ul>
            </nav>
            <main>
                <Switch>
                    {routes.map(route => (
                        <Route key={route.title} path={route.path}>
                            {route.content}
                        </Route>
                    ))}
                </Switch>
            </main>
        </BrowserRouter>
    );
};


export default App;