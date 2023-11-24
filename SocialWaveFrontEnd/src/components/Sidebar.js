import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';

export function CustomSideBar({ children }) {
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
          <Sidebar.Item href="#" icon={HiInbox} label="3">
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Profile
          </Sidebar.Item>
          {/* <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item> */}
          <Sidebar.Item href="/login" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item>
          <Sidebar.Item href="/signup" icon={HiTable}>
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>

    <div className='w-full'>{ children }</div>
    </div>
  );
}
