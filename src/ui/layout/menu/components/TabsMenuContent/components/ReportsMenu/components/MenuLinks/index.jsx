import MenuLink from "./components/MenuLink";

const MenuLinks = ({ menusMetaData }) => {
    return menusMetaData?.map((metadata) => {
        if (["WEBD"].includes(metadata.classcode)) {
            const code = metadata.screencode;
            const link = "/grid?gridName=" + code;
            return (
                <MenuLink
                    description={metadata.screendescription}
                    link={link}
                    key={code}
                />
            );
        } else if (metadata.classcode === "WEB") {
            const link = "/report?url=" + metadata.urlpath;
            return (
                <MenuLink
                    description={metadata.screendescription}
                    link={link}
                    key={metadata.screencode}
                />
            );
        }
    });
};

export default MenuLinks;
