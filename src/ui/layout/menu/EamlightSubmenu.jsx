import * as React from "react";

export default function EamlightSubmenu(props) {
  return (
    <ul className="layout-tab-submenu" id={props.id}>
      <li>
        {props.header}
        <ul>{props.children}</ul>
      </li>
    </ul>
  );
}
