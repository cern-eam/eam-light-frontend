import * as React from "react";
import { Link } from "react-router-dom";

const replace = (text, keyword) =>
  !text ? "" : text.replace(keyword, "<mark>" + keyword + "</mark>");

function SearchHighlighter({ link, keyword = "", style, data }) {
  return link ? (
    <Link to={{ pathname: link }}>
      <span
        dangerouslySetInnerHTML={{
          __html: replace(data, keyword.toUpperCase()),
        }}
        style={style}
      />
    </Link>
  ) : (
    <td
      dangerouslySetInnerHTML={{
        __html: replace(data, keyword.toUpperCase()),
      }}
      style={style}
    ></td>
  );
}

export default SearchHighlighter;
