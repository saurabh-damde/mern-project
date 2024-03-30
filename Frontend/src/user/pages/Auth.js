import { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./Auth.css";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = (props) => {
  const { switchLoginState } = useContext(AuthContext);
  const initialInputs = {
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  };

  const [formState, inputChangeHandler, setFormData] = useForm(
    initialInputs,
    false
  );
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { email, password } = formState.inputs;

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, username: undefined },
        email.isValid && password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((curr) => !curr);
  };

  const authHandler = (event) => {
    event.preventDefault();
    switchLoginState();
    console.log(formState); //send to server...
  };

  return (
    <Card className="authentication">
      <h2 className="authentication__header">Login Required</h2>
      <form onSubmit={authHandler}>
        {!isLoginMode && (
          <Input
            id="username"
            element="input"
            type="text"
            label="Username"
            value={email.value}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid Username..."
            onChange={inputChangeHandler}
          />
        )}
        <Input
          id="email"
          element="input"
          type="email"
          label="E-Mail"
          value={email.value}
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid E-Mail ID..."
          onChange={inputChangeHandler}
        />
        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          value={password.value}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid Password..."
          onChange={inputChangeHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {`${isLoginMode ? "Login" : "Register"}`}
        </Button>
      </form>
      <Button onClick={switchModeHandler} inverse>{`${
        !isLoginMode ? "Switch to Login" : "Switch to Register"
      }`}</Button>
    </Card>
  );
};

export default Auth;
