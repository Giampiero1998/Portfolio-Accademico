import React, { useState, useEffect } from 'react';
import {
  Stack,
  TextInput,
  Select,
  Divider,
  Button,
  Group,
  Text
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useArticleFilters } from '../hooks/useArticleFilters';

const Sidebar = ({ AnnoDiPubblicazione = false, Autore = false }) => {
  const { filters, updateFilters, resetFilters, hasActiveFilters } = useArticleFilters();
  
  // Stato locale per gestire gli input prima di applicare i filtri
  const [localFilters, setLocalFilters] = useState({
    year: '',
    authors: '',
    q: '',
  });

  // Sincronizza lo stato locale con i filtri dall'URL quando cambiano
  useEffect(() => {
    setLocalFilters({
      year: filters.year || '',
      authors: filters.authors || '',
      q: filters.q || '',
    });
  }, [filters]);

  const handleChange = (field, value) => {
    setLocalFilters({ ...localFilters, [field]: value });
  };

  const handleReset = () => {
    setLocalFilters({ year: '', authors: '', q: '' });
    resetFilters(); // Cancella la query string dall'URL
  };

  const handleSearch = () => {
    // Aggiorna i filtri nell'URL (trigger ricerca)
    updateFilters({
      year: localFilters.year,
      authors: localFilters.authors,
      q: localFilters.q,
    });
  };

  return (
    <Stack spacing="xs">
      {AnnoDiPubblicazione && (
        <>
          <Text size="sm" fw={700} c="#0D2513FF" style={{ opacity: 0.8 }}>
            Anno di pubblicazione
          </Text>
          <Select
            placeholder="Seleziona un anno"
            value={localFilters.year}
            onChange={(value) => handleChange('year', value)}
            data={[
              { value: '2025', label: '2025' },
              { value: '2024', label: '2024' },
              { value: '2023', label: '2023' },
              { value: '2022', label: '2022' },
              { value: '2021', label: '2021' },
              { value: '2020', label: '2020' },
            ]}
            size='xs'
          />
          <Divider />
        </>
      )}

      {Autore && (
        <>
          <Text size="sm" fw={700} c="#0D2513FF" style={{ opacity: 0.8 }}>
            Autore
          </Text>
          <TextInput
            placeholder="Cerca per autore"
            value={localFilters.authors}
            onChange={(e) => handleChange('authors', e.target.value)}
            size='xs'
          />
          <Divider />
        </>
      )}

      {/* Filtro generico per titolo */}
      <Text size="sm" fw={700} c="#0D2513FF" style={{ opacity: 0.8 }}>
        Titolo
      </Text>
      <TextInput
        placeholder="Cerca per titolo"
        value={localFilters.q}
        onChange={(e) => handleChange('q', e.target.value)}
        size='xs'
      />

      <Group grow mt="md">
        <Button
          variant="filled"
          style={{ backgroundColor: '#0D2513FF' }} 
          leftSection={<IconSearch size={16} />}
          onClick={handleSearch}
          size='xs'
        >
          Cerca
        </Button>
        <Button
          variant="outline"
          style={{ color: '#FFFFFF' }} 
          leftSection={<IconX size={16} />}
          onClick={handleReset}
          size="xs"
          disabled={!hasActiveFilters && localFilters.year === '' && localFilters.authors === '' && localFilters.q === ''}
        >
          Reset
        </Button>
      </Group>
    </Stack>
  );
};

export default Sidebar;