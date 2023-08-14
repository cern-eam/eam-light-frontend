import React from "react";
import releaseNotesFile from "../../../CHANGELOG.md";
import ReleaseNotes from "eam-components/dist/ui/components/releasenotes/ReleaseNotes";

const ReleaseNotesPage = () => {
    return <ReleaseNotes file={releaseNotesFile} />;
};

export default ReleaseNotesPage;
