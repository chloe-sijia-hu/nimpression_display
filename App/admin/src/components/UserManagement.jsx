import React, { useState, useEffect } from 'react';
import { TbTrash, TbEdit } from "react-icons/tb";

const UserManagement = () => {
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', role: '', password: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
	const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';
  const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.nimpression.site' || 'http://3.27.181.196:80'|| 'http://localhost:5173';
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	

  // Function to fetch and verify the user's role
  const checkAdminAccess = () => {
    const token = localStorage.getItem('auth-token');
    
    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role === 'admin') {
            setShowAccessDenied(false);
        } else {
            setShowAccessDenied(true);
            setTimeout(() => {
                navigate('/login'); // Redirect to login after 2 seconds
            }, 2000);
        }
    } else {
        setShowAccessDenied(true);
        setTimeout(() => {
            navigate('/login'); // Redirect to login after 2 seconds
        }, 2000);
    }
  };


  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${VITE_API_URL}/users/allusers`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    checkAdminAccess();
  }, []);
  
  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ id: user._id, email: user.email, role: user.role, password: '' });
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${VITE_API_URL}/users/updateuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const textResponse = await response.text();
        console.error('Server response:', textResponse);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setEditingUser(null);
      } else {
        console.error('Update failed:', data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId, userEmail) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch(`${VITE_API_URL}/users/removeuser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ id: userId, email: userEmail })
        });
        const data = await response.json();
        if (data.success) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleBack = () => {
    setEditingUser(null);
    setFormData({ email: '', role: '', password: '' });
  };

  return (
    <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-5 lg:ml-5'>
      {showAccessDenied ? (
        <section className="max_padd_container flexCenter flex-col pt-3">
          <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto rounded-md">
            <h3 className="h3">Admin Dashboard</h3>
            <p className="pb-3">Access Denied. You do not have permission to view this page!</p>
          </div>
        </section>
      ) : (
      <div className='mx-5 px-5'>
        <h4 className="bold-22 pt-5 ml-2 uppercase mb-2">User Management</h4>
        
        <div className='max-h-[77vh] overflow-auto px-2'>
          <table className='w-full mx-auto'>
            <thead>
              <tr className='bg-primary bold-14 sm:regular-22 text-start py-12'>
                <th className='p-2 text-left'>Email</th>
                <th className='p-2 text-left'>Role</th>
                <th className='p-2 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user._id} className="border-b border-slate-900/20 text-gray-20 p-6 medium-14">
                  <td className='p-2'>{user.email}</td>
                  <td className='p-2'>{user.role}</td>
                  <td className='p-2'>
                    <button onClick={() => handleEdit(user)} className='cursor-pointer mr-2'>
                      <TbEdit />
                    </button>
                    <button onClick={() => handleDelete(user._id, user.email)} className='cursor-pointer'>
                      <TbTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          itemsPerPage={usersPerPage}
          totalItems={users.length}
          paginate={paginate}
          currentPage={currentPage}
        />

        {editingUser && (
          <div className='mt-8'>
            <h4 className='h4 mb-4 bold-22'>Edit User</h4>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl'
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl'
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password (leave blank to keep current)"
                className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl'
              />
              
              <div className='flex gap-x-3 mb-5'>
                <button type="submit" className='btn_dark_rounded mt-4 flexCenter gap-x-1'>
                  Update User
                </button>
                <button type="button" onClick={handleBack} className="btn_dark_rounded mt-4 flexCenter gap-x-1">Back to List</button>
              </div>
            </form>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="flex justify-center">
        {pageNumbers.map(number => (
          <li key={number} className="mx-1">
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default UserManagement;