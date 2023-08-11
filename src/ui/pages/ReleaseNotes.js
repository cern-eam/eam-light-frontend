import React from "react";
import releaseNotesFile from "../../CHANGELOG.md";
import ReleaseNotes from "eam-components/dist/ui/components/releasenotes/ReleaseNotes";

const ReleaseNotesContainer = () => {
  if (releaseNotesFile) {
    return <ReleaseNotes file={releaseNotesFile} />;
  } else {
    return <h1>Release notes not available</h1>;
  }
};

export default ReleaseNotesContainer;
