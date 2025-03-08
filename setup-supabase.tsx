// Create users table
const createUsersTable = `
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);
`

// Create contents table
const createContentsTable = `
create table public.contents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) not null,
  file_name text not null,
  content text not null,
  created_at timestamp with time zone default now()
);
`

// Create embeddings table
const createEmbeddingsTable = `
create extension if not exists vector;

create table public.embeddings (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid references public.contents(id) not null,
  chunk_index integer not null,
  chunk_text text not null,
  embedding vector(768),
  created_at timestamp with time zone default now()
);
`

// Create study_materials table
const createStudyMaterialsTable = `
create table public.study_materials (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid references public.contents(id) not null,
  type text not null,
  material jsonb not null,
  created_at timestamp with time zone default now()
);
`

// Create RLS policies
const createRLSPolicies = `
alter table public.users enable row level security;
alter table public.contents enable row level security;
alter table public.embeddings enable row level security;
alter table public.study_materials enable row level security;

-- Users policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

-- Contents policies
create policy "Users can view their own contents" on public.contents
  for select using (auth.uid() = user_id);
create policy "Users can insert their own contents" on public.contents
  for insert with check (auth.uid() = user_id);

-- Embeddings policies
create policy "Users can view their own embeddings" on public.embeddings
  for select using (
    auth.uid() = (select user_id from public.contents where id = content_id)
  );
create policy "Users can insert their own embeddings" on public.embeddings
  for insert with check (
    auth.uid() = (select user_id from public.contents where id = content_id)
  );

-- Study materials policies
create policy "Users can view their own study materials" on public.study_materials
  for select using (
    auth.uid() = (select user_id from public.contents where id = content_id)
  );
create policy "Users can insert their own study materials" on public.study_materials
  for insert with check (
    auth.uid() = (select user_id from public.contents where id = content_id)
  );
`

// Log the SQL statements
console.log("=== SQL Statements for Supabase Setup ===")
console.log("\n--- Create Users Table ---")
console.log(createUsersTable)

console.log("\n--- Create Contents Table ---")
console.log(createContentsTable)

console.log("\n--- Create Embeddings Table ---")
console.log(createEmbeddingsTable)

console.log("\n--- Create Study Materials Table ---")
console.log(createStudyMaterialsTable)

console.log("\n--- Create RLS Policies ---")
console.log(createRLSPolicies)

console.log("\n=== Instructions ===")
console.log("1. Go to your Supabase project")
console.log("2. Navigate to the SQL Editor")
console.log("3. Copy and paste each SQL block above")
console.log("4. Run the SQL statements in order")

