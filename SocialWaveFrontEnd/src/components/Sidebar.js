import React, { useState, useEffect } from 'react';
import { Sidebar } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards, HiLogout, HiUserGroup } from 'react-icons/hi';
import { getToken, isAuth, logout, nameLoggedEmail, nameLoggedUserCookies, userHasPerm } from '../auth';

export function CustomSideBar({ children }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  let logoff = () => {
    localStorage.clear();
    logout();

    navigate('/login');
  }

  useEffect(() => {
      async function fetchUsername() {
        try {
          const result = await nameLoggedUserCookies();
          if(result)
            setUsername(result);
          else{
            if(isAuth() && localStorage.getItem('user_name') === 'admin@email.com'){
              setUsername("Admin");
              localStorage.setItem('user_perm', "Admin");
            }
          }
        } catch (error) {
          console.error('Error obtaining username:', error);
        }
      }
  
      fetchUsername();
  }, );

  let sideBarAuthItens = isAuth() ? (
      <>
        <Sidebar.Item href="/profile" icon={HiUser}>
            {typeof username === 'object' ? 'Profile' : username}
        </Sidebar.Item>
        <Sidebar.Item href="/login" icon={HiLogout} onClick={logoff}>
            Logout
        </Sidebar.Item>
      </>
  ) : (
      <>
        <Sidebar.Item href="/login" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item>
          <Sidebar.Item href="/signup" icon={HiTable}>
            Sign Up
          </Sidebar.Item>
      </>
  );
  let sideBarAdminItens = userHasPerm('Admin') ? (
    <>
          <Sidebar.Item href="/Users" icon={HiUserGroup}>
        Users
      </Sidebar.Item>
      <Sidebar.Item href="/signup" icon={HiTable}>
        Create new Admin
      </Sidebar.Item>
    </>
  ) : null;

  return (
    <div className='flex'>
    <Sidebar aria-label="Default sidebar example" className='h-full'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item> */}
          <Sidebar.Item href="/feed" icon={HiViewBoards} label="" labelColor="dark">
            Feed
          </Sidebar.Item>
          { sideBarAuthItens }
          { sideBarAdminItens }
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>

    <div className='w-full'>{ children }</div>
    </div>
  );
}
