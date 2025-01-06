"use client"
import React, {useState, useEffect} from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";

const UserDetails = () => {
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
      if (user) {
          setFirstName(user?.firstName ?? "");
          setLastName(user?.lastName ?? "");
          setEmail(user?.primaryEmailAddress?.emailAddress ?? "");
          setImageUrl(user?.imageUrl ?? "");
      }
    }, [user]);

  return (
    <div className=" bg-universal_gray_background pb-10 h-full">
      <div className="px-6 gap-3">
        <div className="py-6 gap-1">
          <div className="text-3xl font-semibold text-business_settings_black_text">
            User Details
          </div>
          <div className="text-lg font-medium text-business_settings_gray_text">
            An Overview of all your transactions over the year.
          </div>
        </div>
        <div className="rounded-lg bg-universal_white_background flex flex-col p-6 h-auto gap-4">
          <div className="flex gap-6">
            <div className="flex items-center justify-center w-full max-w-[260px]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="User profile"
                  width={160}
                  height={160}
                  className="rounded-full"
                />
              ) : (
                <div className="cursor-pointer flex flex-col items-center justify-center w-[160px] h-[160px] rounded-full border-dashed border border-business_settings_gray_border">
                  <div className="text-xs font-medium text-sidebar_green_button_background">
                    + Upload Image
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col w-full gap-6">
              <div className="flex w-full gap-3">
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    First Name
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    Last Name
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-full gap-3">
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    E-mail
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    Mobile Number
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1 max-w-[607px]">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Password
              </div>
              <input
                type="password"
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                value={"12345678999999999"}
                readOnly
              />
            </div>
            <div className="w-full flex items-center justify-center max-w-[271px]">
              <button
                className="w-full text-sm font-semibold bg-change_password_green_background text-sidebar_green_button_background border border-sidebar_green_button_background rounded py-1 px-2"
                onClick={() => openUserProfile()}
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="bg-universal_white_background px-4 h-10 py-[10px] border flex items-center justify-center rounded-lg w-full max-w-[190px]">
              Cancel
            </button>
            <button className="bg-sidebar_green_button_background h-10 text-universal_white_background px-4 py-[10px] flex items-center justify-center rounded-lg w-full max-w-[190px] focus:outline-none">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
