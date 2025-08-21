import { createClient } from '@supabase/supabase-js'

// paste from Supabase settings
const supabaseUrl = "https://jfxbnbjlkrvpnnpfucma.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGJuYmpsa3J2cG5ucGZ1Y21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTE2MTksImV4cCI6MjA3MTA4NzYxOX0.WZq1qPtQ-VL4IU_vxd5ZKxoo6lIR-Rif0lrEB3LBD-U"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
