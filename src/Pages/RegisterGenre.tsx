import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import api from '../api.js';
import '../App.css';

function List() {
  const [genre, setGenre] = useState({
    id: '',
    name: ''
  });
  const [genres, setGenres] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenre((prevGenre) => ({
      ...prevGenre,
      [name]: value,
    }));
  };

  const cadastrar = async () => {
    if (genre.name === '') {
      toast.error('Nome não pode ser vazio');
      return;
    }

    try {
      const data = { name: genre.name };

      if (isEditing) {
        await api.put(`genre/${genre.id}`, data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Gênero alterado com sucesso',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        await api.post('genre', data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Gênero cadastrado com sucesso',
          showConfirmButton: false,
          timer: 3000
        });
      }

      setGenre({ id: '', name: '' });
      setIsEditing(false);
      getGenres();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: isEditing ? 'Erro ao alterar gênero: ' + error.message : 'Erro ao cadastrar gênero: ' + error.message
      });
    }
  };

  async function getGenres() {
    try {
      const response = await api.get('genre');
      setGenres(response.data);
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
    }
  }

  const onEdit = async (id) => {
    try {
      const response = await api.get(`genre/${id}`);
      setGenre(response.data);
      setIsEditing(true);
    } catch (error) {
      console.error('Erro ao buscar gênero:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Erro ao buscar gênero: ' + error.message
      });
    }
  };

  const onDelete = (id) => {
    Swal.fire({
      title: 'Tem certeza que deseja excluir?',
      text: 'Não será possível reverter!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Não, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`genre/${id}`)
          .then((response) => {
            toast.success('Gênero excluído com sucesso.');
            getGenres();
            Swal.fire({
              title: 'Deletado!',
              text: 'Gênero foi deletado.',
              icon: 'success',
            });
          })
          .catch((e) => {
            if (e.response && e.response.status === 404) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gênero não encontrado',
              });
            } else {
              toast.error(e.message);
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelado',
          icon: 'error',
        });
      }
    });
  };

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <>
      <div className="container">
        <div className="header">
          <h1>Gêneros</h1>
          <Link to="/" className="btn-home">
            <button>Voltar para Home</button>
          </Link>
        </div>
        <form>
          <input
            type="text"
            name="name"
            value={genre.name}
            onChange={handleChange}
            placeholder="Digite o nome do gênero"
          />
          <button type="button" onClick={cadastrar}>
            {isEditing ? 'Salvar' : 'Cadastrar'}
          </button>
        </form>
        <ToastContainer />
        <div className="lista">
          {genres.map((genre) => (
            <div key={genre.id} className="item">
              <h2>{genre.name}</h2>
              <p>ID: {genre.id}</p>
              <button onClick={() => onEdit(genre.id)}>Editar</button>
              <button onClick={() => onDelete(genre.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default List;