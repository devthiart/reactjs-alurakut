// BFF (Backend from Frontend) para acessar o DatoCMS de maneira segura.

import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
  if(request.method === 'POST') {
    //O usuário não tem acesso à este token, pois este código é executado no backend (BFF)
    const TOKEN = '3779d808b432da582c39d9f512f9ba';
    const client = new SiteClient(TOKEN);

    // Importante validar os dados antes de executar.
    const registroCriado = await client.items.create({
      itemType: '967821', //ID do model de comunidades criado pelo DatoCMS.
      ...request.body,
    });
    
    // const registroCriado = await client.items.create({
    //   itemType: '967821', //ID do model de comunidades criado pelo DatoCMS.
    //   title: 'TituloDaComunidade',
    //   imageUrl: 'http://urldaimagem.com',
    //   creatorSlug: 'CriadorDaComunidade',
    // });
  
    response.json({
      dados: 'Algum dado qualquer',
      registroCriado: registroCriado,
    });

    return;
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, utilize o POST.',
  })
}