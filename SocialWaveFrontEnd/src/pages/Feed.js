import React, { useEffect, useState } from "react";
import { getAllPosts, isAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import SWLogo from "../images/SWLogo.jpeg";
import { apiAuthGet, apiAuthPost } from '../apis';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [newPostData, setNewPostData] = useState({ title: '', body: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth()) {
      navigate("/login");
    }
  });


  useEffect(() => {
    getAllPosts((filteredPosts) => {
      setPosts(filteredPosts);
    });
  }, []);

  useEffect(() => {
    if (isAuth()) {
      apiAuthGet('GetUserDetails', userDetails => {
        setUserDetails(userDetails);
      }, (error) => {
        console.error('Erro ao obter detalhes do usuário:', error);
      });
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPostData({ ...newPostData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isAuth()) {
      if(!userDetails){
        apiAuthGet('GetUserDetails', userDetails => {
          setUserDetails(userDetails);
        }, (error) => {
          console.error('Erro ao obter detalhes do usuário:', error);
          
        });
      }
      const newPost = {
        title: newPostData.title,
        body: newPostData.body,
        likes: 0,
        author: {
          username: userDetails?.username,
          email: userDetails?.email,
        },
      };
      
      apiAuthPost('post', newPost,
        (result) => {
          console.log('Novo post criado:', result);
          // Atualizar a lista de posts após criar o novo post (opcional)
          // getAllPosts(setPosts);
        },
        (error) => {
          console.error('Erro ao criar o post:', error);
        }
      );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-4 flex items-center">
          <img src={SWLogo} alt="SW Logo" className="w-20 h-auto" />
          <button
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded flex items-center ml-4"
            onClick={() => {

            }}
          >
            <FaFilter className="mr-2" /> Filtro
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-4">Feed</h1>
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4">Nova Postagem</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="titulo" className="block text-gray-700">
                Título
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                id="titulo"
                name="title"
                placeholder="Digite o título da postagem"
                value={newPostData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="conteudo" className="block text-gray-700">
                Conteúdo
              </label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 h-32 resize-none"
                id="conteudo"
                name="body"
                placeholder="Digite o conteúdo da postagem"
                value={newPostData.body}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Publicar
            </button>
          </form>
        </div>
        <div>
          <h1>Lista de Posts</h1>
          <ul>
            {posts.map((post, index) => (
              <li key={index}>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
                <p>Likes: {post.likes}</p>
                <p>Author: {post.author.username}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          {/* Postagens... */}
        </div>
      </div>
    </div>
  );
};

export default Feed;
