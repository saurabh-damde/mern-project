import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import Button from "../FormElements/Button";
import "./NavLinks.css";

const NavLinks = (props) => {
  const { userId, isLoggedIn, switchLoginState } = useContext(AuthContext);
  const onLogout = () => {
    switchLoginState({ command: "Logout" });
  };
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>{" "}
      </li>
      {isLoggedIn && (
        <>
          {" "}
          <li>
            <NavLink to={`/${userId}/places`}>My Places</NavLink>{" "}
          </li>
          <li>
            <NavLink to="/places/new">Add Place</NavLink>{" "}
          </li>
        </>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>{" "}
        </li>
      )}
      {isLoggedIn && (
        <li>
          <Button onClick={onLogout}>Logout</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
