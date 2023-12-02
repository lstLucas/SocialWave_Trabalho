import React, { useEffect, useState } from 'react';
import { apiAuthDelete, apiAuthGet } from '../apis';
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,
} from "@material-tailwind/react";
import { userHasPerm } from '../auth';

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const UsersInformation = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (!userHasPerm('Admin')) {
      navigate("/feed");
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      await apiAuthGet(
        'user/allmembers',
        (data) => {
          setUsers(data);
        },
        (error) => {
          console.error('Erro ao obter usuários:', error);
        }
      );
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
    }
  }

  const deleteUser = async (id) => {
    try {
      await apiAuthDelete('user', id, async () => {
        console.log('Usuário excluído com sucesso.');
        await fetchUsers();
      }, (error) => {
        console.error('Erro ao excluir usuário:', error);
      });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };
  

  return (
    <div className="w-96" style={{ margin: '0 auto' }}>
      <h1 className="text-2xl font-bold mb-4">Users Information</h1>
      {users.map((user, index) => (
        <Card key={index} className="w-96 mb-4">
          <List>
            <ListItem ripple={false} className="py-1 pr-1 pl-4">
              {user.email}
              <ListItemSuffix>
                <IconButton variant="text" color="blue-gray" onClick={() => deleteUser(user.id)}>
                  <TrashIcon />
                </IconButton>
              </ListItemSuffix>
            </ListItem>
          </List>
        </Card>
      ))}
    </div>
  );
};

export default UsersInformation;
