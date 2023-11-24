import Sidebar from '../components/Sidebar'
import { Flex, Text, IconButton } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'

export default function Home() {
  return (
    <Flex w="100%">
      <Sidebar />
      <Flex
        pos="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Outlet />
      </Flex>
    </Flex>
  )
}