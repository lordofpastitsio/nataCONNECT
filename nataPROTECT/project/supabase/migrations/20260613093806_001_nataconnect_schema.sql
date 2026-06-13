-- NataCONNECT Database Schema

-- Cards (payment cards linked to user)
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('debit', 'credit')),
  last_four TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Visa',
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  color TEXT NOT NULL DEFAULT '#0ea5e9',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_cards" ON cards FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_cards" ON cards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_cards" ON cards FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_cards" ON cards FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Shield Rules
CREATE TABLE shield_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
  rule_text TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('spending_limit', 'time_restriction', 'seller_verification', 'category_block', 'custom')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  parameters JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE shield_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_shield_rules" ON shield_rules FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_shield_rules" ON shield_rules FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_shield_rules" ON shield_rules FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_shield_rules" ON shield_rules FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Transactions (pending and completed)
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
  seller_name TEXT NOT NULL,
  seller_url TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  category TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'blocked', 'flagged')) DEFAULT 'pending',
  block_reason TEXT,
  rule_id UUID REFERENCES shield_rules(id),
  is_scam_report BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_transactions" ON transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_transactions" ON transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_transactions" ON transactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Scam Reports (community network)
CREATE TABLE scam_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_name TEXT NOT NULL,
  seller_url TEXT,
  description TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('phishing', 'fraud', 'fake_product', 'overcharge', 'other')) DEFAULT 'fraud',
  verified BOOLEAN NOT NULL DEFAULT false,
  report_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_all_scam_reports" ON scam_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_own_scam_reports" ON scam_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "update_own_scam_reports" ON scam_reports FOR UPDATE TO authenticated USING (auth.uid() = reporter_id);
CREATE POLICY "delete_own_scam_reports" ON scam_reports FOR DELETE TO authenticated USING (auth.uid() = reporter_id);

-- Auto-Grow Portfolios
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Main Portfolio',
  initial_capital NUMERIC(12,2) NOT NULL,
  current_value NUMERIC(12,2) NOT NULL,
  max_loss NUMERIC(12,2) NOT NULL,
  risk_profile TEXT NOT NULL CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive')) DEFAULT 'moderate',
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'stopped')) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_portfolios" ON portfolios FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_portfolios" ON portfolios FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_portfolios" ON portfolios FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_portfolios" ON portfolios FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Auto-Grow Trades
CREATE TABLE trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')) DEFAULT 'buy',
  quantity NUMERIC(12,4) NOT NULL,
  entry_price NUMERIC(12,2) NOT NULL,
  exit_price NUMERIC(12,2),
  pnl NUMERIC(12,2),
  status TEXT NOT NULL CHECK (status IN ('open', 'closed', 'rejected')) DEFAULT 'open',
  ai_reasoning TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_trades" ON trades FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_trades" ON trades FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_trades" ON trades FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_trades" ON trades FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Practice Sessions
CREATE TABLE practice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  balance NUMERIC(12,2) NOT NULL DEFAULT 10000,
  initial_balance NUMERIC(12,2) NOT NULL DEFAULT 10000,
  skill_score INTEGER NOT NULL DEFAULT 0,
  total_trades INTEGER NOT NULL DEFAULT 0,
  winning_trades INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_practice_sessions" ON practice_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_practice_sessions" ON practice_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_practice_sessions" ON practice_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_practice_sessions" ON practice_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Practice Trades
CREATE TABLE practice_trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES practice_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')) DEFAULT 'buy',
  quantity NUMERIC(12,4) NOT NULL,
  entry_price NUMERIC(12,2) NOT NULL,
  exit_price NUMERIC(12,2),
  pnl NUMERIC(12,2),
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')) DEFAULT 'open',
  ai_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

ALTER TABLE practice_trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_practice_trades" ON practice_trades FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_practice_trades" ON practice_trades FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_practice_trades" ON practice_trades FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_practice_trades" ON practice_trades FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Achievements
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_achievements" ON achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_achievements" ON achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_achievements" ON achievements FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Goals
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL,
  current_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('rent', 'vacation', 'emergency', 'savings', 'entertainment', 'food', 'shopping', 'transport', 'health', 'education', 'other')) DEFAULT 'other',
  deadline DATE,
  is_shield_protected BOOLEAN NOT NULL DEFAULT false,
  icon TEXT NOT NULL DEFAULT 'Target',
  color TEXT NOT NULL DEFAULT '#10b981',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_goals" ON goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_goals" ON goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_goals" ON goals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_goals" ON goals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Category Spending Limits
CREATE TABLE category_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  monthly_limit NUMERIC(12,2) NOT NULL,
  current_spent NUMERIC(12,2) NOT NULL DEFAULT 0,
  period_start DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE category_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_category_limits" ON category_limits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_category_limits" ON category_limits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_category_limits" ON category_limits FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_category_limits" ON category_limits FOR DELETE TO authenticated USING (auth.uid() = user_id);
