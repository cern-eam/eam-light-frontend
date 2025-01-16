import * as React from "react";
import { Link } from "react-router-dom";
import FSearchHighlighter from "./FSearchHighlighter";

export default FSearchHighlighter;
class SearchHighlighter extends React.Component {
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
