import { Link } from "react-router-dom";

export default function MenuItem({ onClick, icon, label, link }) {
    if (onClick) {
        return (
            <li style={{ marginTop: 15 }}>
                <a onClick={onClick}>
                    {icon}
                    <span>{label}</span>
                </a>
            </li>
        );
    }

    return (
        <li style={{ marginTop: 15 }}>
            <Link to={"/" + link}>
                {icon}
                <span>{label}</span>
            </Link>
        </li>
    );
}
