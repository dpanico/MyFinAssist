-- Phase 1.1 hardening: child-row write policies also validate that referenced
-- financial records belong to the authenticated user.

drop policy if exists accounts_insert_own on accounts;
drop policy if exists accounts_update_own on accounts;
create policy accounts_insert_own on accounts
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and (
    institution_id is null
    or exists (
      select 1 from institutions
      where institutions.id = accounts.institution_id
      and institutions.user_id = (select auth.uid())
    )
  )
);
create policy accounts_update_own on accounts
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    institution_id is null
    or exists (
      select 1 from institutions
      where institutions.id = accounts.institution_id
      and institutions.user_id = (select auth.uid())
    )
  )
);

drop policy if exists account_connections_insert_own on account_connections;
drop policy if exists account_connections_update_own on account_connections;
create policy account_connections_insert_own on account_connections
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = account_connections.account_id
    and accounts.user_id = (select auth.uid())
  )
  and exists (
    select 1 from data_providers
    where data_providers.id = account_connections.data_provider_id
    and data_providers.user_id = (select auth.uid())
  )
);
create policy account_connections_update_own on account_connections
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = account_connections.account_id
    and accounts.user_id = (select auth.uid())
  )
  and exists (
    select 1 from data_providers
    where data_providers.id = account_connections.data_provider_id
    and data_providers.user_id = (select auth.uid())
  )
);

drop policy if exists account_balances_insert_own on account_balances;
drop policy if exists account_balances_update_own on account_balances;
create policy account_balances_insert_own on account_balances
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = account_balances.account_id
    and accounts.user_id = (select auth.uid())
  )
);
create policy account_balances_update_own on account_balances
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = account_balances.account_id
    and accounts.user_id = (select auth.uid())
  )
);

drop policy if exists transactions_insert_own on transactions;
drop policy if exists transactions_update_own on transactions;
create policy transactions_insert_own on transactions
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = transactions.account_id
    and accounts.user_id = (select auth.uid())
  )
  and (
    category_id is null
    or exists (
      select 1 from categories
      where categories.id = transactions.category_id
      and categories.user_id = (select auth.uid())
    )
  )
);
create policy transactions_update_own on transactions
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = transactions.account_id
    and accounts.user_id = (select auth.uid())
  )
  and (
    category_id is null
    or exists (
      select 1 from categories
      where categories.id = transactions.category_id
      and categories.user_id = (select auth.uid())
    )
  )
);

drop policy if exists transaction_rules_insert_own on transaction_rules;
drop policy if exists transaction_rules_update_own on transaction_rules;
create policy transaction_rules_insert_own on transaction_rules
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and (
    category_id is null
    or exists (
      select 1 from categories
      where categories.id = transaction_rules.category_id
      and categories.user_id = (select auth.uid())
    )
  )
);
create policy transaction_rules_update_own on transaction_rules
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    category_id is null
    or exists (
      select 1 from categories
      where categories.id = transaction_rules.category_id
      and categories.user_id = (select auth.uid())
    )
  )
);

drop policy if exists transfer_matches_insert_own on transfer_matches;
drop policy if exists transfer_matches_update_own on transfer_matches;
create policy transfer_matches_insert_own on transfer_matches
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from transactions
    where transactions.id = transfer_matches.source_transaction_id
    and transactions.user_id = (select auth.uid())
  )
  and (
    matched_transaction_id is null
    or exists (
      select 1 from transactions
      where transactions.id = transfer_matches.matched_transaction_id
      and transactions.user_id = (select auth.uid())
    )
  )
  and (
    suggested_category_id is null
    or exists (
      select 1 from categories
      where categories.id = transfer_matches.suggested_category_id
      and categories.user_id = (select auth.uid())
    )
  )
);
create policy transfer_matches_update_own on transfer_matches
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from transactions
    where transactions.id = transfer_matches.source_transaction_id
    and transactions.user_id = (select auth.uid())
  )
  and (
    matched_transaction_id is null
    or exists (
      select 1 from transactions
      where transactions.id = transfer_matches.matched_transaction_id
      and transactions.user_id = (select auth.uid())
    )
  )
  and (
    suggested_category_id is null
    or exists (
      select 1 from categories
      where categories.id = transfer_matches.suggested_category_id
      and categories.user_id = (select auth.uid())
    )
  )
);

drop policy if exists holdings_insert_own on holdings;
drop policy if exists holdings_update_own on holdings;
create policy holdings_insert_own on holdings
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = holdings.account_id
    and accounts.user_id = (select auth.uid())
  )
);
create policy holdings_update_own on holdings
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = holdings.account_id
    and accounts.user_id = (select auth.uid())
  )
);

drop policy if exists investment_activity_insert_own on investment_activity;
drop policy if exists investment_activity_update_own on investment_activity;
create policy investment_activity_insert_own on investment_activity
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = investment_activity.account_id
    and accounts.user_id = (select auth.uid())
  )
  and (
    transaction_id is null
    or exists (
      select 1 from transactions
      where transactions.id = investment_activity.transaction_id
      and transactions.user_id = (select auth.uid())
    )
  )
);
create policy investment_activity_update_own on investment_activity
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from accounts
    where accounts.id = investment_activity.account_id
    and accounts.user_id = (select auth.uid())
  )
  and (
    transaction_id is null
    or exists (
      select 1 from transactions
      where transactions.id = investment_activity.transaction_id
      and transactions.user_id = (select auth.uid())
    )
  )
);

drop policy if exists import_jobs_insert_own on import_jobs;
drop policy if exists import_jobs_update_own on import_jobs;
create policy import_jobs_insert_own on import_jobs
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and (
    account_id is null
    or exists (
      select 1 from accounts
      where accounts.id = import_jobs.account_id
      and accounts.user_id = (select auth.uid())
    )
  )
);
create policy import_jobs_update_own on import_jobs
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    account_id is null
    or exists (
      select 1 from accounts
      where accounts.id = import_jobs.account_id
      and accounts.user_id = (select auth.uid())
    )
  )
);

drop policy if exists uploaded_documents_insert_own on uploaded_documents;
drop policy if exists uploaded_documents_update_own on uploaded_documents;
create policy uploaded_documents_insert_own on uploaded_documents
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and (
    account_id is null
    or exists (
      select 1 from accounts
      where accounts.id = uploaded_documents.account_id
      and accounts.user_id = (select auth.uid())
    )
  )
);
create policy uploaded_documents_update_own on uploaded_documents
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    account_id is null
    or exists (
      select 1 from accounts
      where accounts.id = uploaded_documents.account_id
      and accounts.user_id = (select auth.uid())
    )
  )
);

drop policy if exists document_extractions_insert_own on document_extractions;
drop policy if exists document_extractions_update_own on document_extractions;
create policy document_extractions_insert_own on document_extractions
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from uploaded_documents
    where uploaded_documents.id = document_extractions.uploaded_document_id
    and uploaded_documents.user_id = (select auth.uid())
  )
);
create policy document_extractions_update_own on document_extractions
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from uploaded_documents
    where uploaded_documents.id = document_extractions.uploaded_document_id
    and uploaded_documents.user_id = (select auth.uid())
  )
);

drop policy if exists extracted_statement_items_insert_own
on extracted_statement_items;
drop policy if exists extracted_statement_items_update_own
on extracted_statement_items;
create policy extracted_statement_items_insert_own on extracted_statement_items
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from document_extractions
    where document_extractions.id =
      extracted_statement_items.document_extraction_id
    and document_extractions.user_id = (select auth.uid())
  )
);
create policy extracted_statement_items_update_own on extracted_statement_items
for update to authenticated using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from document_extractions
    where document_extractions.id =
      extracted_statement_items.document_extraction_id
    and document_extractions.user_id = (select auth.uid())
  )
);
