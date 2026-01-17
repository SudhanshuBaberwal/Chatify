import axios from "axios";
import { useEffect } from "react";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/current", {
          withCredentials: true,
        });
        dispatch(setUserData(res.data));
      } catch {
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, []);
};
export default useGetCurrentUser;
