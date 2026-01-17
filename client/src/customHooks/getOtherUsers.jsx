import axios from "axios";
import { useEffect } from "react";
import { setOtherUsers, setUserData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

const getOtherUsers = () => {
  let dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/others", {
          withCredentials: true,
        });
        dispatch(setOtherUsers(res.data));
      } catch {
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, []);
};
export default getOtherUsers;
