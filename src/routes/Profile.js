import { authService, dbService } from "fbase";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyNweets = async() => {
    const nweets = await dbService.collection("nweets").where("creatorId", "==", userObj.uid);
  };

  useEffect(() => {}, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
}

export default Profile;