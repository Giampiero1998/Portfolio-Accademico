import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { useDeleteArticle } from '../../hooks/useArticles';
import { getCitationsByArticleId } from '../../services/api';

// Componenti e Stile Mantine/Tabler
import { 
    Card, 
    Text, 
    Button, 
    Collapse, 
    Group, 
    Box, 
    Loader, 
    Alert, 
    Stack, 
    ActionIcon, 
    Title,
    Anchor,
    Badge,
    Menu
} from '@mantine/core';
import { 
    IconChevronDown, 
    IconAlertTriangle, 
    IconDots,
    IconEdit,
    IconTrash,
    IconEye
} from '@tabler/icons-react';

// CitationsPanel Component (Fetching e Rendering Citazioni)
const CitationsPanel = ({ articleId }) => {
    const { 
        data: citations, 
        isLoading, 
        isError 
    } = useQuery({
        queryKey: ['citations', articleId],
        queryFn: () => getCitationsByArticleId(articleId),
        staleTime: 5 * 60 * 1000, 
        enabled: !!articleId,
    });

    if (isLoading) {
        return (
            <Group justify="center" mt="md">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">Caricamento citazioni...</Text>
            </Group>
        );
    }
    
    if (isError) {
        return (
            <Alert 
                title="Errore Citazioni" 
                color="red" 
                variant="light" 
                icon={<IconAlertTriangle size="1rem" />}
                mt="md"
            >
                Impossibile caricare le citazioni.
            </Alert>
        );
    }

    return (
        <Box 
            style={{ 
                marginTop: '16px', 
                borderLeft: '3px solid var(--mantine-color-blue-6)', 
                paddingLeft: '16px' 
            }}
        >
            <Text fw={700} size="md">
                Citazioni Associate ({citations?.length || 0}):
            </Text>
            <Stack gap={4} mt={4}>
                {!citations || citations.length === 0 ? (
                    <Text size="sm" c="dimmed">Nessuna citazione trovata.</Text>
                ) : (
                    citations.map((citation, index) => (
                        <Text key={citation._id} size="sm" style={{ wordBreak: 'break-word' }}>
                            {index + 1}. {citation.referenceText}
                        </Text>
                    ))
                )}
            </Stack>
        </Box>
    );
};

// --- ArticleCard Component (Card principale e Collapse) ---
const ArticleCard = ({ article }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    // Hook per delete con optimistic removal
    const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Handler per eliminazione con conferma
    const handleDelete = () => {
        if (window.confirm(`Sei sicuro di voler eliminare "${article.title}"?`)) {
            deleteArticle(article._id);
        }
    };

    // Estrae gli autori
    const authorsText = Array.isArray(article.authors) 
        ? article.authors.join(', ') 
        : article.authors || 'N.D.';

    return (
        <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder
            style={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
            }}
        >
            <Stack gap="xs" style={{ flexGrow: 1 }}>
                {/* Header con Titolo e Menu Azioni */}
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Stack gap={4} style={{ flexGrow: 1, minWidth: 0 }}>
                        {/* Titolo come Link */}
                        <Anchor 
                            component={Link} 
                            to={`/articles/${article._id}`}
                            underline="hover"
                            c="dark"
                            style={{ fontWeight: 600 }}
                        >
                            <Title order={4} lineClamp={2}>
                                {article.title}
                            </Title>
                        </Anchor>
                        
                        {/* Metadata: Autori e Anno */}
                        <Group gap="xs" wrap="nowrap">
                            <Text size="sm" c="dimmed" lineClamp={1} style={{ flexGrow: 1 }}>
                                {authorsText}
                            </Text>
                            <Badge size="sm" variant="light" color="blue">
                                {article.year}
                            </Badge>
                        </Group>

                        {/* Journal (se presente) */}
                        {article.journal && (
                            <Text size="xs" c="dimmed" lineClamp={1} fs="italic">
                                {article.journal}
                            </Text>
                        )}
                    </Stack>
                    
                    {/* Menu Azioni (solo per utenti loggati) */}
                    {isLoggedIn && (
                        <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                                <ActionIcon 
                                    variant="subtle" 
                                    color="gray"
                                    style={{ flexShrink: 0 }}
                                >
                                    <IconDots size="1.2rem" />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Azioni</Menu.Label>
                                <Menu.Item
                                    leftSection={<IconEye size="1rem" />}
                                    onClick={() => navigate(`/articles/${article._id}`)}
                                >
                                    Visualizza
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconEdit size="1rem" />}
                                    onClick={() => navigate(`/articles/${article._id}/edit`)}
                                >
                                    Modifica
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                    color="red"
                                    leftSection={<IconTrash size="1rem" />}
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Eliminazione...' : 'Elimina'}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )}
                </Group>

                {/* Spacer per spingere il bottone in basso */}
                <div style={{ flexGrow: 1 }} />

                {/* Bottone Espandi/Comprimi Citazioni */}
                <Group justify="flex-start" mt="md" gap="xs">
                    <Button 
                        onClick={handleExpandClick} 
                        size="xs"
                        variant="light"
                        leftSection={
                            <Box
                                component="span"
                                style={{
                                    display: 'inline-flex',
                                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                }}
                            >
                                <IconChevronDown size="1rem" />
                            </Box>
                        }
                        fullWidth
                    >
                        {expanded ? 'Nascondi' : 'Mostra'} Citazioni ({article.citations?.length || 0})
                    </Button>
                </Group>
            </Stack>
            
            {/* Collapse per CitationsPanel */}
            <Collapse in={expanded}>
                <CitationsPanel articleId={article._id} />
            </Collapse>
        </Card>
    );
};

export default ArticleCard;