import React, {useEffect, useState} from 'react';
import { isAuth } from '../auth';
import { useNavigate } from 'react-router-dom';


const Feed = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if(!isAuth()){
            navigate('/login');
        }
    })

    return(
        <div className="container mx-auto py-8">
        <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Feed</h1>

            {/* Nova Postagem */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Nova Postagem</h2>
            <form>
                <div className="mb-4">
                <label htmlFor="titulo" className="block text-gray-700">Título</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    id="titulo"
                    name="titulo"
                    placeholder="Digite o título da postagem"
                />
                </div>
                <div className="mb-4">
                <label htmlFor="conteudo" className="block text-gray-700">Conteúdo</label>
                <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 h-32 resize-none"
                    id="conteudo"
                    name="conteudo"
                    placeholder="Digite o conteúdo da postagem"
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

            {/* Postagens existentes */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            {/* Postagens... */}
            </div>
        </div>
        </div>


    )
}

export default Feed