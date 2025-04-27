import React, { useState, useEffect } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { collection, getDocs, doc, updateDoc, deleteDoc, db } from "../firebaseConfig.js";
import Loader from "../Components/Loader.jsx";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({});


  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleEdit = (user) => {
    setSelectedUser(user.id);
    setEditData({
      displayName: user.displayName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    setIsModalOpen(true);
  };
  const handleDelete = async (user) => {
    try {
      const userRef = doc(db, "users", user.id);
      await deleteDoc(userRef);


      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));

      console.log(`User ${user.displayName} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, "users", selectedUser);
      await updateDoc(userRef, editData);
      console.log("User updated successfully!");

      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="w-full h-full p-20 overflow-x-auto">
      <table className="min-w-full divide-y-2 divide-gray-200">
        <thead>
          <tr className="*:font-medium *:text-white">
            <th className="px-3 py-2 whitespace-nowrap text-left text-xl ">S.No#</th>
            <th className="px-3 py-2 whitespace-nowrap text-left text-xl ">Name</th>
            <th className="px-3 py-2 whitespace-nowrap text-left text-xl ">Email</th>
            <th className="px-3 py-2 whitespace-nowrap text-left text-xl ">Role</th>
            <th className="px-3 py-2 whitespace-nowrap text-left text-xl ">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users ? (users.map((user, index) => (
            <tr key={user.id} className=" dark:hover:bg-gray-700">
              <td className="px-3 py-2 whitespace-nowrap">{index + 1}</td>
              <td className="px-3 py-2 whitespace-nowrap">{user.displayName}</td>
              <td className="px-3 py-2 whitespace-nowrap">{user.email}</td>
              <td className="px-3 py-2 whitespace-nowrap">{user.isAdmin ? "Admin" : "User"}</td>
              <td className="px-3 py-2 whitespace-nowrap flex">
                <IconEdit
                  onClick={() => handleEdit(user)}
                  className="h-5 w-5 text-blue-500 cursor-pointer"
                />
                <IconTrash onClick={() => handleDelete(user)} className="h-5 w-5 text-red-500 cursor-pointer ml-4" />
              </td>
            </tr>
          ))) :
            <div className="w-full h-full flex flex-col justify-center items-center">
              <Loader />
            </div>}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={editData.displayName}
                onChange={(e) =>
                  setEditData({ ...editData, displayName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border p-2 rounded"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
