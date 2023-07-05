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
        <InfiniteScroll height="calc(100vh)">
            <ReactMarkdown>{fileContent}</ReactMarkdown>
        </InfiniteScroll>

    )
}

export default ReleaseNotes;