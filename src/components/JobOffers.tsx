import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CareerApplicationForm from "./CareerApplicationForm";
import { useLanguage } from "@/contexts/LanguageContext";

interface JobOffer {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  contract_type: string | null;
  created_at: string;
}

const JobOffers = () => {
  const { t } = useLanguage();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchJobOffers();
  }, []);

  const fetchJobOffers = async () => {
    try {
      const { data, error } = await supabase
        .from("job_offers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobOffers(data || []);
    } catch (error) {
      console.error("Error fetching job offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: t('job.link_copied'),
        description: t('job.link_copied_desc'),
      });
    } catch (error) {
      toast({
        title: t('contact.error_title'),
        description: t('job.copy_error'),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (jobOffers.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">{t('job.no_offers_title')}</h3>
          <p className="text-muted-foreground">
            {t('job.no_offers_desc')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {jobOffers.map((job) => (
        <Card key={job.id} className="border-border hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl text-primary">{job.title}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyLink}
                  className="h-8 w-8"
                  title="Copier le lien"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.contract_type && (
                <Badge variant="secondary">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {job.contract_type}
                </Badge>
              )}
              {job.location && (
                <Badge variant="secondary">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary mb-2">{t('job.description')}</h4>
              <p className="text-muted-foreground text-sm line-clamp-3">{job.description}</p>
            </div>
            {job.requirements && (
              <div>
                <h4 className="font-semibold text-primary mb-2">{t('job.requirements')}</h4>
                <p className="text-muted-foreground text-sm line-clamp-2">{job.requirements}</p>
              </div>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
                  onClick={() => setSelectedJob(job.title)}
                >
                  {t('job.apply')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('job.apply_for')} {job.title}</DialogTitle>
                  <DialogDescription>
                    {t('job.apply_form_desc')}
                  </DialogDescription>
                </DialogHeader>
                <CareerApplicationForm jobTitle={job.title} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobOffers;
