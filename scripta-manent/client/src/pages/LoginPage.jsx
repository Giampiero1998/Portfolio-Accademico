import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { apiLogin } from '../services/api';
import { notifications } from '@mantine/notifications';
import { 
    Paper, 
    Title, 
    Stack, 
    TextInput, 
    PasswordInput, 
    Button,
    Text,
    Anchor
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

const LoginPage = () => {
    const navigate = useNavigate();
    // Usa lo store Zustand per gestire l'autenticazione
    const loginUser = useAuthStore((state) => state.loginUser);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: apiLogin,
        onSuccess: (data) => {
            // 1. Salva i dati nello store Zustand
            loginUser(data); 
            
            // 2. Mostra notifica
            notifications.show({
                title: 'Accesso Riuscito',
                message: 'Bentornato!',
                color: '#0D2513FF',
                icon: <IconCheck size="1.1rem" />,
            });
            
            // 3. Reindirizza alla dashboard o ad articles
            navigate('/articles'); 
        },
        onError: (error) => {
            notifications.show({
                title: 'Errore di Accesso',
                message: error.message || 'Credenziali non valide.',
                color: 'red',
                icon: <IconX size="1.1rem" />,
            });
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ size: 'm', maxWidth: 600, margin: 'auto', fontFamily: 'Lora' }}>
            <Title align="center" order={3}>Login</Title>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <TextInput
                        label="E-mail"
                        placeholder="esempio@email.com"
                        withAsterisk
                        error={errors.email?.message}
                        {...register('email', { required: 'L\'email è obbligatoria' })}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="La tua password"
                        withAsterisk
                        error={errors.password?.message}
                        {...register('password', { required: 'La password è obbligatoria' })}
                    />
                    <Button 
                        type="submit" 
                        fullWidth 
                        mt="xl" 
                        loading={mutation.isLoading}
                        style={{ backgroundColor: '#0D2513FF' }}
                    >
                        Accedi
                    </Button>
                </Stack>
            </form>
            {/* Link alla registrazione */}
            <Text size="sm" align="center" mt="md">
                Non hai un account?{' '}
                <Anchor component={Link} to="/register" size="sm" style={{ color: '#A30909FF' }}>
                    Registrati qui
                </Anchor>
            </Text>

        </Paper>
    );
};

export default LoginPage;