import React, { useEffect, useState } from "react";
import { getAllPosts, isAuth, nameLoggedEmail, updateLike } from "../auth";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import SWLogo from "../images/SWLogo.jpeg";
import { apiAuthDelete, apiAuthGet, apiAuthGetById, apiAuthPost, apiAuthPut } from '../apis';
import { IconButton, button } from "@material-tailwind/react";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(Array(posts.length).fill(false));
  const [sortByLikes, setSortByLikes] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [newPostData, setNewPostData] = useState({ title: '', body: '' });
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth()) {
      navigate("/login");
    }
  });

  useEffect(() => {
    if (isAuth()) {
      async function fetchPosts() {
        try {
          const filteredPosts = await new Promise((resolve, reject) => {
            getAllPosts(
              (filteredPosts) => {
                resolve(filteredPosts);
              },
              (error) => {
                reject(error);
              }
            );
          });

          setPosts(filteredPosts);

        } catch (error) {
          console.error('Erro ao obter posts:', error);
        }
      }

      fetchPosts();

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
  
  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (isAuth() && userDetails && posts.length > 0) {
        try {
          const likedPostsResponse = await apiAuthGetById(
            'post/like',
            userDetails.id,
            (likedPosts) => {
              const ids = likedPosts.map((likedPost) => likedPost.id);
              setLikedPostIds(ids);
            },
            () => {
              console.log('error fetching liked posts');
            },
            '',
            ''
          );
  
          posts.forEach((post, index)=> {
            const button = document.querySelector(`.like-button-${index}`);
            if(likedPostIds.includes(post.id)){
              button.classList.add('text-red-500');
            }           
          });

        } catch (error) {
          console.error('Erro ao buscar curtidas dos posts:', error);
        }
      }
    };
  
    fetchLikedPosts();
  }, [userDetails, posts]);
  
  

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

  const handleFilterClick = () => {
    setSortByLikes(prevState => !prevState); 
  };

  const sortPostsByLikes = (posts) => {
    if (sortByLikes) {
      return posts.slice().sort((a, b) => b.likes - a.likes);
    } else {
      return posts;
    }
  };

  const handleLikeClick = async (post, index) => {
    const isPostLiked = likedPosts.some((likedPost) => likedPost.id === post.id);
  
    const updatedLikedPosts = isPostLiked
      ? likedPosts.filter((likedPost) => likedPost.id !== post.id)
      : [...likedPosts, post];
  
    setLikedPosts(updatedLikedPosts);
  
    try {
      await updateLike(
        post,
        userDetails.id,
        () => {
          console.log('PUT realizado na API com sucesso');
          window.location.reload();
        },
        (error) => {
          console.error('Erro ao realizar o PUT na API:', error);
        }
      );
    } catch (error) {
      console.error('Erro ao realizar o PUT na API:', error);
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

  const deletePost = (id) =>{
    apiAuthDelete('post', id,
     () => {console.log("Success deleting post"); window.location.reload(false)},
     (error) => {console.log("error deleting post " + error)});
  }

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
            <div onClick={handleFilterClick} className="flex">
            <FaFilter className="mr-2" /> Filter
            </div>
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
                required
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
                required
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

            {sortPostsByLikes(posts).map((post, index) => (
              
              <li key={index} className="mb-8">
                <div className="rounded-xl shadow-lg overflow-hidden bg-white">
                  <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                    <p className="text-gray-700 mb-6">{post.body}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">
                        Likes: {post.likes}{' '}
                        <button
                          className={likedPostIds.includes(post.id) ? 'text-red-500' : ''}
                          onClick={() => handleLikeClick(post, index)}
                        >
                          &hearts;
                        </button>
                      </p>
                      <p className="text-gray-600 author-paragraph">Author: Loading...</p>
                      {userDetails && userDetails.id === post.authorId && (                     
                          <IconButton variant="text" color="blue-gray" onClick={() => deletePost(post.id)}>
                            <TrashIcon />
                          </IconButton>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        </div>
      </div>
    </div>

  );

};

export default Feed;
