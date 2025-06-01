"use client";
import Loader from "@/components/Loader";
import { GroupOutlined } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const GroupInfo = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState(null);
  const { chatId } = useParams();
  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setChat(data);
      setLoading(false);
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto,
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const uploadPhoto = (result) => {
    setValue("groupPhoto", result.info?.secure_url);
  };

  const router = useRouter();

  const updateGroupInfo = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (res.ok) {
        router.push(`/chats/${chatId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Group Info</h1>
      <form className="edit-profile" onSubmit={handleSubmit(updateGroupInfo)}>
        <div className="input">
          <input
            {...register("name", {
              required: "Group name is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Group name must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Group name"
            className="input-field"
          />
          <GroupOutlined sx={{ color: "#737373" }} />
        </div>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        <div className="flex items-center justify-between gap-8">
          <img
            src={watch("groupPhoto") || chat?.groupPhoto || "/assets/group.png"}
            alt="group"
            className="w-40 h-40 rounded-full object-cover object-center"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={uploadPhoto}
            uploadPreset="aysr3fne"
          >
            <p className="btn">Change Group Photo</p>
          </CldUploadButton>
        </div>

        <div className="flex flex-wrap gap-3">
          {chat?.members?.map((member, index) => (
            <p className="selected-contact" key={index}>
              {member.username}
            </p>
          ))}
        </div>
        <button className="btn" type="submit">
          Update Group Info
        </button>
      </form>
    </div>
  );
};

export default GroupInfo;
