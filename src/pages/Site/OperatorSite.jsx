import NavBarOperator from "../../components/NavBar/NavBarOperator";
import "./Site.css";
import { Outlet } from "react-router-dom";

const OperatorSite = ({ onLogOut }) => {
    return (
        <>
            <div className="content">
                <NavBarOperator onLogOut={onLogOut} />
                <Outlet />
            </div>
        </>
    );
}

export default OperatorSite;