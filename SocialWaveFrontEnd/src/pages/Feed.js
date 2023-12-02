import React, { useEffect, useState } from "react";
import { getAllPosts, isAuth, nameLoggedEmail, updateLike } from "../auth";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import SWLogo from "../images/SWLogo.jpeg";
import { apiAuthGet, apiAuthGetById, apiAuthPost, apiAuthPut } from '../apis';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(Array(posts.length).fill(false));
  const [userDetails, setUserDetails] = useState(null);
  const [newPostData, setNewPostData] = useState({ title: '', body: '' });
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth()) {
      navigate("/login");
    }
  });

  useEffect(() => {
    if (isAuth()) {
      getAllPosts((filteredPosts) => {
        setPosts(filteredPosts);
      });

      async function fetchUserInfo() {
        try {
          const resultEmail = await nameLoggedEmail();
          setEmail(resultEmail);
        } catch (error) {
          console.error('Erro ao obter o nome de usuário ou email:', error);
        }
      }


      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    if (isAuth() && email) {
      getUserDetails(email);

    }
  }, [email]);

  async function getUserDetails(email) {
    if (isAuth()) {
      apiAuthGet('user/details/' + email,
        userDetails => {
          setUserDetails(userDetails);

        },
        error => {
          console.error('Erro ao obter detalhes do usuário:', error);
        }
      );
    }
  }

  function updateAuthorName(username, index) {
    if (isAuth) {
      const authorParagraphs = document.querySelectorAll('.author-paragraph');
      if (authorParagraphs.length > index) {
        authorParagraphs[index].textContent = `Author: ${username}`;
      }
    }
  }

  async function getAuthorUsername(id, index) {
    if (isAuth) {
      try {
        const userInfo = await new Promise((resolve, reject) => {
          apiAuthGetById('user', id,
            userData => {
              resolve(userData);
            },
            error => {
              reject(error);
            }
          );
        });
        updateAuthorName(userInfo.username, index);
      } catch (error) {
        console.error('Erro ao obter detalhes do usuário:', error);
      }
    }
  }

  const handleLikeClick = async (post, index) => {
    const updatedLikedPosts = [...likedPosts];
    updatedLikedPosts[index] = !updatedLikedPosts[index];
    setLikedPosts(updatedLikedPosts);

    const button = document.querySelector(`.like-button-${index}`);
    console.log(button);

    if (button.classList.contains('text-red-500')) {
      try {
        await updateLike(
          post,
          -1, 
          () => {
            console.log('PUT realizado na API com sucesso');
            
          },
          (error) => {
            console.error('Erro ao realizar o PUT na API:', error);
            
          }
        );
      } catch (error) {
        console.error('Erro ao realizar o PUT na API:', error);
        
      }
    } else {
      try {
        await updateLike(
          post,
          1, 
          () => {
            console.log('Outro tipo de PUT realizado na API com sucesso');
            
          },
          (error) => {
            console.error('Erro ao realizar o outro tipo de PUT na API:', error);
           
          }
        );
      } catch (error) {
        console.error('Erro ao realizar o outro tipo de PUT na API:', error);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPostData({ ...newPostData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isAuth()) {
      const newPost = {
        id: Date.now().toString(),
        title: newPostData.title,
        body: newPostData.body,
        likes: 0,
        authorId: userDetails.id,
        authorName: userDetails.userName,
      };

      apiAuthPost('post', newPost,
        (result) => {
          console.log('Novo post criado:', result);
          window.location.reload(false);
        },
        (error) => {
          console.error('Erro ao criar o post:', error);
        }
      );
    }
  };

  posts.forEach((post, index) => {
    getAuthorUsername(post.authorId, index);
  });

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
                placeholder="Your post Title"
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
              Publish
            </button>
          </form>
        </div>
        <div>
          <h1 className="text-3xl content-center">Lista de Posts</h1>
          <ul className="list-none p-0">
            
            {posts.map((post, index) => (
              <li key={index} className="mb-8">
                <div className="rounded-xl shadow-lg overflow-hidden bg-white">
                  <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                    <p className="text-gray-700 mb-6">{post.body}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">
                        Likes: {post.likes}{' '}
                        <button
                          className={likedPosts[index] ? `like-button-${index} text-red-500` : `like-button-${index}`}
                          onClick={() => handleLikeClick(post, index)}
                        >
                          &hearts;
                        </button>
                      </p>
                      <p className="text-gray-600 author-paragraph">Author: Loading...</p>
                    </div>
                  </div>
                </div>
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
