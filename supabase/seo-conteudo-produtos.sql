-- Aurum Peptide -- Conteudo de SEO por produto (title/description/slug),
-- + backfill da coluna legada `categoria` para produtos que ja tem
-- categoria_id definido mas ficaram sem o texto legado usado no fallback
-- de meta description e no breadcrumb (ver apps/site/lib/seo.ts).
--
-- Como aplicar: Supabase Dashboard > SQL Editor > New query, cole e rode
-- este arquivo inteiro (mesmo fluxo ja usado para schema.sql, seo.sql etc).
-- Nenhuma coluna nova, so UPDATE nos campos seo_title/seo_description/
-- seo_slug/categoria dos produtos ativos publicados hoje (29 produtos).

-- Água Bacteriostática 3ml – Diluente para Preparações Peptídicas
update produtos set seo_title = 'Água Bacteriostática 3ml – Diluente Estéril', seo_description = 'Água bacteriostática estéril 3ml, frasco multidose, para reconstituição e diluição de peptídeos. Uso em pesquisa. Atendimento pelo WhatsApp.', seo_slug = 'agua-bacteriostatica-3ml' where id = '9ea668d7-71e8-46a2-96b2-f98369ab5c64';

-- Água Destilada Estéril 10ml para Diluir Uso Clínico
update produtos set seo_title = 'Água Destilada Estéril 10ml – Uso Clínico', seo_description = 'Água destilada estéril 10ml, uso único e descartável. Indicada para diluição, higienização e preparo de soluções. Atendimento pelo WhatsApp.', seo_slug = 'agua-destilada-esteril-10ml' where id = '9c0fc6ce-501a-4b11-b917-a7288b2c04b5';

-- Alluvi® BPC-157 + TB-500 40mg – Blend de Peptídeos
update produtos set seo_title = 'Alluvi® BPC-157 + TB-500 40mg – Blend', seo_description = 'Blend Alluvi® BPC-157 + TB-500 40mg, caneta pré-preenchida, para pesquisa em recuperação e regeneração tecidual. Atendimento pelo WhatsApp.', seo_slug = 'alluvi-bpc-157-tb-500-40mg', categoria = 'Blend' where id = '0d594793-05ef-49ed-a49c-6ddbbd0e7399';

-- Alluvi® GLOW 70mg – Blend de Peptídeos | GHK-Cu + BPC-157 + TB-500
update produtos set seo_title = 'Alluvi® GLOW 70mg – GHK-Cu + BPC-157 + TB-500', seo_description = 'Alluvi® GLOW 70mg: blend GHK-Cu + BPC-157 + TB-500 em caneta pré-preenchida, para pesquisa em pele, cabelo e regeneração. Fale no WhatsApp.', seo_slug = 'alluvi-glow-70mg', categoria = 'Glow' where id = 'cd5387b0-ba61-4f1f-88c7-9b2af2230251';

-- Bio-Tirz® NAD+ 1000mg
update produtos set seo_title = 'Bio-Tirz® NAD+ 1000mg – Premium', seo_description = 'Bio-Tirz® NAD+ 1000mg, formulação premium para protocolos de metabolismo energético e longevidade celular. Atendimento pessoal pelo WhatsApp.', seo_slug = 'bio-tirz-nad-1000mg' where id = 'ee670b1c-bf6a-48d3-87ed-f413b2af94fe';

-- Biogenesis® BPC-157 5mg – Peptídeo Liofilizado
update produtos set seo_title = 'Biogenesis® BPC-157 5mg – Liofilizado', seo_description = 'Biogenesis® BPC-157 5mg liofilizado, produzido no Canadá, acompanha água bacteriostática. Para pesquisa em recuperação tecidual. WhatsApp.', seo_slug = 'biogenesis-bpc-157-5mg' where id = 'deea3ee5-e935-481b-9b8d-7792d2bbf944';

-- Biogenesis® GHK-Cu 100mg
update produtos set seo_title = 'Biogenesis® GHK-Cu 100mg – Liofilizado', seo_description = 'Biogenesis® GHK-Cu 100mg liofilizado, produzido no Canadá, acompanha água bacteriostática. Pesquisa em pele e cabelo. Fale no WhatsApp.', seo_slug = 'biogenesis-ghk-cu-100mg' where id = 'b84ed88c-f260-4b49-8347-7a6fc67828f9';

-- Biogenesis® GLOW 70mg – Blend Peptídico
update produtos set seo_title = 'Biogenesis® GLOW 70mg – Blend Peptídico', seo_description = 'Biogenesis® GLOW 70mg: blend GHK-Cu + BPC-157 + TB-500, produzido no Canadá, para pesquisa em pele e regeneração. Atendimento pelo WhatsApp.', seo_slug = 'biogenesis-glow-70mg' where id = 'c3e971dc-5c9b-4e79-824d-a7c263a46b07';

-- Biogenesis® Ipamorelin 10mg – Peptídeo Liofilizado
update produtos set seo_title = 'Biogenesis® Ipamorelin 10mg – Liofilizado', seo_description = 'Biogenesis® Ipamorelin 10mg liofilizado, produzido no Canadá, para pesquisa em composição corporal e recuperação. Fale no WhatsApp.', seo_slug = 'biogenesis-ipamorelin-10mg' where id = '9402d7ff-0eb0-470a-9ac2-3422e5139335';

-- Biogenesis® MOTS-C 10mg – Peptídeo Liofilizado
update produtos set seo_title = 'Biogenesis® MOTS-C 10mg – Liofilizado', seo_description = 'Biogenesis® MOTS-C 10mg liofilizado, produzido no Canadá, para pesquisa em metabolismo energético e desempenho físico. WhatsApp.', seo_slug = 'biogenesis-mots-c-10mg' where id = '724ffd1f-3921-44d4-9ddd-5b97d8ac0d26';

-- Biogenesis® NAD+ 1000mg
update produtos set seo_title = 'Biogenesis® NAD+ 1000mg – Premium', seo_description = 'Biogenesis® NAD+ 1000mg, produzido no Canadá, para protocolos de metabolismo energético e longevidade celular. Fale no WhatsApp.', seo_slug = 'biogenesis-nad-1000mg' where id = '4c8ec96a-6738-4a27-bbb4-b834425a91de';

-- Biogenesis® TB-500 10mg – Peptídeo Liofilizado
update produtos set seo_title = 'Biogenesis® TB-500 10mg – Liofilizado', seo_description = 'Biogenesis® TB-500 10mg liofilizado, produzido no Canadá, para pesquisa em recuperação muscular e tecidual. Atendimento pelo WhatsApp.', seo_slug = 'biogenesis-tb-500-10mg' where id = '96930ed9-8f11-4f3b-9c0a-fe8d88447283';

-- Biogenesis® Tesamorelin 10mg – Peptídeo Liofilizado
update produtos set seo_title = 'Biogenesis® Tesamorelin 10mg – Liofilizado', seo_description = 'Biogenesis® Tesamorelin 10mg liofilizado, produzido no Canadá, para pesquisa em composição corporal. Fale no WhatsApp.', seo_slug = 'biogenesis-tesamorelin-10mg' where id = '56f6bb6b-c1be-429b-9fce-ea300fba568f';

-- Biogenesis® Tirzepatida 120mg
update produtos set seo_title = 'Biogenesis® Tirzepatida 120mg', seo_description = 'Biogenesis® Tirzepatida 120mg, pureza declarada 99% HPLC, alta concentração para pesquisa metabólica. Atendimento pelo WhatsApp.', seo_slug = 'biogenesis-tirzepatida-120mg', categoria = 'Tirzepatida' where id = 'b8b20707-666f-40ab-b795-d02b88d7b42a';

-- Biovant Peptides® Semax 10mg – Peptídeo Liofilizado
update produtos set seo_title = 'Biovant Peptides® Semax 10mg – Liofilizado', seo_description = 'Biovant Peptides® Semax 10mg liofilizado, 99% HPLC, para pesquisa em função cognitiva e neuroproteção. Fale no WhatsApp.', seo_slug = 'biovant-semax-10mg' where id = '35574e81-548c-4dae-80f9-59cd92e02135';

-- BYOLOGIK® GHK-Cu 100mg
update produtos set seo_title = 'BYOLOGIK® GHK-Cu 100mg – Premium EUA', seo_description = 'BYOLOGIK® GHK-Cu 100mg, produzido nos EUA, acompanha água bacteriostática. Pesquisa em regeneração de pele e cabelo. WhatsApp.', seo_slug = 'byologik-ghk-cu-100mg' where id = 'f269890d-5749-4172-b8a2-bee27e7a365d';

-- Caneta Retatrutide ZPHC 60mg
update produtos set seo_title = 'ZPHC® Retatrutida 60mg – Caneta Multidose', seo_description = 'ZPHC® Retatrutida 60mg em caneta multidose pré-carregada, triplo agonismo, pronta para uso. Atendimento pessoal pelo WhatsApp.', seo_slug = 'zphc-retatrutida-60mg' where id = 'a51215de-325b-46e8-b2f5-fa5c9c2cfe95';

-- King Pharma 60mg
update produtos set seo_title = 'KING® Tirzepatida 60mg – Liofilizada Premium', seo_description = 'KING® Tirzepatida 60mg liofilizada, acompanha ampola com diluente estéril, alta estabilidade. Fale no WhatsApp.', seo_slug = 'king-tirzepatida-60mg' where id = 'cb478f8d-ccb2-4d2e-82f0-eff6ae59a260';

-- NeoPeptides® BPC-157 10mg – Peptídeo Liofilizado
update produtos set seo_title = 'NeoPeptides® BPC-157 10mg – Liofilizado', seo_description = 'NeoPeptides® BPC-157 10mg liofilizado, acompanha água bacteriostática. Pesquisa em recuperação tecidual. Atendimento pelo WhatsApp.', seo_slug = 'neopeptides-bpc-157-10mg' where id = 'f4c89620-7871-43fe-93f9-88b55528113d';

-- NeoPeptides® GHK-Cu 100mg – Peptídeo Liofilizado
update produtos set seo_title = 'NeoPeptides® GHK-Cu 100mg – Liofilizado', seo_description = 'NeoPeptides® GHK-Cu 100mg liofilizado, acompanha água bacteriostática. Pesquisa em pele e saúde capilar. Fale no WhatsApp.', seo_slug = 'neopeptides-ghk-cu-100mg' where id = '2814e10a-48d3-404b-804d-a2185e3aa07a';

-- NeoPeptides® TB-500 10mg – Peptídeo Liofilizado acompanha Água bacteriostática
update produtos set seo_title = 'NeoPeptides® TB-500 10mg – Liofilizado', seo_description = 'NeoPeptides® TB-500 10mg liofilizado, para pesquisa em recuperação muscular e regeneração tecidual. Atendimento pelo WhatsApp.', seo_slug = 'neopeptides-tb-500-10mg' where id = 'de4edc4a-7a07-44d7-b773-e86a8a8229ac';

-- Oxygen Pharma® GHK-Cu 100mg
update produtos set seo_title = 'Oxygen Pharma® GHK-Cu 100mg – Caneta', seo_description = 'Oxygen Pharma® GHK-Cu 100mg em caneta multidose, pronta para uso, sem reconstituição. Pesquisa em pele e cabelo. WhatsApp.', seo_slug = 'oxygen-pharma-ghk-cu-100mg' where id = 'a0d90489-a21f-4941-adb6-cd8f9925c42e';

-- Oxygen® GLOW 70mg – Blend de Peptídeos | GHK-Cu + BPC-157 + TB-500
update produtos set seo_title = 'Oxygen® GLOW 70mg – GHK-Cu + BPC-157 + TB-500', seo_description = 'Oxygen® GLOW 70mg: blend GHK-Cu + BPC-157 + TB-500 em caneta, para pesquisa em regeneração tecidual. Atendimento pelo WhatsApp.', seo_slug = 'oxygen-glow-70mg', categoria = 'Glow' where id = '70ac0825-70e7-4f41-8a04-00655d701a19';

-- SYNEDICA Retatrutida 40mg
update produtos set seo_title = 'SYNEDICA® Retatrutida 40mg – Caneta', seo_description = 'SYNEDICA® Retatrutida 40mg em caneta multidose premium, triplo agonismo, aplicação semanal. Fale no WhatsApp.', seo_slug = 'synedica-retatrutida-40mg' where id = '2faeabe8-83f2-45ef-9281-0dc752e39184';

-- TG 60mg
update produtos set seo_title = 'TG 60mg – Tirzepatida', seo_description = 'TG 60mg, Tirzepatida para protocolos metabólicos, controle do apetite e saciedade. Atendimento pessoal pelo WhatsApp.', seo_slug = 'tg-60mg' where id = '9511cc91-6214-4058-8ad8-f63e46b010c6';

-- Tirzec 60mg
update produtos set seo_title = 'Tirzec® 60mg – Tirzepatida Premium', seo_description = 'TIRZEC® 60mg, Tirzepatida premium da linha Aurum Peptide, para protocolos metabólicos e controle do apetite. WhatsApp.', seo_slug = 'tirzec-60mg' where id = '75769035-7aaa-4620-b637-3e280f4de0c9';

-- VELTRANE Diamond Retatrutida 120mg
update produtos set seo_title = 'VELTRANE® Diamond Retatrutida 120mg', seo_description = 'VELTRANE® Diamond Retatrutida 120mg, produzida na Bélgica, solução pronta para uso, alta concentração. Fale no WhatsApp.', seo_slug = 'veltrane-diamond-retatrutida-120mg' where id = '59dc4caa-c968-4faa-8971-fb279690b7f1';

-- VELTRANE® Gold Retatrutida 90mg
update produtos set seo_title = 'VELTRANE® Gold Retatrutida 90mg', seo_description = 'VELTRANE® Gold Retatrutida 90mg, produzida na Bélgica, solução pronta para uso, padrão farmacêutico europeu. WhatsApp.', seo_slug = 'veltrane-gold-retatrutida-90mg' where id = '850b0621-5b06-4efc-8258-1c2347187430';

-- ZPHC Tirzepatida 50mg
update produtos set seo_title = 'ZPHC® Tirzepatida 50mg – Kit Liofilizado', seo_description = 'ZPHC® Tirzepatida 50mg liofilizada em kit premium, para protocolos metabólicos e controle do apetite. Fale no WhatsApp.', seo_slug = 'zphc-tirzepatida-50mg' where id = '24ff165c-7634-4dd4-8163-5286d837c6e1';
