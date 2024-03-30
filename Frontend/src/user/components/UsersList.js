import Card from "../../shared/components/UIElements/Card";
import UsersItem from "./UserItem";
import "./UsersList.css";

const UsersList = (props) => {
  const { items } = props;
  if (items.length === 0) {
    return (
      <Card className="center">
        <h2>No Users Found!</h2>
      </Card>
    );
  } else {
    return (
      <ul className="users-list">
        {items.map((user) => (
          <UsersItem key={user.id} user={user} />
        ))}
      </ul>
    );
  }
};

export default UsersList;
