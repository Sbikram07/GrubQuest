"use client";

import Navbar1 from "@/components/Navbar1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    user,
    logout,
    isLoggedIn,
    getMe,
    updateProfile,
    changePassword,
    deleteProfile,
    updateRoleToAgent,
  } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);



  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const openDashboard = () => {
    if (user?.role === "restaurantOwner") {
      navigate("/dashboard");
    } else if (user?.role === "deliveryAgent") {
      navigate("/dashboardAgent");
    } else {
      // If user wants to become a delivery agent
      updateRoleToAgent();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!user?._id) return;

   const success = await updateProfile({
     id: user._id,
     name: profile.name,
    phone:profile.phone,
    address:profile.address,
     avatar: profile.avatar,
   });


    if (success) {
      getMe(); // Refresh user data
    }
  };

  const handleChangePassword = async () => {
    if (!user?._id) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const success = await changePassword({
      id: user._id,
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });

    if (success) {
      setShowPasswordDialog(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleDeleteProfile = async () => {
    if (!user?._id) return;

    const success = await deleteProfile(user._id);
    if (success) {
      navigate("/");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar1 />
        <div className="max-w-6xl mx-auto p-4 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar1 />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-10 mt-6">
        {/* Left Section: Profile Photo + Basic Info */}
        <div className="flex flex-col items-center w-full md:w-1/3 space-y-4">
          {/* <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600 overflow-hidden"> */}

          <div className="relative w-40 h-40">
            {/* Profile Image in circular container */}
            <div className="w-full h-full rounded-full overflow-hidden border border-gray-300 shadow-sm">
              <img
                src={user.avatar?.url}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://res.cloudinary.com/dhiv7nn03/image/upload/v1753718550/GrubQuest/restaurants/rryvhejlcq826gpoklv0.jpg";
                }}
              />
            </div>

            {/* Floating control OUTSIDE the clipped div */}
            <div className="absolute -bottom-1 -right-2 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full shadow-md z-10">
              <label
                htmlFor="avatar-upload"
                className="text-xs font-medium text-gray-700 cursor-pointer"
              >
                Change
              </label>
              <button
                type="button"
                onClick={() => document.getElementById("avatar-upload").click()}
                className="bg-gray-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-600"
                title="Add Photo"
              >
                +
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setProfile({ ...profile, avatar: e.target.files[0] })
              }
            />
          </div>

          {/* </div> */}
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold">
              Name: {profile.name || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Email: {profile.email || "N/A"}
            </p>
            <p className="text-sm text-gray-600">Role: {user.role || "user"}</p>
          </div>

          {/* Side Buttons */}
          <div className="flex flex-col gap-2 mt-4 w-full">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(true)}
            >
              Change Password
            </Button>

            <Button variant="outline" onClick={openDashboard}>
              {user.role === "restaurantOwner"
                ? "Restaurant Dashboard"
                : user.role === "deliveryAgent"
                ? "Agent Dashboard"
                : "Become Delivery Agent"}
            </Button>

            <Button variant="outline" onClick={() => navigate("/orders")}>
              My Orders
            </Button>

            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>

        {/* Right Section: Edit Profile */}
        <div className="w-full md:w-2/3 bg-white p-6 shadow rounded-md">
          <h2 className="text-lg font-semibold mb-4">Basic Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Name</label>
              <Input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Phone No</label>
              <Input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Address</label>
              <Input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <Input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                disabled
              />
            </div>
            <div className="text-right">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              name="oldPassword"
              placeholder="Current Password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPasswordDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleChangePassword}>Change Password</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteProfile}>
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
