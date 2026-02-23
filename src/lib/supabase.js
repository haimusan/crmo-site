import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://rtodtmeqijhszdhelawy.supabase.co'
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0b2R0bWVxaWpoc3pkaGVsYXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczODM2MzgsImV4cCI6MjA4Mjk1OTYzOH0.HoejT4earusc0bHdC2-rtgHfbcCUP96qXXNc2ljnJi8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
