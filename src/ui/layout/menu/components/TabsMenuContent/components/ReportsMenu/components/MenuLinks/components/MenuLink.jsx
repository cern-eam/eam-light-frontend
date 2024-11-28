import { Link } from "react-router-dom";
import withStyles from "@mui/styles/withStyles";

const styles = {
    span: {
        display: "inline",
        fontSize: 13,
        marginTop: 5,
        paddingLeft: 5,
    },
    link: {
        textAlign: "left",
        marginTop: 5,
    },
};

const MenuLink = ({ description, link, classes }) => {
    return (
        <li>
            <Link to={link} className={classes.link}>
                <span className={classes.span}>{description}</span>
            </Link>
        </li>
    );
};

const StyledMenuLink = withStyles(styles)(MenuLink);

export default StyledMenuLink;
