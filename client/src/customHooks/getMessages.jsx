import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/message.Slice";

const getMessages = () => {
  let dispatch = useDispatch();
  let { userData, selectedUsers } = useSelector((state) => state.user);
  let {messages} = useSelector(state => state.message)
  // console.log(selectedUsers);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!selectedUsers?._id) return;
        const res = await axios.get(
          `http://localhost:3000/api/message/get/${selectedUsers._id}`,
          {
            withCredentials: true,
          },
        );
        console.log(res);
        dispatch(
          setMessages(
            Array.isArray(res.data.messages) ? res.data.messages : [],
          ),
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedUsers, userData , messages]);
};
export default getMessages;
