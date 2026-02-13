import React from 'react';
import { Group, Button, Title, Box, Text, Anchor, Image } from '@mantine/core'; 
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { IconLogin, IconLogout, IconUserPlus } from '@tabler/icons-react';

// Componente NavBar con gestione autenticazione
const NavBar = ({ children }) => {
    const navigate = useNavigate();
    
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const logoutUser = useAuthStore((state) => state.logoutUser);
    const user = useAuthStore((state) => state.user);

    const handleLogout = () => {
        logoutUser();
        navigate('/'); 
    };

    const logoPath = '/icona.png'; // Percorso del logo situato in /public

    return (
        <Box 
            component="header"  
            p="md"
            style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                width: '100%',
                backgroundColor: '#C4BFB8',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}
        >
            <Group gap={'sm'} align='center'>
                {/* Mostra il Burger passato da Layout solo se esiste */}
                {children}

                {/* Logo del sito */}
                <Image
                    src={logoPath}
                    alt="Logo Portfolio"
                    w={50} // Larghezza (width)
                    h={50} // Altezza (height)
                    radius="sm"
                    style={{ backgroundColor: 'transparent' }}
                    // Immagine segnaposto se il tuo file non viene trovato
                    fallbackSrc="https://placehold.co/40x40/C4BFB8/0D2513FF?text=LOGO"
                />

                <Title 
                    order={3} 
                    component={Link} 
                    to="/" 
                    style={{ textDecoration: 'none', color: '#0D2513FF', fontWeight: 600, fontSize: '1.5rem', fontFamily: 'Lora' }}
                >
                    Scripta Manent Portfolio
                </Title>
            </Group>

            {/* Link di navigazione ed autenticazione a destra */}
            <Group>
                <Anchor 
                    variant="subtle" 
                    underline={false}
                    style={{ color: '#0D2513FF', fontFamily: 'Lora', fontWeight: 400, fontSize: '1rem' }}
                    component={Link} 
                    to="/articles"
                >
                    Articoli
                </Anchor>
            </Group>
            
            <Group gap={'xs'}>
                {isLoggedIn ? (
                    <Group gap="xs">
                        {user && <Text size="sm" style={{ color: '#0D2513FF', fontFamily: 'Lora', fontWeight: 400 }}>Ciao, {user.email.split('@')[0]}</Text>}
                        <Button 
                            variant="filled" 
                            color="red" 
                            onClick={handleLogout}
                            leftSection={<IconLogout size={16} />}
                        >
                            Logout
                        </Button>
                    </Group>
                ) : (
                    <Group gap="xs">
                        <Button 
                            variant="filled" 
                            color='#0D2513FF'
                            component={Link} 
                            to="/login"
                            leftSection={<IconLogin size={16} />}
                        >
                            Accedi
                        </Button>
                        <Button 
                            variant="filled"
                            color='#0D2513FF'
                            component={Link} 
                            to="/register"
                            leftSection={<IconUserPlus size={16} />}
                        >
                            Registrati
                        </Button>
                    </Group>
                )}
            </Group>
        </Box>
    );
};

export default NavBar;