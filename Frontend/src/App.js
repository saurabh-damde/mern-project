import { useCallback, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import Auth from "./user/pages/Auth";
import Users from "./user/pages/Users";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const changeLoginState = useCallback(() => {
    setIsLoggedIn((curr) => !curr);
  }, []);

  let routes;
  if (isLoggedIn) {
    routes = (
      <>
        <Route path="/" element={<Users />} exact />
        <Route path="/:userId/places" element={<UserPlaces />} exact />
        <Route path="/places/new" element={<NewPlace />} exact />
        <Route path="/places/:placeId" element={<UpdatePlace />} exact />
        <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  } else {
    routes = (
      <>
        <Route path="/" element={<Users />} exact />
        <Route path="/auth" element={<Auth />} exact />
        <Route path="/:userId/places" element={<UserPlaces />} exact />
        <Route path="*" element={<Navigate to="/auth" />} />
      </>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, switchLoginState: changeLoginState }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Routes>{routes}</Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
