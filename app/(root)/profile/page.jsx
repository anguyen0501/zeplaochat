"use client";
import Loader from "@/components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);
  }, [user]);
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const uploadPhoto = (result) => {
    setValue("profileImage", result.info?.secure_url);
  };
  const updateUser = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      });
      setLoading(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>
      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div className="input">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
        <div className="flex items-center justify-between gap-8">
          <img
            src={
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/person.jpg"
            }
            alt="user"
            className="w-40 h-40 rounded-full object-cover object-center"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={uploadPhoto}
            uploadPreset="aysr3fne"
          >
            <p className="btn">Change Profile Photo</p>
          </CldUploadButton>
        </div>
        <button className="btn" type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
