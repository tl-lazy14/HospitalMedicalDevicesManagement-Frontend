import NavBarAdmin from "../../components/NavBar/NavBarAdmin";
import "./Site.css";
import { Outlet } from "react-router-dom";

const AdminSite = ({ onLogOut }) => {
    return (
        <>
            <div className="content">
                <NavBarAdmin onLogOut={onLogOut} />
                <Outlet />
            </div>
        </>
    );
}

export default AdminSite;