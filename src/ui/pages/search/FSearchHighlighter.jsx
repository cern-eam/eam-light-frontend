import * as React from "react";
import { Link } from "react-router-dom";

const replace = (text, keyword) =>
  !text ? "" : text.replace(keyword, "<mark>" + keyword + "</mark>");

function FSearchHighlighter(props) {
  return !!props.link ? (
    <Link to={{ pathname: props.link }}>
      <span
        dangerouslySetInnerHTML={{
          __html: replace(props.data, props.keyword.toUpperCase()),
        }}
        style={props.style}
      />
    </Link>
  ) : (
    <td
      dangerouslySetInnerHTML={{
        __html: replace(props.data, props.keyword.toUpperCase()),
      }}
      style={props.style}
    ></td>
  );
}

export default FSearchHighlighter;
