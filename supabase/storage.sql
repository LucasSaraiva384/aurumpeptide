-- Aurum Peptide — bucket de Storage + galeria de imagens por produto
--
-- Como aplicar: Supabase Dashboard > SQL Editor > New query, cole e
-- rode este arquivo inteiro (mesmo fluxo usado para schema.sql).

insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

-- galeria: várias imagens por produto (ordem = ordem de exibição no
-- carrossel). `imagem_url` continua existindo só como fallback do
-- produto já cadastrado antes desta feature — não é mais escrito
-- pelo admin.
alter table produtos add column if not exists imagens text[] not null default '{}';

-- leitura pública das imagens (o bucket já é público, mas a policy
-- de objects também precisa liberar select para o link funcionar)
create policy produtos_storage_select_public on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'produtos');

-- upload/atualização/exclusão só para o painel admin autenticado
create policy produtos_storage_write_authenticated on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'produtos');

create policy produtos_storage_update_authenticated on storage.objects
  for update
  to authenticated
  using (bucket_id = 'produtos');

create policy produtos_storage_delete_authenticated on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'produtos');
