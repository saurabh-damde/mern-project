import UsersList from "../components/UsersList";

const USERS = [
  {
    id: "u1",
    name: "Saurabh",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwBurF-FWZFSKqQTmCwhBEv8RFAQXg8oCkckda367Y0w&s",
    places: 3,
  },
  {
    id: "u2",
    name: "Saurabh",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwBurF-FWZFSKqQTmCwhBEv8RFAQXg8oCkckda367Y0w&s",
    places: 2,
  },
];

const Users = () => {
  return <UsersList items={USERS} />;
};

export default Users;
