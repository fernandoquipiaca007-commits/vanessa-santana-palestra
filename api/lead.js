// Função serverless (roda só no servidor da Vercel — o token do Infinitum nunca
// chega ao navegador do visitante). Recebe o lead do formulário e cria um card
// no Infinitum. Credenciais vêm de variáveis de ambiente do projeto na Vercel
// (Project Settings → Environment Variables), nunca ficam no código:
//
//   INFINITUM_TOKEN     - header X-Public-Token
//   INFINITUM_POP_ID    - POP de destino
//   INFINITUM_PHASE_ID  - fase inicial do POP
//   INFINITUM_FIELD_NOME, INFINITUM_FIELD_EMAIL, INFINITUM_FIELD_WHATSAPP,
//   INFINITUM_FIELD_LGPD, INFINITUM_FIELD_CONFIRM - field_id do formulário
//   INFINITUM_LGPD_VALUE, INFINITUM_CONFIRM_VALUE - valor fixo exigido por esses
//     dois campos (ex.: "Autorizo" e "Confirmo")

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const {
    INFINITUM_TOKEN,
    INFINITUM_POP_ID,
    INFINITUM_PHASE_ID,
    INFINITUM_FIELD_NOME,
    INFINITUM_FIELD_EMAIL,
    INFINITUM_FIELD_WHATSAPP,
    INFINITUM_FIELD_LGPD,
    INFINITUM_FIELD_CONFIRM,
    INFINITUM_LGPD_VALUE,
    INFINITUM_CONFIRM_VALUE
  } = process.env;

  if (!INFINITUM_TOKEN || !INFINITUM_POP_ID || !INFINITUM_PHASE_ID) {
    console.error('Variáveis de ambiente do Infinitum não configuradas nesta Vercel.');
    return res.status(500).json({ error: 'infinitum_not_configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const nome = String(body.nome || '').trim();
    const email = String(body.email || '').trim();
    const whatsapp = String(body.whatsapp || '').trim();

    if (!nome || !email || !whatsapp) {
      return res.status(400).json({ error: 'nome, email e whatsapp são obrigatórios' });
    }

    const origem = [];
    if (body.utm_source) origem.push(`utm_source: ${body.utm_source}`);
    if (body.utm_medium) origem.push(`utm_medium: ${body.utm_medium}`);
    if (body.utm_campaign) origem.push(`utm_campaign: ${body.utm_campaign}`);
    if (body.utm_content) origem.push(`utm_content: ${body.utm_content}`);
    if (body.page_url) origem.push(`página: ${body.page_url}`);

    const values = [];
    if (INFINITUM_FIELD_NOME) values.push({ field_id: INFINITUM_FIELD_NOME, value: nome });
    if (INFINITUM_FIELD_EMAIL) values.push({ field_id: INFINITUM_FIELD_EMAIL, value: email });
    if (INFINITUM_FIELD_WHATSAPP) values.push({ field_id: INFINITUM_FIELD_WHATSAPP, value: whatsapp });
    if (INFINITUM_FIELD_LGPD) values.push({ field_id: INFINITUM_FIELD_LGPD, value: INFINITUM_LGPD_VALUE || 'Autorizo' });
    if (INFINITUM_FIELD_CONFIRM) values.push({ field_id: INFINITUM_FIELD_CONFIRM, value: INFINITUM_CONFIRM_VALUE || 'Confirmo' });

    const faltando = ['EMAIL', 'WHATSAPP', 'LGPD', 'CONFIRM'].filter((k) => !process.env['INFINITUM_FIELD_' + k]);
    if (faltando.length) console.warn('Campos do Infinitum sem field_id configurado (ignorados):', faltando.join(', '));

    const payload = {
      pop_id: INFINITUM_POP_ID,
      phase_id: INFINITUM_PHASE_ID,
      // O WhatsApp vai também no título: assim aparece na lista de cards mesmo que o
      // campo do formulário do Infinitum não esteja mapeado (INFINITUM_FIELD_WHATSAPP).
      title: `Lead - ${nome} - ${whatsapp}`.slice(0, 200),
      description: ['Inscrição recebida pela landing page.', `Nome: ${nome}`, `E-mail: ${email}`, `WhatsApp: ${whatsapp}`, ...origem].join(' | '),
      values
    };

    const resp = await fetch('https://public.infinitum.app.br/api/v1/public/cards', {
      method: 'POST',
      headers: {
        'X-Public-Token': INFINITUM_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      console.error('Infinitum recusou o card:', resp.status, data);
      return res.status(502).json({ error: 'infinitum_failed', detail: data });
    }

    return res.status(201).json({ ok: true, card_id: data && data.data && data.data.id });
  } catch (err) {
    console.error('Erro ao criar lead no Infinitum:', err);
    return res.status(500).json({ error: 'internal_error' });
  }
};
