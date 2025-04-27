import { IconSearch, IconChevronDown } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, db, auth, query, where ,doc, deleteDoc, updateDoc} from "../firebaseConfig.js";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

const UserBlog = () => {
    const [userBlogs, setUserBlogs] = useState([]); // All blogs with user data
    const [myBlogs, setMyBlogs] = useState([]); // Current user's blogs
    // eslint-disable-next-line
    const [category, setCategory] = useState("All")
    const searchRef = useRef(null); // For search functionality
  
    // Fetch data from Firestore
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch all blogs from `userBlog` collection
          const blogSnapshot = await getDocs(collection(db, "userBlog"));
          const blogs = blogSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          // Fetch user data for each blog and merge it
          const userDataPromises = blogs.map(async (blog) => {
            const userQuery = query(
              collection(db, "users"),
              where("id", "==", blog.id) 
            );
            const userSnapshot = await getDocs(userQuery);
            const user = userSnapshot.docs.map((doc) => doc.data())[0];
            return {
              ...blog,
              displayName: user?.displayName || "Anonymous",
              photoURL: user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
            };
          });
  
          // Resolve all promises and set data
          const blogsWithUserData = await Promise.all(userDataPromises);
          setUserBlogs(blogsWithUserData);
  
          // Filter current user's blogs
          const currentUserBlogs = blogsWithUserData.filter(
            (blog) => blog.id === auth.currentUser.uid
          );
          setMyBlogs(currentUserBlogs);
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      };
  
      fetchData();
    }, []);
  
    // Search functionality
    const handleSearch = () => {
      const searchValue = searchRef.current.value.toLowerCase();
      const filteredBlogs = userBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchValue)
      );
      setUserBlogs(filteredBlogs);
    };
  
    // Handle category filter
    const handleCategoryChange = (selectedCategory) => {
      setCategory(selectedCategory);
      if (selectedCategory === "All") {
        setUserBlogs(userBlogs); // Show all blogs if "All" is selected
      } else {
        const filteredBlogs = userBlogs.filter(
          (blog) => blog.category === selectedCategory
        );
        setUserBlogs(filteredBlogs);
      }
    };
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    
    const handleEdit = (blog) => {
      setCurrentCard(blog);
      setEditedTitle(blog.title);
      setEditedDescription(blog.description);
      setModalOpen(true);
    };
  
    const handleEditSave = async () => {
      
      if (currentCard) {
        try {
          await updateDoc(doc(db, "userBlog", currentCard.id), {
            title: editedTitle,
            description: editedDescription,
          });
          console.log("Card updated successfully!");
        } catch (error) {
          console.error("Error updating card:", error);
        }
        setModalOpen(false);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await deleteDoc(doc(db, "userBlog", id));
        console.log("Card deleted successfully!");
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    };
    
    return (
      <section className="w-full h-full px-4 py-24 mx-auto max-w-7xl">
        <h2 className="mb-2 text-4xl font-[ZCOOL] text-center xl:text-left font-extrabold leading-tight text-white">
          Beyond Horizon
        </h2>
        <div className="grid xl:flex justify-center xl:justify-between items-center">
          <p className="mb-20 text-lg text-gray-500">
            Comes directly from the deep thoughts of Beyond Horizon.
          </p>
  
          {/* Search Bar */}
          <div className="relative w-full xl:w-1/3 mb-10 flex gap-6">
                                <IconSearch className='absolute left-3 top-2 text-gray-400' />
                                <input ref={searchRef} onInput={handleSearch} className="w-full rounded focus:outline-0 p-1.5 border pl-13" type="text" placeholder="Search Blog ..." />
                                {/* category wise filtration */}
                                <Menu as="div" className="relative inline-block text-left" focus:outline-hidden>
                                    <div>
                                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                                            Options
                                            <IconChevronDown aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                                        </MenuButton>
                                    </div>
            
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                    >
                                        <div className="py-1">
                                        {[...new Set(userBlogs.map(({ category }) => category))].map((category, index) => (
                                            <MenuItem key={index + "category"} className="text-gray-900 hover:bg-gray-100 hover:text-gray-900 group flex rounded-md items-center px-2 py-2 text-sm">
                                                <span onClick={() => handleCategoryChange(category)}
                                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                                >
                                                    {category}
                                                </span>
                                            </MenuItem>
                                        ))}
                                                
            
                                        </div>
                                    </MenuItems>
                                </Menu>
          </div>
        </div>
  
        {/* All Blogs Section */}
        <div className="grid items-center justify-center grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {userBlogs.map(
            //eslint-disable- next-line
            ({  title, description, category, imageFile, displayName, photoURL, timestamp }) => (
              <div key={title + "otherUserBlogs"} className="relative border-2 border-gray-300 rounded-lg p-2">
                {/* Blog Image */}
                <img
                  src={imageFile}
                  className="object-cover w-full h-56 mb-5 bg-center rounded"
                  alt="blog"
                />
  
                {/* Blog Details */}
                <h2 className="mb-2 text-lg font-semibold text-white">{title}</h2>
                <p className="my-3 text-white">
                  Category: <span className="text-xs">{category}</span>
                </p>
                <p className="mb-3 text-sm font-normal text-gray-300">
                  {description.slice(0, 290)}...
                </p>
  
                {/* User Info */}
                <p className="absolute -top-5 -left-5 group flex gap-2 items-center text-white mx-2">
                  <img
                    className="h-13 w-13 z-10 rounded-full border-4 object-cover border-[#b68d40]"
                    src={photoURL}
                    alt="userImage"
                  />
                  <span className="grid transition-transform transform -translate-x-10 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 duration-500 ease bg-white text-black border border-gray-600 p-2 rounded">
                    {displayName}{" "}
                    <span className="text-gray-400 text-xs">
                      {timestamp && new Date(timestamp.seconds * 1000).toLocaleDateString()}
                    </span>
                  </span>
                </p>
              </div>
            )
          )}
        </div>
  
        {/* Current User Blogs Section */}
        <h3 className="text-2xl font-bold text-white my-10">My Blogs</h3>
        <div className="grid items-center justify-center grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {myBlogs.map(({ id, title, description, category, imageFile, displayName, photoURL, timestamp }) => (
        <div key={id +"ourBLogs"} className="relative border-2 border-gray-300 rounded-lg p-2">
          <img
            src={imageFile}
            className="object-cover w-full h-56 mb-5 bg-center rounded"
            alt="blog"
          />
          <h2 className="mb-2 text-lg font-semibold text-white">{title}</h2>
          <p className="my-3 text-white">
            Category: <span className="text-xs">{category}</span>
          </p>
          <p className="mb-3 text-sm font-normal text-gray-300">
            {description.slice(0, 290)}...
          </p>
          <p className="absolute -top-5 -left-5 group flex gap-2 items-center text-white mx-2">
            <img
              className="h-13 w-13 z-10 rounded-full border-4 object-cover border-[#b68d40]"
              src={photoURL}
              alt="userImage"
            />
            <span className="grid transition-transform transform -translate-x-10 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 duration-500 ease bg-white text-black border border-gray-600 p-2 rounded">
              {displayName}{" "}
              <span className="text-gray-400 text-xs">
                {timestamp && new Date(timestamp.seconds * 1000).toLocaleDateString()}
              </span>
            </span>
          </p>
          <button
            className="btn text-white bg-blue-500 px-2 py-1 rounded mx-2"
            onClick={() => handleEdit({ id, title, description ,imageFile, category, displayName, photoURL, timestamp})}
          >
            Edit
          </button>
          <button
            className="btn text-white bg-red-500 px-2 py-1 rounded"
            onClick={() => handleDelete(id)}
          >
            Delete
          </button>
        </div>
      ))}

      {isModalOpen && (
        <div className="modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white text-black p-4 rounded">
            <h2>Update BLog</h2>
            <img
              src={currentCard.imageFile}
              className="object-cover w-full h-56 mb-5 bg-center rounded"
              alt="blog"
            />
            <input
              type="text"
              className="border p-2 my-2 w-full"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="border p-2 w-full"
              value={editedDescription}
              rows="4"
              
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <p className="absolute -top-5 -left-5 group flex gap-2 items-center text-white mx-2">
            <img
              className="h-13 w-13 z-10 rounded-full border-4 object-cover border-[#b68d40]"
              src={currentCard.photoURL}
              alt="userImage"
            />
            <span className="grid transition-transform transform -translate-x-10 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 duration-500 ease bg-white text-black border border-gray-600 p-2 rounded">
              {currentCard.displayName}{" "}
              <span className="text-gray-400 text-xs">
                {currentCard.timestamp && new Date(currentCard.timestamp.seconds * 1000).toLocaleDateString()}
              </span>
            </span>
          </p>
            <button className="btn bg-[#0AACBE] rounded px-2 py-1 text-white mx-2" onClick={handleEditSave}>
              Save
            </button>
            <button className="btn bg-[#0AACBE] rounded px-2 py-1 text-white" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
      </section>
    );
  };
  
  export default UserBlog;