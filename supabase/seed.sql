insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@myfinassist.local',
  crypt('demo-password', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Demo User"}'::jsonb
)
on conflict (id) do nothing;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"demo@myfinassist.local"}'::jsonb,
  'email',
  now(),
  now(),
  now()
)
on conflict (provider, provider_id) do nothing;

insert into profiles (user_id, display_name)
values ('00000000-0000-0000-0000-000000000001', 'Demo User')
on conflict (user_id) do update set display_name = excluded.display_name;

insert into institutions (id, user_id, name, website_url, notes)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Northstar Credit Union',
    'https://example.invalid/northstar',
    'Fake demo institution for checking and savings.'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Cedar Brokerage',
    'https://example.invalid/cedar',
    'Fake demo institution for investment accounts.'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Harbor Home Loans',
    'https://example.invalid/harbor',
    'Fake demo institution for debt tracking.'
  )
on conflict (user_id, name) do update
set website_url = excluded.website_url,
    notes = excluded.notes;

insert into data_providers (id, user_id, name, provider_key, provider_kind, notes)
values (
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Mock Provider',
  'mock_provider',
  'mock',
  'Demo provider adapter only. No real credentials or provider API calls.'
)
on conflict (user_id, provider_key) do update
set name = excluded.name,
    provider_kind = excluded.provider_kind,
    notes = excluded.notes;

insert into categories (id, user_id, name, transaction_type, is_default)
values
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Dining', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Groceries', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Merchandise', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Travel', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Lodging', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Entertainment', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Gas / Automotive', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'Mortgage', 'debt_payment', true),
  ('30000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'Student Loans', 'debt_payment', true),
  ('30000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Utilities', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Subscriptions', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Insurance', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'Medical', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', 'Rent', 'true_expense', true),
  ('30000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000001', 'Income', 'income', true),
  ('30000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000001', 'Investment Contribution', 'investment_contribution', true),
  ('30000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000001', 'Credit Card Payment', 'internal_payment', true),
  ('30000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000001', 'Transfer', 'transfer', true),
  ('30000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000001', 'Reimbursement', 'reimbursement', true),
  ('30000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', 'Refund', 'refund', true),
  ('30000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', 'Fees', 'fee', true),
  ('30000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', 'Interest', 'interest', true),
  ('30000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000001', 'Dividends', 'dividend', true),
  ('30000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000001', 'Other', 'uncategorized', true)
on conflict (user_id, name) do update
set transaction_type = excluded.transaction_type,
    is_default = excluded.is_default;

insert into accounts (
  id,
  user_id,
  institution_id,
  name,
  masked_identifier,
  account_type,
  account_group,
  liquidity_class,
  risk_class,
  tracking_method,
  sync_status,
  data_quality_status,
  include_in_net_worth,
  include_in_cash_flow
)
values
  (
    '40000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Everyday Checking',
    '0001',
    'checking',
    'cash',
    'operating_cash',
    'low',
    'manual_full',
    'manual',
    'manual',
    true,
    true
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Emergency Savings',
    '0002',
    'savings',
    'cash',
    'emergency_cash',
    'low',
    'manual_balance',
    'manual',
    'manual',
    true,
    true
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Taxable Investing',
    '0003',
    'taxable_brokerage',
    'taxable_investments',
    'invested_accessible',
    'moderate',
    'statement_upload',
    'manual',
    'partial',
    true,
    false
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003',
    'Primary Mortgage',
    '0004',
    'mortgage',
    'debt',
    'debt',
    'debt',
    'statement_upload',
    'manual',
    'manual',
    true,
    true
  )
on conflict (id) do update
set name = excluded.name,
    account_status = excluded.account_status,
    tracking_method = excluded.tracking_method,
    sync_status = excluded.sync_status,
    data_quality_status = excluded.data_quality_status;

insert into account_balances (user_id, account_id, balance_date, balance_amount, currency, source, notes)
values
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '2026-05-31', 4250.25, 'USD', 'manual_balance', 'Demo month-end balance.'),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '2026-05-31', 18000.00, 'USD', 'manual_balance', 'Demo emergency fund balance.'),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', '2026-05-31', 64250.40, 'USD', 'statement_upload', 'Demo brokerage statement value.'),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', '2026-05-31', 268900.00, 'USD', 'statement_upload', 'Demo mortgage balance.')
on conflict (account_id, balance_date) do update
set balance_amount = excluded.balance_amount,
    source = excluded.source,
    notes = excluded.notes;

insert into account_connections (
  user_id,
  account_id,
  data_provider_id,
  connection_status,
  last_successful_sync_at,
  current_balance_available,
  transactions_available,
  transaction_history_months,
  category_data_available,
  merchant_data_available,
  holdings_available,
  investment_transactions_available,
  contribution_withdrawal_data_available,
  webhook_refresh_supported,
  recommended_tracking_method,
  data_quality_status
)
values
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'connected', now(), true, true, 24, true, true, false, false, false, true, 'full_sync', 'excellent'),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'partial', now(), true, false, 0, false, false, true, true, true, false, 'holdings_sync', 'partial'),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 'manual_only', null, false, false, 0, false, false, false, false, false, false, 'statement_upload', 'manual')
on conflict (account_id, data_provider_id) do update
set connection_status = excluded.connection_status,
    recommended_tracking_method = excluded.recommended_tracking_method,
    data_quality_status = excluded.data_quality_status;

insert into transactions (
  user_id,
  account_id,
  category_id,
  transaction_date,
  posted_date,
  description,
  merchant,
  amount,
  transaction_type
)
values
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000015', '2026-05-30', '2026-05-30', 'Demo payroll deposit', 'Example Employer', 6200.00, 'income'),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '2026-05-29', '2026-05-30', 'Demo grocery purchase', 'Sample Market', -126.42, 'true_expense'),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000016', '2026-05-28', '2026-05-28', 'Demo brokerage transfer', 'Cedar Brokerage', -700.00, 'investment_contribution');

insert into uploaded_documents (
  id,
  user_id,
  account_id,
  document_type,
  statement_period_start,
  statement_period_end,
  file_name,
  storage_path,
  review_status,
  notes
)
values (
  '50000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000003',
  'brokerage_statement',
  '2026-05-01',
  '2026-05-31',
  'cedar-brokerage-demo-may-2026.pdf',
  'placeholder/cedar-brokerage-demo-may-2026.pdf',
  'pending',
  'Demo placeholder statement record.'
)
on conflict (id) do update
set review_status = excluded.review_status,
    notes = excluded.notes;

insert into document_extractions (
  id,
  user_id,
  uploaded_document_id,
  extractor_type,
  extraction_status,
  extracted_payload
)
values (
  '60000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000001',
  'mock',
  'pending',
  '{"source":"mock","confidence":"demo"}'::jsonb
)
on conflict (id) do update
set extraction_status = excluded.extraction_status,
    extracted_payload = excluded.extracted_payload;

insert into extracted_statement_items (
  user_id,
  document_extraction_id,
  item_type,
  label,
  extracted_value,
  normalized_value,
  review_status
)
values
  ('00000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'ending_balance', 'Ending value', '$64,250.40', 64250.40, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'contribution', 'May contribution', '$700.00', 700.00, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'statement_period', 'Statement period', '2026-05-01 to 2026-05-31', null, 'pending');
