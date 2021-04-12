import React from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import About from "./About";
import ContactMe from "./ContactMe";
import Home from "./Home";
import Simulation from "./Simulation";

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
        path: "/contact-me",
        title: "Contact Me",
        content: () => <ContactMe />
    },
    {
        path: "/",
        title: "Home",
        content: () => <Home />
    }
];

const App = () => {
    return (
        <BrowserRouter>
            <input type="checkbox" id="menu-toggle" />
            <label for="menu-toggle" className="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </label>
            <nav className="navigation">
                <ul>
                    <li className="navigation__item">
                        <Link to="/">Home</Link>
                    </li>
                    <hr />
                    <li className="navigation__item">
                        <Link to="/simulation">Simulation</Link>
                    </li>
                    <hr />
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