-- V2__insert_sample_data.sql
-- テスト用のサンプルデータ投入

-- 家計ユニット（2人世帯）
INSERT INTO household_unit (id, name) VALUES (1, '田中家');

-- ユーザー
INSERT INTO users (id, household_unit_id, name, email, salary_amount, salary_day, income_growth_rate, income_max_age)
VALUES 
(1, 1, '田中 たろう', 'ryuji@example.com', 350000, 25, 2.0, 55),
(2, 1, '田中 はなこ', 'ai@example.com', 280000, 25, 1.5, 55);

-- クレジットカード（4枚）
INSERT INTO credit_card (id, user_id, name, payment_day) VALUES
(1, 1, '楽天カード（生活費用）', 27),
(2, 1, '三井住友カード（娯楽）', 4),
(3, 2, 'エポスカード（はなこ）', 27),
(4, 2, 'ビューカード（交通）', 4);

-- クレジットカード請求
INSERT INTO credit_card_bill (id, card_id, billing_year, billing_month, payment_year, payment_month, amount, paid_by_salary_month)
VALUES
(1, 1, 2025, 7, 2025, 8, 89000, 8),
(2, 2, 2025, 7, 2025, 8, 42000, 8),
(3, 3, 2025, 7, 2025, 8, 33000, 8),
(4, 4, 2025, 7, 2025, 8, 11000, 8);

-- クレジットカード支出内訳
INSERT INTO credit_card_item (bill_id, category, amount, included_in_summary, label) VALUES
(1, '食費', 40000, true, '家賃含まず'),
(1, '日用品', 15000, true, '消耗品'),
(1, '家賃', 34000, true, '住居費'),
(2, '外食', 20000, true, '趣味'),
(2, 'サブスク', 22000, true, 'Netflix他'),
(3, '衣類', 15000, true, '私物'),
(3, '医療費', 18000, true, '病院'),
(4, '定期券', 11000, true, '通勤');

-- 物価上昇率（都市：大阪）
INSERT INTO inflation_rate (city, year, month, inflation_rate) VALUES
('大阪', 2025, 7, 2.4);

-- 月ごとの収支（2025年7月）
INSERT INTO monthly_balance (user_id, city, year, month, income, expense, note) VALUES
(1, '大阪', 2025, 7, 350000, 145000, '通常月'),
(2, '大阪', 2025, 7, 280000, 64000, '病院通いあり');
