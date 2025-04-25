import queryString from "query-string";
import { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import { getEquipmentType } from "../../../tools/WSEquipment";
import InfoPage from "../../components/infopage/InfoPage";
import { useParams } from "react-router-dom";

/**
 * This component will handle the redirection to the proper equipment page, according to the type of equipment
 */
function EquipmentRedirect(props) {
    const { code } = useParams();

    let blockUiStyle = {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    let blockUiStyleDiv = {
        display: "flex",
        height: 60,
        alignItems: "flex-end",
    };

    let [isLoading, setIsLoading] = useState(true);
    let [isValidCode, setIsValidCode] = useState(false);

    useEffect(() => {
        loadEquipmentData(code);
    }, [code]);

    let loadEquipmentData = (code) => {
        if (code) {
            code = decodeURIComponent(code);

            setIsLoading(true);
            //Fetch the equipment
            getEquipmentType(code)
                .then((response) => {
                    //Valid code
                    setIsLoading(false);
                    setIsValidCode(true);
                    //Redirect according to the typeCode
                    switch (response) {
                        case "A":
                            props.history.replace(`/asset/${code}`);
                            break;
                        case "N":
                            props.history.replace(`/ncr/${code}`);
                            break;
                        case "P":
                            props.history.replace(`/position/${code}`);
                            break;
                        case "S":
                            props.history.replace(`/system/${code}`);
                            break;
                        case "L":
                            props.history.replace(`/location/${code}`);
                            break;
                        default: /*Not supported*/
                            setIsValidCode(false);
                    }
                })
                .catch((error) => {
                    //Not valid code
                    setIsLoading(false);
                    setIsValidCode(false);
                });
        } else {
            //There is not valid code
            setIsLoading(false);
            setIsValidCode(false);
        }
    };

    if (isLoading) {
        return (
            <BlockUi tag="div" blocking={true} style={blockUiStyle}>
                <div style={blockUiStyleDiv}>Loading Equipment ...</div>
            </BlockUi>
        );
    }

    //Check if it is a valid code
    if (!isValidCode) {
        return (
            <InfoPage
                title="Invalid Equipment"
                message="The provided code is not a valid Equipment. [Asset, Position, System, Location]"
            />
        );
    }

    //Valid code
    return <div />;
}

export default EquipmentRedirect;
