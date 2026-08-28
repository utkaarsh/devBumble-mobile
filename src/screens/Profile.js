import React, { useContext, useState } from "react";
import Screen from "../components/Screen";
import AuthContext from "../auth/context";
import ProfileCard from "../components/ProfileCard";
import EditProfile from "../components/EditProfile";
import { Text, TouchableOpacity } from "react-native";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editProfile, setEditProfile] = useState(false);
  const handleEdit = () => {
    setEditProfile(!editProfile);
  };
  return (
    <Screen className=" p-2 flex gap-2">
      {!editProfile && (
        <TouchableOpacity
          onPress={() => handleEdit()}
          className="w-48 self-center h-12 mt-4 bg-[#15191E] border border-gray-700 flex-row justify-center mx-2 rounded-lg items-center "
        >
          <Text className="text-center text-white text-lg">Edit Profile</Text>
        </TouchableOpacity>
      )}
      {!editProfile ? (
        <ProfileCard data={user} />
      ) : (
        <EditProfile user={user} handleEdit={handleEdit} setUser={setUser} />
      )}
    </Screen>
  );
};

export default Profile;
