-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- users (managed by Supabase Auth, but we track extra data here if needed, or link to auth.users)
-- For this MVP, we'll store wallet users directly.
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- saved_configs
CREATE TABLE IF NOT EXISTS saved_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  wallet_address TEXT NOT NULL,
  config JSONB NOT NULL,
  status TEXT DEFAULT 'saved', -- saved, testnet, mainnet
  testnet_address TEXT,
  mainnet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- bsc_launch_data (cached historical data)
CREATE TABLE IF NOT EXISTS bsc_launch_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_address TEXT UNIQUE NOT NULL,
  launch_date TIMESTAMP WITH TIME ZONE,
  tge_percent NUMERIC,
  vesting_schedule JSONB,
  price_stability_days INTEGER,
  market_cap_growth NUMERIC,
  is_successful BOOLEAN,
  metadata JSONB,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ⭐ CORE: launchpads
CREATE TABLE IF NOT EXISTS launchpads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  total_supply NUMERIC NOT NULL,
  hardcap NUMERIC NOT NULL,
  softcap NUMERIC NOT NULL,
  min_contribution NUMERIC NOT NULL,
  max_contribution NUMERIC NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'upcoming', -- upcoming, active, completed, failed
  contract_address TEXT,
  token_address TEXT,
  config JSONB NOT NULL, -- full tokenomics config
  amm_config JSONB, -- bonding curve, fees, liquidity depth
  plu_config JSONB, -- PLU lock schedule and milestones
  template_id UUID, -- if created from AI template
  whitelist_root TEXT, -- Merkle root for whitelist
  category TEXT DEFAULT 'general', -- general, ai_chatbot, ai_agent, compute, data
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ⭐ CORE: launchpad contributions
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  launchpad_id UUID REFERENCES launchpads(id),
  wallet_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  tx_hash TEXT NOT NULL,
  refunded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ⭐ CORE: PLU lock records
CREATE TABLE IF NOT EXISTS plu_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  launchpad_id UUID REFERENCES launchpads(id),
  contract_address TEXT NOT NULL,
  total_locked NUMERIC NOT NULL,
  unlock_schedule JSONB NOT NULL, -- [{ percent, date, milestone_type, condition }]
  unlocked_percent NUMERIC DEFAULT 0,
  next_unlock_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'locked', -- locked, partially_unlocked, fully_unlocked
  extended_until TIMESTAMP WITH TIME ZONE, -- if owner extended lock
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ⭐ CORE: growth metrics (cached, updated by cron)
CREATE TABLE IF NOT EXISTS growth_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_address TEXT NOT NULL,
  launchpad_id UUID REFERENCES launchpads(id),
  price NUMERIC,
  market_cap NUMERIC,
  holder_count INTEGER,
  lp_depth NUMERIC,
  volume_24h NUMERIC,
  new_holders_today INTEGER,
  top_holders JSONB, -- [{ address, balance, percent }]
  snapshot_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ⭐ CORE: AI token templates
CREATE TABLE IF NOT EXISTS ai_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- chatbot, agent, compute, data
  description TEXT,
  tokenomics_preset JSONB NOT NULL, -- TGE, vesting, distribution defaults
  utility_model TEXT, -- pay_per_query, staking, revenue_share
  example_projects JSONB, -- [{ name, address, description }]
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_saved_configs_wallet ON saved_configs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_bsc_launch_successful ON bsc_launch_data(is_successful) WHERE is_successful = true;
CREATE INDEX IF NOT EXISTS idx_launchpads_status ON launchpads(status);
CREATE INDEX IF NOT EXISTS idx_launchpads_category ON launchpads(category);
CREATE INDEX IF NOT EXISTS idx_contributions_launchpad ON contributions(launchpad_id);
CREATE INDEX IF NOT EXISTS idx_plu_locks_launchpad ON plu_locks(launchpad_id);
CREATE INDEX IF NOT EXISTS idx_growth_metrics_token ON growth_metrics(token_address);
CREATE INDEX IF NOT EXISTS idx_ai_templates_category ON ai_templates(category);

-- Row Level Security (RLS) Policies

-- Users: anyone can read, only owner can update (conceptually, though table is server-managed mostly)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);

-- Saved Configs: users can see their own
ALTER TABLE saved_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own configs" ON saved_configs FOR SELECT USING (wallet_address = current_setting('request.jwt.claim.sub', true));
CREATE POLICY "Users can insert own configs" ON saved_configs FOR INSERT WITH CHECK (wallet_address = current_setting('request.jwt.claim.sub', true));

-- Public Data Tables (Read Only for Public)
ALTER TABLE bsc_launch_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read bsc_launch_data" ON bsc_launch_data FOR SELECT USING (true);

ALTER TABLE launchpads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read launchpads" ON launchpads FOR SELECT USING (true);

ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read contributions" ON contributions FOR SELECT USING (true);

ALTER TABLE plu_locks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read plu_locks" ON plu_locks FOR SELECT USING (true);

ALTER TABLE growth_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read growth_metrics" ON growth_metrics FOR SELECT USING (true);

ALTER TABLE ai_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ai_templates" ON ai_templates FOR SELECT USING (true);
