import React, {useEffect, useState} from 'react';
import ReactMarkdown from "react-markdown";
import releaseNotesFile from '../../CHANGELOG.md';
import InfiniteScroll from 'react-infinite-scroll-component';

const ReleaseNotes = () => {

    const [fileContent, setFileContent] = useState("");

    useEffect(() => {
        fetch(releaseNotesFile)
            .then(response => response.text())
            .then(text => setFileContent(text))
            .catch(e => console.log(e))
    })


    return (
      <div style={{ marginLeft: 20, height: "100%", overflow: "auto" }}>
        <InfiniteScroll height="100%">
          <ReactMarkdown>{fileContent}</ReactMarkdown>
        </InfiniteScroll>
      </div>
    );
}

export default ReleaseNotes;