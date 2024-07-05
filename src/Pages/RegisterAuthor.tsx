import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import api from '../api.js';
import '../Autor.css';

function List() {
  const [author, setAuthor] = useState({
    id: '',
    name: ''
  });
  const [authors, setAuthors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthor((prevAuthor) => ({
      ...prevAuthor,
      [name]: value,
    }));
  };

  const cadastrar = () => {
    if (author.name === '') {
      toast.error('Nome não pode ser vazio');
      return;
    }

    if (author.id) {
      api
        .patch(`authors/${author.id}`, author)
        .then((response) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Alterado com sucesso',
            showConfirmButton: false,
            timer: 10000,
          });
          setAuthor({ id: '', name: '' });
          getAuthors();
        })
        .catch((e) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erro ao efetuar o cadastro: ' + e,
          });
        });
    } else {
      api
        .post('authors', author)
        .then((response) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Cadastro efetuado com sucesso',
            showConfirmButton: false,
            timer: 10000,
          });
          setAuthor({ id: '', name: '' });
          getAuthors();
        })
        .catch((e) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erro ao efetuar o cadastro: ' + e,
          });
        });
    }
  };

  async function getAuthors() {
    await api.get('authors').then((response) => setAuthors(response.data));
  }

  async function onEdit(id) {
    await api
      .get(`authors/${id}`)
      .then((response) => setAuthor(response.data));
  }

  function onDelete(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Tem certeza que deseja excluir?',
        text: 'Não será possível reverter!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          api
            .delete(`authors/${id}`)
            .then((response) => {
              toast.done('Excluído com sucesso.');
              getAuthors();
            })
            .catch((e) => {
              if (e.message.includes('404')) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Cadastro não encontrado',
                });
              } else {
                toast.error(e.message);
              }
            });
          swalWithBootstrapButtons.fire({
            title: 'Deletado!',
            text: 'Autor foi deletado(a).',
            icon: 'success',
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelado',
            icon: 'error',
          });
        }
      });
  }

  useEffect(() => {
    getAuthors();
  }, []);

  return (
    <>
      <div className="container">
        <div className="header">
          <h1 >Autores</h1>
          <Link to="/" className="btn-home">
            <button>Voltar para Home</button>
          </Link>
        </div>
        <form>
          <input
            type="text"
            name="name"
            value={author.name}
            onChange={handleChange}
            placeholder="Digite o nome do autor"
          />
          <button type="button" onClick={cadastrar}>
            Cadastrar
          </button>
        </form>
        <ToastContainer />
        <div className="lista">
          {authors.map((author) => (
            <div key={author.id} className="item" onClick={() => onEdit(author.id)}>
              <h2>{author.name}</h2>
              <p>ID: {author.id}</p>
              <button onClick={(e) => { e.stopPropagation(); onDelete(author.id); }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default List;
