import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle, Database } from "lucide-react";
import { toast } from "sonner";

interface MigrationResult {
  table: string;
  success: boolean;
  count: number;
  error?: string;
}

interface MigrationSummary {
  totalTables: number;
  successfulTables: number;
  failedTables: number;
  totalRecordsMigrated: number;
  results: MigrationResult[];
}

const MigrationTool = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<MigrationSummary | null>(null);

  const runMigration = async () => {
    setIsRunning(true);
    setSummary(null);
    
    try {
      toast.info("Démarrage de la migration...");
      
      const { data, error } = await supabase.functions.invoke('migrate-data');

      if (error) {
        console.error('Migration error:', error);
        toast.error("Erreur lors de la migration: " + error.message);
        return;
      }

      setSummary(data as MigrationSummary);
      
      if (data.failedTables === 0) {
        toast.success(`Migration réussie! ${data.totalRecordsMigrated} enregistrements migrés.`);
      } else {
        toast.warning(`Migration terminée avec ${data.failedTables} erreur(s). ${data.totalRecordsMigrated} enregistrements migrés.`);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error("Erreur inattendue: " + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Migration de données Supabase
          </CardTitle>
          <CardDescription>
            Migrez vos données de votre ancien projet Supabase (jrqtzwxhzwmzusurvikl) vers Lovable Cloud
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Cette opération va copier toutes les données des tables suivantes:
              projects, blog_posts, partners, brochures, about_content, hero_images, contact_messages, services
            </AlertDescription>
          </Alert>

          <Button
            onClick={runMigration}
            disabled={isRunning}
            size="lg"
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Migration en cours...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Démarrer la migration
              </>
            )}
          </Button>

          {summary && (
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {summary.totalRecordsMigrated}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enregistrements migrés
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {summary.successfulTables}/{summary.totalTables}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tables réussies
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Détails par table:</h3>
                {summary.results.map((result) => (
                  <Card key={result.table}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-medium">{result.table}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.success ? (
                            `${result.count} enregistrement(s)`
                          ) : (
                            <span className="text-red-600">{result.error}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationTool;
