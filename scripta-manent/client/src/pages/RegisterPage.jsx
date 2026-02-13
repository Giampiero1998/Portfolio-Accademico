import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { apiRegister } from '../services/api';
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

const RegisterPage = () => {
    const navigate = useNavigate();
    const loginUser = useAuthStore((state) => state.loginUser);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: apiRegister,
        onSuccess: (data) => {
            //  Salva utente e token nello store
            loginUser(data);
            //  Notifica di successo
            notifications.show({
                title: 'Registrazione completata',
                message: data.message || 'Benvenuto! Accesso effettuato con successo.',
                color: 'green',
                icon: <IconCheck size="1.1rem" />,
            });

            //  Reindirizza alla dashboard o agli articoli
            navigate('/articles');
        },
        onError: (error) => {
            notifications.show({
                title: 'Errore di Registrazione',
                message: error.message || 'Registrazione non riuscita. Riprova.',
                color: 'red',
                icon: <IconX size="1.1rem" />,
            });
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Paper
            withBorder
            shadow="md"
            p={30}
            mt={30}
            radius="md"
            style={{ size: 'm', maxWidth: 600, margin: 'auto', fontFamily: 'Lora' }}
        >
            <Title align="center" order={3}>Registrati</Title>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <TextInput
                        label="Nome"
                        placeholder="Mario Rossi"
                        withAsterisk
                        error={errors.name?.message}
                        {...register('name', { required: 'Il nome è obbligatorio' })}
                    />
                    <TextInput
                        label="Email"
                        placeholder="esempio@email.com"
                        withAsterisk
                        error={errors.email?.message}
                        {...register('email', { 
                            required: "L'email è obbligatoria", 
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Inserisci un\'email valida',
                            },
                        })}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Crea una password "
                        withAsterisk
                        error={errors.password?.message}
                        {...register('password', { 
                            required: 'La password è obbligatoria',
                            minLength: { value: 6, message: 'Inserisci almeno sei caratteri' },
                        })}
                    />
                    <PasswordInput
                        label="Conferma Password"
                        placeholder="Ripeti la password"
                        withAsterisk
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', { 
                            required: 'Conferma la password',
                            validate: (value) =>
                                value === watch('password') || 'Le password non coincidono',
                        })}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        mt="xl"
                        loading={mutation.isLoading}
                        style={{ backgroundColor: '#0D2513FF' }}
                    >
                        Registrati
                    </Button>
                </Stack>
            </form>
            {/* Link al login */}
            <Text size="sm" align="center" mt="md">
                Hai già un account?{' '}
                <Anchor component={Link} to="/login" size="sm" style={{ color: '#A30909FF' }}>
                    Accedi qui
                </Anchor>
            </Text>
        </Paper>
    );
};

export default RegisterPage;

