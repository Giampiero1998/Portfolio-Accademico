import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { useArticle, useDeleteArticle } from '../../hooks/useArticles';
import { useQuery } from '@tanstack/react-query';
import { getCitationsByArticleId } from '../../services/api';

// Componenti Mantine
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Loader,
  Alert,
  Center,
  Divider,
  Badge,
  Box,
  Modal,
  Anchor,
  Breadcrumbs,
  Container
} from '@mantine/core';

// Icone Tabler
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconBook,
  IconCalendar,
  IconUsers,
  IconFileText
} from '@tabler/icons-react';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  // State per il modal di conferma eliminazione
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  // Recuperare articolo
  const {
    data: article,
    isLoading: isLoadingArticle,
    isError: isErrorArticle,
    error: articleError
  } = useArticle(id);

  // Query per recuperare le citazioni correlate
  const {
    data: citations,
    isLoading: isLoadingCitations,
    isError: isErrorCitations
  } = useQuery({
    queryKey: ['citations', id],
    queryFn: () => getCitationsByArticleId(id),
    enabled: !!id && !!article, // Esegui solo se articolo è caricato
    staleTime: 5 * 60 * 1000,
  });

  //  Delete con optimistic removal
  const { mutate: deleteArticleMutation, isPending: isDeleting } = useDeleteArticle();

  // Handler per confermare l'eliminazione
  const handleDelete = () => {
    deleteArticleMutation(id, {
      onSuccess: () => {
        navigate('/articles');
      }
    });
    setDeleteModalOpened(false);
  };

  // ============================================
  // GESTIONE STATI
  // ============================================

  // Loading State
  if (isLoadingArticle) {
    return (
      <Container size="lg" py="xl">
        <Center style={{ minHeight: '400px' }}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Caricamento articolo...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  // Error State
  if (isErrorArticle || !article) {
    return (
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size="1rem" />}
            onClick={() => navigate('/articles')}
          >
            Torna agli articoli
          </Button>
          
          <Alert
            icon={<IconAlertTriangle size="1.2rem" />}
            title="Errore di Caricamento"
            color="red"
            variant="filled"
          >
            {articleError?.message || 'Impossibile caricare l\'articolo. L\'articolo potrebbe non esistere.'}
          </Alert>
        </Stack>
      </Container>
    );
  }

  // ============================================
  // PREPARAZIONE DATI
  // ============================================

  const authorsText = Array.isArray(article.authors)
    ? article.authors.join(', ')
    : article.authors || 'N.D.';

  // Breadcrumbs
  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Articoli', href: '/articles' },
    { title: article.title, href: '#' },
  ].map((item, index) => (
    <Anchor
      component={Link}
      to={item.href}
      key={index}
      c={index === 2 ? 'dimmed' : undefined}
      size="sm"
    >
      {item.title}
    </Anchor>
  ));

  // ============================================
  // RENDER
  // ============================================

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs separator="›">{breadcrumbItems}</Breadcrumbs>

        {/* Header con Azioni */}
        <Group justify="space-between">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size="1rem" />}
            onClick={() => navigate('/articles')}
          >
            Torna agli articoli
          </Button>

          {isLoggedIn && (
            <Group gap="xs">
              <Button
                variant="light"
                leftSection={<IconEdit size="1rem" />}
                onClick={() => navigate(`/articles/${id}/edit`)}
              >
                Modifica
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<IconTrash size="1rem" />}
                onClick={() => setDeleteModalOpened(true)}
                loading={isDeleting}
              >
                Elimina
              </Button>
            </Group>
          )}
        </Group>

        {/* Card Principale Dettagli Articolo */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            {/* Titolo */}
            <Title order={1} style={{ color: '#C4BFB8' }}>
              {article.title}
            </Title>

            <Divider />

            {/* Metadata Grid */}
            <Group grow align="flex-start">
              <Box>
                <Group gap="xs" mb="xs">
                  <IconUsers size="1.2rem" style={{ color: '#C4BFB8', opacity: 0.8 }} />
                  <Text size="sm" fw={700} c="#C4BFB8" style={{ opacity: 0.8 }}>
                    Autori
                  </Text>
                </Group>
                <Text size="md">{authorsText}</Text>
              </Box>

              <Box>
                <Group gap="xs" mb="xs">
                  <IconCalendar size="1.2rem" style={{ color: '#C4BFB8', opacity: 0.8 }} />
                  <Text size="sm" fw={700} c="#C4BFB8" style={{ opacity: 0.8 }}>
                    Anno di Pubblicazione
                  </Text>
                </Group>
                <Badge size="lg" variant="filled" style={{ backgroundColor: '#0D2513FF', marginLeft: 60}}>
                  {article.year || 'N.D.'}
                </Badge>
              </Box>
            </Group>

            {/* Journal Information */}
            {(article.journal || article.volume || article.issue || article.pages) && (
              <>
                <Divider />
                <Box>
                  <Group gap="xs" mb="xs">
                    <IconBook size="1.2rem" style={{ color: '#C4BFB8', opacity: 0.8 }} />
                    <Text size="sm" fw={700} c="#C4BFB8" style={{ opacity: 0.8 }}>
                      Informazioni di Pubblicazione
                    </Text>
                  </Group>
                  <Stack gap="xs">
                    {article.journal && (
                      <Text size="md">
                        <Text component="span" fw={600}>Journal:</Text> {article.journal}
                      </Text>
                    )}
                    <Group gap="xl">
                      {article.volume && (
                        <Text size="md">
                          <Text component="span" fw={600}>Vol:</Text> {article.volume}
                        </Text>
                      )}
                      {article.issue && (
                        <Text size="md">
                          <Text component="span" fw={600}>Issue:</Text> {article.issue}
                        </Text>
                      )}
                      {article.pages && (
                        <Text size="md">
                          <Text component="span" fw={600}>Pagine:</Text> {article.pages}
                        </Text>
                      )}
                    </Group>
                  </Stack>
                </Box>
              </>
            )}

            {/* Abstract */}
            {article.abstract && (
              <>
                <Divider />
                <Box>
                  <Group gap="xs" mb="md">
                    <IconFileText size="1.2rem" style={{ color: '#C4BFB8', opacity: 0.8 }} />
                    <Text size="sm" fw={700} c="#C4BFB8" style={{ opacity: 0.8 }}>
                      Abstract
                    </Text>
                  </Group>
                  <Text size="md" style={{ lineHeight: 1.7, textAlign: 'justify' }}>
                    {article.abstract}
                  </Text>
                </Box>
              </>
            )}
          </Stack>
        </Paper>

        {/* Sezione Citazioni Correlate */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3} style={{ color: '#C4BFB8' }}>
                Citazioni Correlate
              </Title>
              {citations && citations.length > 0 && (
                <Badge size="lg" variant="light" color="blue">
                  {citations.length}
                </Badge>
              )}
            </Group>

            {isLoadingCitations ? (
              <Group justify="center" mt="md">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">Caricamento citazioni...</Text>
              </Group>
            ) : isErrorCitations ? (
              <Alert
                icon={<IconAlertTriangle size="1rem" />}
                title="Errore"
                color="orange"
                variant="light"
              >
                Impossibile caricare le citazioni correlate.
              </Alert>
            ) : citations && citations.length > 0 ? (
              <Box
                style={{
                  borderLeft: '3px solid #0D2513FF',
                  paddingLeft: '16px',
                  marginTop: '8px'
                }}
              >
                <Stack gap="sm">
                  {citations.map((citation, index) => (
                    <Paper key={citation._id} p="md" withBorder>
                      <Group gap="xs" mb="xs">
                        <Badge size="sm" variant="filled" color="dark">
                          {index + 1}
                        </Badge>
                        {citation.pagesCited && (
                          <Text size="xs" c="dimmed">
                            Pagine: {citation.pagesCited}
                          </Text>
                        )}
                      </Group>
                      <Text size="sm" style={{ wordBreak: 'break-word' }}>
                        {citation.referenceText}
                      </Text>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            ) : (
              <Text c="dimmed" size="sm" ta="center" py="xl">
                Nessuna citazione trovata per questo articolo.
              </Text>
            )}
          </Stack>
        </Paper>

        {/* Modal di Conferma Eliminazione */}
        <Modal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          title="Conferma Eliminazione"
          centered
          size="md"
        >
          <Stack gap="md">
            <Text>
              Sei sicuro di voler eliminare l'articolo{' '}
              <Text component="span" fw={700}>"{article.title}"</Text>?
            </Text>
            <Alert color="red" variant="light" icon={<IconAlertTriangle size="1rem" />}>
              Questa azione è irreversibile e eliminerà anche tutte le citazioni associate.
            </Alert>

            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                onClick={() => setDeleteModalOpened(false)}
                disabled={isDeleting}
              >
                Annulla
              </Button>
              <Button
                color="red"
                onClick={handleDelete}
                loading={isDeleting}
                leftSection={<IconTrash size="1rem" />}
              >
                Elimina Definitivamente
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default ArticleDetailPage;