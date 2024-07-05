import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Pages from './Pages';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Projeto final Biblioteca</h1>
          <nav>
            <ul>
              <li>
                <Link to="/RegisterLivro">Cadastrar Livro</Link>
              </li>
              <li>
                <Link to="/RegisterAuthor">Cadastrar Autor</Link>
              </li>
              <li>
                <Link to="/RegisterGenre">Registrar Gênero</Link>
              </li>
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RegisterLivro" element={<Pages.RegisterLivro />} />
          <Route path="/RegisterAuthor" element={<Pages.RegisterAuthor />} />
          <Route path="/RegisterGenre" element={<Pages.RegisterGenre />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home-container">
      <h2>Seja bem-vindo à minha Biblioteca!</h2>
      <p>Escolha uma opção no menu acima para começar.</p>
    </div>
  );
}
