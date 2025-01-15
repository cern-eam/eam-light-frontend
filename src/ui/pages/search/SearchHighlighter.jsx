import * as React from "react";
import { Link } from "react-router-dom";

export default class SearchHighlighter extends React.Component {
  render() {
    return !!this.props.link ? (
      <Link to={{ pathname: this.props.link }}>
        <span
          dangerouslySetInnerHTML={{
            __html: this.replace(
              this.props.data,
              this.props.keyword.toUpperCase()
            ),
          }}
          style={this.props.style}
        />
      </Link>
    ) : (
      <td
        dangerouslySetInnerHTML={{
          __html: this.replace(
            this.props.data,
            this.props.keyword.toUpperCase()
          ),
        }}
        style={this.props.style}
      ></td>
    );
  }

  replace(text, keyword) {
    if (!text) {
      return "";
    }
    return text.replace(keyword, "<mark>" + keyword + "</mark>");
  }
}

const replace = (text, keyword) =>
  !text ? "" : text.replace(keyword, "<mark>" + keyword + "</mark>");

export function FSearchHighlighter(props) {
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
