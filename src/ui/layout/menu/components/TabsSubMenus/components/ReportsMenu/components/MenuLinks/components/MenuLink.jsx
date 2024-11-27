import { Link } from "react-router-dom";

const MenuLink = ({ description, link }) => {
    const spanStyle = {
        display: "inline",
        fontSize: 13,
        marginTop: 5,
        paddingLeft: 5,
    };

    const linkStyle = {
        textAlign: "left",
        marginTop: 5,
    };

    return (
        <li>
            <Link to={link} style={linkStyle}>
                <span style={spanStyle}>{description}</span>
            </Link>
        </li>
    );
};

export default MenuLink;
