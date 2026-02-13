import React from 'react';  
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { 
  Container, 
  Stack, 
  Box, 
  Text,
  Drawer,
  Grid,
  Paper,
  Title,
  Burger,
  useMantineTheme 
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';


const Layout = () => {
  const theme = useMantineTheme();
  const [opened, { toggle, close }] = useDisclosure(false);
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  
 // Controlla il percorso attuale
  const location = useLocation();
 // Mostra la sidebar solo sulla pagina degli articoli
  const showSidebar = location.pathname === '/articles'; 

  return (
    <Stack 
        spacing={0} 
        style={{ 
            minHeight: '100vh', 
            backgroundColor: '#C4BFB8',
            position: 'relative', 
        }}
    >
      
      {/* 1. NavBar in alto - Fissa in alto */}
      <Box style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: '#C4BFB8',
        borderBottom: '1px solid var(--mantine-color-gray-3)',
      }}>
        <NavBar>
          {/* Mostra il Burger solo su mobile e solo se c'è una Sidebar da mostrare */}
          {!isDesktop && showSidebar && (
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              color="#0D2513FF"
              mr="sm"
            />
          )}
        </NavBar>
      </Box>

      {/* Drawer per la Sidebar su mobile */}
      {!isDesktop && showSidebar && (
        <Drawer 
          opened={opened} 
          onClose={close} 
          title="Filtri Articoli" 
          size="xs"
          padding="md"
          zIndex={100} 
          hiddenFrom="md"
          styles={{ 
            body: { backgroundColor: '#C4BFB8' }, 
            content: { backgroundColor: '#C4BFB8' }
          }}
        >
          <Sidebar AnnoDiPubblicazione={true} Autore={true} />
        </Drawer>
      )}

      {/* 2. Contenuto principale con Grid */}
      <Container 
        size="xl" 
        component={Box} 
        style={{ 
            flexGrow: 1, 
            paddingTop: '30px', 
            paddingBottom: '50px', 
            display: 'flex', 
            flexDirection: 'column' 
        }}
      >
        <Grid style={{ flexGrow: 1 }}>

          {/* Sidebar su desktop */}
          {showSidebar && isDesktop && (
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper 
                withBorder 
                p="md" 
                style={{ 
                  position: 'sticky', 
                  top: '80px', 
                  backgroundColor: '#C4BFB8',
                  borderColor: '#A9A49D',
                  padding: '1rem',
                  marginRight: 'auto',
                  marginLeft: 'auto'
                }}
              >
                <Title order={5} mb="md" c='#0D2513FF'>Filtri</Title>
                <Sidebar AnnoDiPubblicazione={true} Autore={true} />
              </Paper>
            </Grid.Col>
          )}

          {/* Contenuto principale */}
          <Grid.Col 
            span={{ base: 12, md: showSidebar ? 9 : 12 }} 
            style={{ flexGrow: 1 }}
          >
            <Outlet /> {/* Renderizza il contenuto delle rotte */}
          </Grid.Col>
        </Grid>
      </Container>
      
      {/* 3. Footer semplice */}
      <Box component="footer" py="md" style={{ 
        borderTop: '1px solid var(--mantine-color-gray-3)', 
        textAlign: 'center', 
        backgroundColor: '#C4BFB8',
        zIndex: 10,
      }}>
        <Text size="sm" c="dimmed">
          © {new Date().getFullYear()} Scripta Manent Portfolio.
        </Text>
      </Box>

    </Stack>
  );
};

export default Layout;