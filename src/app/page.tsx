'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import styles from './page.module.css';

interface Noticia {
  id: number;
  titulo: string;
  introducao: string;
  link: string;
}

const fetchNoticias = async (page: number, limit: number = 10) => {
  const res = await fetch(`http://servicodados.ibge.gov.br/api/v3/noticias/?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error('Falha ao buscar notícias');
  }
  return res.json();
};

export default function Home() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);

  useEffect(() => {
    const loadNoticias = async () => {
      setLoading(true);
      try {
        const newNoticias = await fetchNoticias(page);
        setNoticias((prevNoticias) => [...prevNoticias, ...newNoticias.items]);
        if (newNoticias.items.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      }
      setLoading(false);
    };

    loadNoticias();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  const openModal = (noticia: Noticia) => {
    setSelectedNoticia(noticia);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNoticia(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Atualizaê</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.newsColumn}>
          <h2 className={styles.title}>Últimas Notícias</h2>
          <div className={styles.newsList}>
            {noticias.map((noticia: Noticia) => (
              <div key={noticia.id} className={styles.newsItem} onClick={() => openModal(noticia)}>
                <h3>{noticia.titulo}</h3>
                <p>{noticia.introducao}</p>
              </div>
            ))}
          </div>
          {loading && <p className={styles.loading}>Carregando mais notícias...</p>}
          {!hasMore && <p className={styles.noMore}>Não há mais notícias para carregar.</p>}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarItem}>
            <h3>Sobre o Atualizaê</h3>
            <p>O Atualizaê é o seu portal de notícias em tempo real, trazendo as últimas atualizações direto do IBGE.</p>
          </div>
          <div className={styles.sidebarItem}>
            <h3>Categorias Populares</h3>
            <div className={styles.categoryTags}>
              <span className={styles.categoryTag}>Economia</span>
              <span className={styles.categoryTag}>Educação</span>
              <span className={styles.categoryTag}>Saúde</span>
              <span className={styles.categoryTag}>Ciência e Tecnologia</span>
              <span className={styles.categoryTag}>Política</span>
              <span className={styles.categoryTag}>Meio Ambiente</span>
            </div>
          </div>
        </aside>
      </main>

      <Modal isOpen={modalOpen} onClose={closeModal} noticia={selectedNoticia!} />
    </div>
  );
}