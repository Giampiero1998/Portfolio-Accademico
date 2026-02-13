import React from 'react';
import { IconSearch, IconAlertTriangle, IconRotateClockwise, IconPlus } from '@tabler/icons-react';
import ArticleCard from './ArticleCard';
import useAuthStore from '../../store/authStore'; 
import { useNavigate } from 'react-router-dom';
import { useArticleFilters } from '../../hooks/useArticleFilters';
import { useArticles } from '../../hooks/useArticles';

// Componenti Mantine
import { 
  Stack, 
  Title, 
  Loader, 
  TextInput, 
  Button, 
  Paper, 
  SimpleGrid, 
  Alert, 
  Center,
  Group,
  Text,
  Skeleton,
  Container,
  Badge
} from '@mantine/core';

const ArticleList = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // Usa l'hook per ottenere i filtri dall'URL
  const { filters, updateFilters, resetFilters, hasActiveFilters, getApiFilters } = useArticleFilters();
  
  // Hook con cache automatica e invalidation
  const { 
    data: articles, 
    isLoading, 
    isError,
    error,
    isFetching,
    refetch
  } = useArticles(getApiFilters());

  // Gestisce i cambiamenti degli input aggiornando l'URL
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    updateFilters({ ...filters, [name]: value });
  };

  const handleReset = () => {
    resetFilters();
  };
  
  // ============================================
  // GESTIONE STATI
  // ============================================

  // 1. Caricamento iniziale
  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Stack spacing="xl">
          <Group justify="space-between">
            <Skeleton height={40} width={300} />
            {isLoggedIn && <Skeleton height={40} width={180} />}
          </Group>

          {/* Skeleton filtri */}
          <Paper withBorder p="md">
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <Skeleton height={60} />
              <Skeleton height={60} />
              <Skeleton height={60} />
            </SimpleGrid>
          </Paper>

          {/* Skeleton articoli */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={`skeleton-${index}`} height={250} radius="md" />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    );
  }

  // 2. Errore di caricamento
  if (isError) {
    return (
      <Container size="xl" py="xl">
        <Stack spacing="xl">
          <Group justify="space-between">
            <Title order={2}>Elenco degli articoli pubblicati</Title>
            {isLoggedIn && (
              <Button 
                onClick={() => navigate('/articles/new')} 
                leftSection={<IconPlus size="1rem" />}
              >
                Nuovo Articolo
              </Button>
            )}
          </Group>

          <Alert 
            icon={<IconAlertTriangle size="1.2rem" />} 
            title="Errore di Caricamento" 
            color="red" 
            variant="filled"
          >
            <Text mb="sm">
              {error?.message || 'Impossibile caricare gli articoli'}
            </Text>
            <Button 
              variant="white" 
              size="sm" 
              onClick={() => refetch()}
              leftSection={<IconRotateClockwise size="1rem" />}
            >
              Riprova
            </Button>
          </Alert>
        </Stack>
      </Container>
    );
  }

  // ============================================
  // RENDER PRINCIPALE
  // ============================================

  const hasResults = articles && articles.length > 0;

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        
        {/* Header con titolo e bottone */}
        <Group justify="space-between">
          <div>
            <Title order={2}>Elenco degli articoli pubblicati</Title>
            {hasResults && (
              <Text size="sm" c="dimmed" mt={4}>
                {articles.length} articol{articles.length === 1 ? 'o' : 'i'} 
                {hasActiveFilters && ' trovato'}
              </Text>
            )}
          </div>
          
          {isLoggedIn && (
            <Button 
              onClick={() => navigate('/articles/new')} 
              leftSection={<IconPlus size="1rem" />}
            >
              Nuovo Articolo
            </Button>
          )}
        </Group>

        {/* Barra di ricerca e filtri */}
        <Paper withBorder p="md" shadow="sm">
          <Stack spacing="md">
            {/* Griglia per i filtri */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <TextInput
                label="Ricerca titolo/abstract"
                placeholder="Full-Text Search"
                leftSection={<IconSearch size="1rem" />}
                name="q"
                value={filters.q}
                onChange={handleFilterChange}
                description="Cerca nel titolo, abstract e autori"
              />
              <TextInput
                label="Filtro autore"
                placeholder="Nome autore"
                name="authors"
                value={filters.authors}
                onChange={handleFilterChange}
                description="Cerca per nome completo o parziale"
              />
              <TextInput
                label="Filtro anno"
                placeholder="Anno pubblicazione"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                type="number"
                description="Es: 2024"
              />
            </SimpleGrid>

            {/* Bottone di reset e indicator filtri attivi */}
            <Group justify="space-between" mt="xs">
              {hasActiveFilters && (
                <Badge color="blue" variant="light" size="lg">
                  {Object.values(filters).filter(Boolean).length} filtri attivi
                </Badge>
              )}
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                onClick={handleReset}
                disabled={!hasActiveFilters}
                leftSection={<IconRotateClockwise size="1rem" />}
                ml="auto"
              >
                Reset Filtri
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* Feedback durante il refetching */}
        {isFetching && (
          <Group gap="sm">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Aggiornamento risultati...</Text>
          </Group>
        )}

        {/* Grid degli articoli */}
        {hasResults ? (
          <SimpleGrid 
            cols={{ base: 1, sm: 2, md: 3 }} 
            spacing="xl" 
            verticalSpacing="xl"
          >
            {articles.map(article => (
              <ArticleCard 
                key={article._id || article.id} 
                article={article} 
              />
            ))}
          </SimpleGrid>
        ) : (
          <Paper 
            withBorder 
            p="xl" 
            radius="md" 
            style={{ textAlign: 'center' }}
          >
            <Stack align="center" spacing="md">
              <IconAlertTriangle size={48} color="gray" />
              <div>
                <Title order={4} c="dimmed">
                  {hasActiveFilters 
                    ? 'Nessun articolo trovato' 
                    : 'Nessun articolo disponibile'}
                </Title>
                <Text size="sm" c="dimmed" mt="xs">
                  {hasActiveFilters 
                    ? 'Prova a modificare i filtri di ricerca' 
                    : 'Crea il tuo primo articolo per iniziare'}
                </Text>
              </div>
              {hasActiveFilters ? (
                <Button 
                  variant="light" 
                  onClick={handleReset}
                  leftSection={<IconRotateClockwise size="1rem" />}
                >
                  Reset Filtri
                </Button>
              ) : isLoggedIn && (
                <Button 
                  onClick={() => navigate('/articles/new')}
                  leftSection={<IconPlus size="1rem" />}
                >
                  Crea Primo Articolo
                </Button>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default ArticleList;