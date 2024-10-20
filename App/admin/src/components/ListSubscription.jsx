import React, { useEffect, useState } from 'react';
import { TbTrash, TbCopy } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

const ListSubscription = () => {
  const [allemails, setAllemails] = useState([]);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(10);
 
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

  const fetchInfo = async () => {
    try {
      const token = localStorage.getItem('auth-token'); // Get token from localStorage
      const response = await fetch(`${VITE_API_URL}/newsletter/subscription/list`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Send token in header
        },
        credentials: 'include',
      });

      if (response.status === 403) {
        // Token is invalid or expired
        alert('Your session has expired or you are not admin. Please log in again.');
        localStorage.removeItem('auth-token'); // Clear the token
        setTimeout(() => {
          navigate('/login'); // Redirect to login after a short delay
        }, 2000);
      } else if (response.status === 401) {
        // Handle no token or unauthorized access
        alert('Unauthorized. Please log in.');
        navigate('/login');
      } else {
        const data = await response.json();
        setAllemails(data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  useEffect(() => {
    checkAdminAccess();  // Check for admin access on component mount
    fetchInfo();         // Fetch bookings
  }, []);

  const remove_email = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this email?");
    
    // Proceed only if the user confirmed the deletion
    if (confirmDelete) {
      try {
        const response = await fetch(`${VITE_API_URL}/newsletter/subscription/remove`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id })
        });
  
        if (response.ok) {
          console.log("Email deleted successfully");
          await fetchInfo(); // Refresh the list after deletion
        } else {
          console.log("Error deleting the booking");
        }
      } catch (error) {
        console.error("An error occurred while deleting the email:", error);
      }
    } else {
      console.log("Email deletion cancelled");
    }
  };

  // Get current emails
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = allemails.slice(indexOfFirstEmail, indexOfLastEmail);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to copy all emails
  const copyAllEmails = () => {
    const emailString = allemails.map(email => email.email).join('; ');
  
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailString)
        .then(() => {
          alert('All emails copied to clipboard!');
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          fallbackCopyText(emailString); // Use fallback if clipboard API fails
        });
    } else {
      console.warn('Clipboard API not supported, using fallback.');
      fallbackCopyText(emailString);
    }
  };
  
  const fallbackCopyText = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';  // Avoid scrolling to bottom
    textarea.style.opacity = 0;  // Hide the textarea
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
  
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('All emails copied to clipboard!');
      } else {
        alert('Failed to copy emails. Please try manually.');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textarea);  // Clean up the textarea
  };
  
  

  return (
    <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-5 lg:ml-5'>
      {showAccessDenied ? (
        <section className="max_padd_container flexCenter flex-col pt-3">
          <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto rounded-md">
            <h3 className="h3">Subscription Email List</h3>
            <p className="pb-3">Access Denied. You do not have permission to view all bookings!</p>
          </div>
        </section>
      ) : (
        <div>
          <div className="flex justify-between items-center px-5 py-3">
            <h4 className='bold-22 uppercase'>Subscription Email List</h4>
            <button 
              onClick={copyAllEmails} 
              className="btn_dark_rounded flexCenter gap-x-2 mb-4 text-sm md:text-base"
            >
              <TbCopy /> Copy All Emails
            </button>
          </div>
          <div className='max-h-[77vh] overflow-auto px-4 text-center'>
            <table className='w-full mx-auto'>
              <thead>
                <tr className='bg-primary bold-14 sm:regular-22 text-start py-12'>
                  <th className='p-2'>Email</th>
                  <th className='p-2'>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentEmails.map((email, i) => (
                  <tr key={i} className="border-b border-slate-900/20 text-gray-20 p-6 medium-14">
                    <td className='p-2'>{email.email}</td>
                    <td className='p-2 flex justify-center items-center'>
                      <div className='flex flex-row gap-x-2'>
                        <TbTrash className='cursor-pointer' onClick={() => remove_email(email.id)} />
                      </div> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            itemsPerPage={emailsPerPage}
            totalItems={allemails.length}
            paginate={paginate}
            currentPage={currentPage}
          />
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

export default ListSubscription