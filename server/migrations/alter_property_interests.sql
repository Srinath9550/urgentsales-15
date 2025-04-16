-- Alter property_interests table to make user_id nullable
DO $$
BEGIN
    -- Check if the user_id column exists and is not nullable
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'property_interests'
        AND column_name = 'user_id'
        AND is_nullable = 'NO'
    ) THEN
        -- Alter the column to be nullable
        ALTER TABLE property_interests ALTER COLUMN user_id DROP NOT NULL;
    END IF;

    -- Check if the user_id column doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'property_interests'
        AND column_name = 'user_id'
    ) THEN
        -- Add the user_id column as nullable
        ALTER TABLE property_interests ADD COLUMN user_id INTEGER NULL;
    END IF;
END
$$;