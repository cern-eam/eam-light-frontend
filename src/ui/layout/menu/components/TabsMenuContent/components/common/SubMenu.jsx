export default function SubMenu({ header, id, children }) {
    return (
        <ul className="layout-tab-submenu" id={id}>
            <li>
                {header}
                <ul>{children}</ul>
            </li>
        </ul>
    );
}
