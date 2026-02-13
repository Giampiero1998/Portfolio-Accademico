import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { notifications } from '@mantine/notifications';
import {
  Title,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Group,
  Center,
  Loader,
  Alert,
  Container
} from '@mantine/core';
import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';
import { useArticle, useCreateArticle, useUpdateArticle } from '../../hooks/useArticles';

const ArticleForm = ({ isEdit = false }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { id } = useParams();
  const navigate = useNavigate();

  //  1. Query per caricare articolo esistente (solo in Edit mode)
  const { 
    data: initialArticle, 
    isLoading: isFetching, 
    isError: fetchError,
  } = useArticle(id, {
    enabled: isEdit && !!id, // Esegui query solo se in edit mode
  });

  //  2. Mutations con cache invalidation automatica
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  // Seleziona la mutation corretta
  const mutation = isEdit ? updateMutation : createMutation;

  // 3. Configurazione React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    defaultValues: {
      title: '',
      authors: '',
      year: new Date().getFullYear(),
      journal: '',
      abstract: ''
    }
  });

  // 4. Effect per riempire il form in modalità Edit
  useEffect(() => {
    if (isEdit && initialArticle) {
      const formValues = {
        title: initialArticle.title || '',
        authors: Array.isArray(initialArticle.authors) 
          ? initialArticle.authors.join(', ') 
          : (initialArticle.authors || ''),
        year: initialArticle.year || new Date().getFullYear(),
        journal: initialArticle.journal || '',
        abstract: initialArticle.abstract || '',
        volume: initialArticle.volume || '',
        issue: initialArticle.issue || '',
        pages: initialArticle.pages || '',
      };
      reset(formValues);
    }
  }, [initialArticle, isEdit, reset]);

  // 5. Gestione dell'invio del form
  const onSubmit = async (data) => {
    try {
      // Formatta i dati
      const formattedData = {
        title: data.title.trim(),
        authors: data.authors
          .split(',')
          .map(a => a.trim())
          .filter(a => a.length > 0),
        year: parseInt(data.year, 10),
        journal: data.journal?.trim() || undefined,
        abstract: data.abstract?.trim() || undefined,
        volume: data.volume?.trim() || undefined,
        issue: data.issue?.trim() || undefined,
        pages: data.pages?.trim() || undefined,
      };

      //  Chiama la mutation corretta
      if (isEdit) {
        await updateMutation.mutateAsync({ id, data: formattedData });
        navigate(`/articles/${id}`); // Redirect al dettaglio
      } else {
        const newArticle = await createMutation.mutateAsync(formattedData);
        navigate(`/articles/${newArticle._id}`); // Redirect al nuovo articolo
      }
    } catch (error) {
      // Errore già gestito dai hooks con notifications
      console.error('Form submit error:', error);
    }
  };
  
  // 6. Check autenticazione
  if (!isLoggedIn) {
    notifications.show({
      title: 'Accesso Negato',
      message: 'Devi essere loggato per creare o modificare articoli.',
      color: 'red',
      icon: <IconX size="1.1rem" />,
      autoClose: 5000,
    });
    return <Navigate to="/login" replace />;
  }

  // 7. Stati di Caricamento/Errore (Modalità Edit)
  if (isEdit) {
    if (isFetching) {
      return (
        <Container size="sm" py="xl">
          <Center style={{ minHeight: '300px' }}>
            <Stack align="center" spacing="md">
              <Loader size="lg" />
              <Title order={4} c="dimmed">Caricamento articolo...</Title>
            </Stack>
          </Center>
        </Container>
      );
    }

    if (fetchError) {
      return (
        <Container size="sm" py="xl">
          <Alert 
            icon={<IconAlertTriangle size="1.2rem" />} 
            title="Errore" 
            color="red"
            variant="filled"
          >
            Errore durante il caricamento dell'articolo. 
            <Button 
              variant="white" 
              size="xs" 
              mt="sm"
              onClick={() => navigate('/articles')}
            >
              Torna alla lista
            </Button>
          </Alert>
        </Container>
      );
    }

    if (!initialArticle) {
      return (
        <Container size="sm" py="xl">
          <Alert 
            icon={<IconAlertTriangle size="1.2rem" />} 
            title="Non Trovato" 
            color="yellow"
          >
            Articolo non trovato.
            <Button 
              variant="light" 
              size="xs" 
              mt="sm"
              onClick={() => navigate('/articles')}
            >
              Torna alla lista
            </Button>
          </Alert>
        </Container>
      );
    }
  }

  // 8. Render del Form
  return (
    <Container size="sm" py="xl">
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing="md"
      >
        <Title order={2}>
          {isEdit ? 'Modifica Articolo' : 'Nuovo Articolo'}
        </Title>

        {/* Titolo */}
        <TextInput
          label="Titolo"
          placeholder="Inserisci il titolo dell'articolo"
          withAsterisk
          error={errors.title?.message}
          {...register('title', { 
            required: 'Il titolo è obbligatorio',
            minLength: { value: 3, message: 'Il titolo deve essere di almeno 3 caratteri' }
          })}
        />

        {/* Autori */}
        <TextInput
          label="Autori"
          placeholder="Smith John, Doe Jane"
          description="Separa più autori con virgola"
          withAsterisk
          error={errors.authors?.message}
          {...register('authors', { 
            required: 'Almeno un autore è obbligatorio',
            validate: {
              notEmpty: (value) => {
                const authors = value.split(',').map(a => a.trim()).filter(Boolean);
                return authors.length > 0 || 'Inserisci almeno un autore';
              }
            }
          })}
        />

        {/* Anno */}
        <NumberInput
          label="Anno di pubblicazione"
          placeholder="2024"
          min={1800}
          max={new Date().getFullYear()}
          hideControls={false}
          withAsterisk
          error={errors.year?.message}
          {...register('year', { 
            required: 'L\'anno è obbligatorio',
            min: { value: 1800, message: 'Anno non valido (minimo 1800)' },
            max: { value: new Date().getFullYear(), message: 'Anno non può essere futuro' }
          })}
        />

        {/* Journal */}
        <TextInput
          label="Journal/Rivista"
          placeholder="Nome della rivista scientifica"
          error={errors.journal?.message}
          {...register('journal')}
        />

        {/* Volume, Issue, Pages (opzionali) */}
        <Group grow>
          <TextInput
            label="Volume"
            placeholder="Vol. 10"
            {...register('volume')}
          />
          <TextInput
            label="Issue"
            placeholder="No. 3"
            {...register('issue')}
          />
          <TextInput
            label="Pagine"
            placeholder="123-145"
            {...register('pages')}
          />
        </Group>
        
        {/* Abstract */}
        <Textarea
          label="Abstract"
          placeholder="Inserisci un breve riassunto dell'articolo"
          minRows={5}
          maxRows={10}
          autosize
          error={errors.abstract?.message}
          {...register('abstract', {
            maxLength: { value: 5000, message: 'Abstract troppo lungo (max 5000 caratteri)' }
          })}
        />
        
        {/* Bottoni */}
        <Group justify="space-between" mt="xl">
          <Button 
            variant="subtle" 
            color="gray"
            onClick={() => navigate('/articles')}
            disabled={mutation.isPending}
          >
            Annulla
          </Button>
          
          <Button 
            type="submit" 
            variant="filled" 
            loading={mutation.isPending}
            leftSection={<IconCheck size="1rem" />}
          >
            {isEdit ? 'Salva Modifiche' : 'Crea Articolo'}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default ArticleForm;