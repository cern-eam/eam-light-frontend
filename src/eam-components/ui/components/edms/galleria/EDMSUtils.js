import plus from './img/plus.png';

export default function getEDMSFileUrl(document) {
    if (undefined === document.edmsId)
        return plus;
    //Real URL
    return `${process.env.REACT_APP_BACKEND}/edms/file?edmsid=${document.edmsId}&version=${document.version}&filename=${document.fileName}&filetype=${document.fileType}&convertedname=${document.convertedName}`;
}