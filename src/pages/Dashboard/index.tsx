import React, { FormEvent, useState, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  Title, Form, Repositories, Error,
} from './styles';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface Repository {
 full_name : string;
 description : string;
 owner : {
   login : string;
   avatar_url : string;
 }
}

const Dashboard : React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  const handleAddRepository = async (event : FormEvent<HTMLFormElement>) : Promise<void> => {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por esse repositório');
    }
  };

  return (
    <>
      <img src={logoImg} alt="Github Explore" />
      <Title> Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input value={newRepo} onChange={(e) => setNewRepo(e.target.value)} type="text" placeholder="Digite o nome do repositório" />
        <button type="submit"> pesquisar </button>
      </Form>

      { inputError && <Error>{inputError}</Error> }

      <Repositories>

        {repositories.map((repository) => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />

          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
