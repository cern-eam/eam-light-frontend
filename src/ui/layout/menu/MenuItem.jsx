import * as React from "react";
import { Link } from "react-router-dom";

export default function MenuItem(props) {
  if (props.onClick) {
    return (
      <li style={{ marginTop: 15 }}>
        <a onClick={props.onClick}>
          {props.icon}
          <span>{props.label}</span>
        </a>
      </li>
    );
  }

  return (
    <li style={{ marginTop: 15 }}>
      <Link to={"/" + props.link}>
        {props.icon}
        <span>{props.label}</span>
      </Link>
    </li>
  );
}
