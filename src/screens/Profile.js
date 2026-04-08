import React, { useContext } from "react";
import Screen from "../components/Screen";
import AuthContext from "../auth/context";
import ProfileCard from "../components/ProfileCard";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <Screen className="flex-1 p-2 flex gap-5">
      <ProfileCard data={user} />
    </Screen>
  );
};

export default Profile;
