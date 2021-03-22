function Planet(props) {
    return(
        <div className="Planet">
            <p>Name: {props.name}</p>
            <p>Mass: {props.mass}</p>
            <p>Radius: {props.radius}</p>
            <p>X: {props.x}</p>
            <p>Y: {props.y}</p>
        </div>
    );
}

export default Planet;