import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Title, Text, Container, Box, Stack } from '@mantine/core';

// Importazione dei componenti di Routing
import ArticleList from './features/articles/ArticleList';
import ArticleDetailPage from './features/articles/ArticleDetailPage';
import ArticleForm from './features/articles/ArticleForm';
import Layout from './components/Layout'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

// Componente Home
const Home = () => (
  <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '60vh', padding: 'var(--mantine-spacing-xl) 0' }}>
    <Container size="md" mt="xl" p="xl" style={{ backgroundColor: '#C4BFB8', borderRadius: 'var(--mantine-radius-xl)', boxShadow: '0 8px 16px rgba(13, 37, 19, 0.2)', textAlign: 'center' }}>
      <Stack align="center" spacing="md">
        <Title order={1} style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Lora' }} c="#0D2513FF">
          Benvenuto su Scripta Manent Portfolio!
        </Title>
        <Text c="#0D2513FF" mt="md" size="lg" fontWeight={500} style={{ opacity: 0.9 }}>
          Naviga tra i nostri articoli o accedi per gestire i tuoi contenuti 📚
        </Text>
        <Text c="#0D2513FF" mt="xs" size="md" fontWeight={400} style={{ fontStyle: 'italic', opacity: 0.7 }}>
          Per aspera ad astra 🌟
        </Text>
      </Stack>
    </Container>
  </Box>
);

function App() {
  return (
    <Routes>
      {/* Rotta principale che usa il Layout */}
      <Route element={<Layout />}>
        {/* 🏠 Home page - Pubblica */}
        <Route index element={<Home />} /> 
        
        {/* 📚 Rotte Articoli */}
        <Route path="articles" element={<ArticleList />} />
        <Route path="articles/:id" element={<ArticleDetailPage />} />
        
        {/* ✨ PROTETTE: Creazione e modifica richiedono autenticazione */}
        <Route path="articles/new" element={<ProtectedRoute><ArticleForm isEdit={false} /></ProtectedRoute>} />
        <Route path="articles/:id/edit" element={<ProtectedRoute><ArticleForm isEdit={true} /></ProtectedRoute>} />
        
        {/* 🔐 Rotte di Autenticazione - Pubbliche */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;