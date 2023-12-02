import React, { useState, useEffect } from 'react';
import { Sidebar } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards, HiLogout, HiUserGroup } from 'react-icons/hi';
import { isAuth, logout, nameLoggedUser, userHasPerm } from '../auth';

export function CustomSideBar({ children }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  let logoff = () => {
    logout();

    navigate('/login');
  }

  useEffect(() => {
      async function fetchUsername() {
        try {
          const result = await nameLoggedUser();
          setUsername(result);
        } catch (error) {
          console.error('Erro ao obter o nome de usuário:', error);
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
