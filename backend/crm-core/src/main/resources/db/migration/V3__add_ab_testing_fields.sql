ALTER TABLE campaigns
ADD COLUMN ab_testing_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN variant_b_subject VARCHAR(255),
ADD COLUMN variant_b_message TEXT,
ADD COLUMN variant_b_cta VARCHAR(255);
