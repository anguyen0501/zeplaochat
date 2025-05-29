"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session } = useSession();

  const currentUser = session?.user;

  const getContacts = async () => {
    try {
      const res = await fetch(
        searchQuery !== ""
          ? `/api/users/searchContact/${searchQuery}`
          : "/api/users"
      );
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

  /* SELECT CONTACTS */
  const [selectedContacts, setSelectedContacts] = useState([]);
  const isGroup = selectedContacts.length > 1;

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };
  /* ADD GROUP CHAT NAME */
  const [groupChatName, setGroupChatName] = useState("");
  const router = useRouter();
  /* CREATE GROUP CHAT */
  const createChat = async () => {
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentUserId: currentUser._id,
          members: selectedContacts.map((contact) => contact._id),
          isGroup,
          name: isGroup ? groupChatName : "",
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.chat) {
        router.push(`/chats/${data.chat._id}`);
      } else {
        console.error('Failed to create chat:', data.message);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };
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
          <div className="flex flex-col flex-1 gap-5 overflow-y-scroll custom-scrollbar">
          {contacts.map((user, index) => (
            <div
              key={index}
              className="contact"
              onClick={() => handleSelect(user)}
            >
              {selectedContacts.find((item) => item === user) ? (
                <CheckCircle sx={{ color: "#007bff" }} />
              ) : (
                <RadioButtonUnchecked />
              )}
              <img
                src={user.profileImage || "/assets/person.jpg"}
                alt="profile"
                className="profilePhoto"
              />
              <p className="text-base-bold">{user.username}</p>
            </div>
          ))}
          </div>
        </div>
        <div className="create-chat">
          {isGroup && (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Group Chat Name</p>
                <input
                  type="text"
                  placeholder="Group chat name"
                  className="input-group-name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <button
            className="btn"
            onClick={createChat}
            disabled={selectedContacts.length === 0}
          >
            FIND OR START A NEW CHAT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
