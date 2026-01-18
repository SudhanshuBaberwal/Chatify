// import axios from "axios";
// import { useEffect } from "react";
// import { setUserData } from "../redux/userSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { setMessages } from "../redux/message.Slice";

// const getMessages = () => {
//   const dispatch = useDispatch();
//   const { userData, selectedUser } = useSelector((state) => state.user);
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:3000/api/message/get/${selectedUser._id}`,
//           {
//             withCredentials: true,
//           },
//         );
//         dispatch(setMessages(res.data));
//       } catch (error) {
//         console.log(error)
//       }
//     };

//     fetchMessages();
//   }, [selectedUser,userData]);
// };
// export default getMessages;
