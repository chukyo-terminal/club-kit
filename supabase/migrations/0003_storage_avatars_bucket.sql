-- Avatar 画像アップロード用 Storage bucket
-- public bucket とし、読み取りは公開。書き込みは本人(owner)のみ許可。

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update
set name = excluded.name, public = excluded.public;

create policy "Avatar images are publicly readable"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars' and auth.uid() = owner);

create policy "Users can update own avatar"
on storage.objects
for update
to authenticated
using (bucket_id = 'avatars' and auth.uid() = owner)
with check (bucket_id = 'avatars' and auth.uid() = owner);

create policy "Users can delete own avatar"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars' and auth.uid() = owner);

