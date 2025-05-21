"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { RadioButtonUnchecked } from "@mui/icons-material";

const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session } = useSession();

  const currentUser = session?.user;

  const getContacts = async () => {
    try {
      const res = await fetch(searchQuery !== "" ? `/api/users/searchContact/${searchQuery}` : "/api/users");
      const data = await res.json();
      setContacts(data.filter((user) => user._id !== currentUser._id));
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getContacts();
    }
  }, [currentUser, searchQuery]);
  return loading ? (
    <Loader />
  ) : (
    <div className="create-chat-container">
      <input
        placeholder="Search contact..."
        className="input-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="contact-bar">
        <div className="contact-list">
          <p className="text-body-bold">Select or Deselect</p>
          {contacts.map((user, index) => (
            <div key={index} className="contact">
              <RadioButtonUnchecked />
              <img
                src={user.profileImage || "/assets/person.jpg"}
                alt="profile"
                className="profilePhoto"
              />
              <p className="text-base-bold">{user.username}</p>
            </div>
          ))}
        </div>
        <div className="create-chat">
          <button className="btn">START A NEW CHAT</button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
