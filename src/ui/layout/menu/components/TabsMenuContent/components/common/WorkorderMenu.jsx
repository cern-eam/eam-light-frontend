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

    return (
        <li>
            <Link to={"/workorder/" + wo.number} style={linkStyle}>
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
            </Link>
        </li>
    );
};

export default WorkorderMenu;