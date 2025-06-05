import { Link } from "react-router-dom";
import BellIcon from "mdi-material-ui/Bell";
import { format } from "date-fns";
import useWorkOrderStore from "@/state/useWorkOrderStore";

const WorkorderMenu = ({ wo }) => {
    const { currentWorkOrder } = useWorkOrderStore();

    const spanStyle = {
        display: "block",
        fontSize: 13,
        marginTop: 5,
    };

    const iconColors = {
        Haute: "red",
        Moyenne: "orange",
        Basse: "green",
    };

    const iconStyle = {
        width: 18,
        height: 18,
        color: iconColors[wo.priority] ? iconColors[wo.priority] : "green",
    };

    const linkStyle = {
        textAlign: "left",
        marginTop: 5,
    };

    if (wo.number === currentWorkOrder) {
        linkStyle.borderLeft = "3px solid #00aaff";
    } else {
        linkStyle.borderLeft = "3px solid rgb(40,40,40)";
    }

    if (wo.labourScheduledDate) {
        linkStyle.backgroundColor = "#575757";
    }

    return (
        <li>
            <Link to={"/workorder/" + wo.number + "%23" + wo.org} style={linkStyle}>
                <BellIcon style={iconStyle} />
                <span
                    style={{ ...spanStyle, display: "inline", paddingLeft: 5 }}
                >
                    {wo.number}
                </span>
                <span style={{ ...spanStyle, color: "#ffffff" }}>
                    {wo.desc}
                </span>
                <span style={spanStyle}>Eqp.: {wo.object}</span>
                <span style={spanStyle}>Department: {wo.mrc}</span>
                {wo.schedulingEndDate && (
                    <span style={spanStyle}>
                        Scheduled End:{" "}
                        {format(new Date(wo.schedulingEndDate), "dd-MMM-yyyy")}
                    </span>
                )}
                {wo.labourScheduledDate && (
                    <span style={{...spanStyle, fontWeight: 900, color: "white"}}>
                        Scheduled Labour:{" "}
                        {format(new Date(wo.labourScheduledDate), "dd-MMM-yyyy")}
                    </span>
                )}
            </Link>
        </li>
    );
};

export default WorkorderMenu;
