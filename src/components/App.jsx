import React from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import Simulation from "./Simulation";
import About from "./About";
import ContactMe from "./ContactMe";

const routes = [
    {
        path: "/simulation",
        title: "Simulation",
        main: () => <Simulation />
    },
    {
        path: "/about",
        title: "About",
        main: () => <About />
    },
    {
        path: "/contact-me",
        title: "Contact Me",
        main: () => <ContactMe />
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
                    {routes.map((route, index) => (
                        <>
                        <li key={route.title} className="navigation__item">
                            <Link to={route.path}>{route.title}</Link>
                        </li>
                        {index < routes.length - 1 ? <hr /> : <></> }
                        </>
                    ))}
                </ul>
            </nav>
            <main>
                <Switch>
                    {routes.map(route => (
                        <Route key={route.title} path={route.path}>
                            {route.main}
                        </Route>
                    ))}
                </Switch>
            </main>
        </BrowserRouter>
    );
}


export default App;