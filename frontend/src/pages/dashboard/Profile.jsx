import ChangeInfo from "../../components/ChangeInfo";
import ChangePassword from "../../components/ChangePassword";

const ProfileScreen = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile information</p>
      </div>
      <div className="border-t border-gray-200 my-6"></div>
      <ChangeInfo />
      <div className="border-t border-gray-200 my-6"></div>
      <ChangePassword />
    </div>
  );
};

export default ProfileScreen;
