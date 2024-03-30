import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";
import Button from "../FormElements/Button";

const NavLinks = (props) => {
  const { isLoggedIn, switchLoginState } = useContext(AuthContext);
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
            <NavLink to="/u1/places">My Places</NavLink>{" "}
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
          <Button onClick={switchLoginState}>Logout</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
