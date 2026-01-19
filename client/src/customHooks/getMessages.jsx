import axios from "axios";
import { useEffect } from "react";
import { setUserData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/message.Slice";

const getMessages = () => {
  let dispatch = useDispatch();
  let userData = useSelector((state) => state.user.userData)
  let selectedUser = useSelector((state) => state.user.selectedUser)
  // console.log(selectedUser)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!selectedUser?._id) return;
        const res = await axios.get(
          `http://localhost:3000/api/message/get/${selectedUser._id}`,
          {
            withCredentials: true,
          },
        );
        dispatch(setMessages(res.data));
      } catch (error) {
        console.log(error)
      }
    };

    fetchMessages();
  }, [selectedUser,userData]);
};
export default getMessages;
