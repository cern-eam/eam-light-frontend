import React from "react";
import ReleaseNotes from "eam-components/dist/ui/components/releasenotes/ReleaseNotes";

const ReleaseNotesContainer = () => {
  try {
    return <ReleaseNotes file={require("../../CHANGELOG.md").default} />;
  }
  catch (e) {
    return <h1>Release notes not available</h1>;
  }
};

export default ReleaseNotesContainer;
