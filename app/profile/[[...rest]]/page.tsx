import { UserProfile } from '@clerk/nextjs';

const ProfilePage = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <UserProfile />
      </div>
    </>
  );
};

export default ProfilePage;