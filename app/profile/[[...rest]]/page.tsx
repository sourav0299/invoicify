// import { useUserCheck } from '@/helper/useUserCheck';
import { UserProfile } from '@clerk/nextjs';

const ProfilePage = () => {
  // useUserCheck()
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <UserProfile />
      </div>
    </>
  );
};

export default ProfilePage;