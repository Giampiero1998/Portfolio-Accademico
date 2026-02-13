// /docs/src/pages/api-reference.js

import React from 'react';
import Layout from '@theme/Layout';
import { ApiReference } from '@scalar/hono-api-reference-react'; // Assumendo l'uso di Scalar

export default function ApiReferencePage() {
  return (
    <Layout title="API Reference" description="Documentazione completa dell'API RESTful CRUD.">
      <div style={{ height: '100vh' }}>
        {/* Componente di visualizzazione API */}
        <ApiReference
          // Carica il file YAML statico creato
          specUrl="/openapi.yaml" 
          configuration={{
            layout: 'modern'
          }}
        />
      </div>
    </Layout>
  );
}