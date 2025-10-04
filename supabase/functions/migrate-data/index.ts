import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationResult {
  table: string;
  success: boolean;
  count: number;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting data migration...');

    // Source Supabase (ancien)
    const sourceSupabase = createClient(
      'https://jrqtzwxhzwmzusurvikl.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpycXR6d3hoendtenVzdXJ2aWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDYwNTIsImV4cCI6MjA3NTAyMjA1Mn0.t4uBMwwhOrsn9rytZISg88FqJIrfCrnvRGipXfEbIZg'
    );

    // Destination Supabase (Lovable Cloud) - using service role for admin access
    const destSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const results: MigrationResult[] = [];

    // Liste des tables à migrer
    const tables = [
      'projects',
      'blog_posts',
      'partners',
      'brochures',
      'about_content',
      'hero_images',
      'contact_messages',
      'services'
    ];

    // Migration de chaque table
    for (const table of tables) {
      console.log(`Migrating table: ${table}`);
      
      try {
        // 1. Récupérer toutes les données de la source
        const { data: sourceData, error: fetchError } = await sourceSupabase
          .from(table)
          .select('*');

        if (fetchError) {
          console.error(`Error fetching ${table}:`, fetchError);
          results.push({
            table,
            success: false,
            count: 0,
            error: fetchError.message
          });
          continue;
        }

        if (!sourceData || sourceData.length === 0) {
          console.log(`No data found in ${table}`);
          results.push({
            table,
            success: true,
            count: 0
          });
          continue;
        }

        console.log(`Found ${sourceData.length} records in ${table}`);

        // 2. Insérer les données dans la destination
        const { data: insertedData, error: insertError } = await destSupabase
          .from(table)
          .insert(sourceData)
          .select();

        if (insertError) {
          console.error(`Error inserting into ${table}:`, insertError);
          results.push({
            table,
            success: false,
            count: 0,
            error: insertError.message
          });
          continue;
        }

        console.log(`Successfully migrated ${sourceData.length} records to ${table}`);
        results.push({
          table,
          success: true,
          count: sourceData.length
        });

      } catch (error: any) {
        console.error(`Unexpected error migrating ${table}:`, error);
        results.push({
          table,
          success: false,
          count: 0,
          error: error.message
        });
      }
    }

    // Résumé de la migration
    const summary = {
      totalTables: tables.length,
      successfulTables: results.filter(r => r.success).length,
      failedTables: results.filter(r => !r.success).length,
      totalRecordsMigrated: results.reduce((sum, r) => sum + r.count, 0),
      results
    };

    console.log('Migration completed:', summary);

    return new Response(
      JSON.stringify(summary),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Migration failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
