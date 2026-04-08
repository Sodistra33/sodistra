import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, Calendar, CheckCircle, Download, FileText, Trash2, Filter } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  attachment_url: string | null;
}

type FilterType = "all" | "candidature" | "contact";

const MailsManager = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isCandidature = (msg: ContactMessage) =>
    msg.subject.toLowerCase().includes("candidature");

  const filteredMessages = messages.filter((msg) => {
    if (filter === "candidature") return isCandidature(msg);
    if (filter === "contact") return !isCandidature(msg);
    return true;
  });

  const candidatureCount = messages.filter(isCandidature).length;
  const contactCount = messages.filter((m) => !isCandidature(m)).length;
  const unreadCount = filteredMessages.filter((m) => !m.is_read).length;

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setMessages(
        messages.map((msg) =>
          msg.id === id ? { ...msg, is_read: !currentStatus } : msg
        )
      );
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMessages(messages.filter((msg) => msg.id !== id));
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
    }
  };

  const downloadAttachment = async (attachmentUrl: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("contact-attachments")
        .download(attachmentUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = attachmentUrl.split("/").pop() || "attachment";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: "Le fichier a été téléchargé",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Mails reçus</h2>
        <Badge variant="secondary">{unreadCount} non lu(s)</Badge>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer transition-all ${filter === "all" ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
          onClick={() => setFilter("all")}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tous les mails</p>
              <p className="text-2xl font-bold text-primary">{messages.length}</p>
            </div>
            <Mail className="h-8 w-8 text-primary/30" />
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filter === "candidature" ? "border-accent ring-2 ring-accent/20" : "hover:border-accent/50"}`}
          onClick={() => setFilter("candidature")}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Candidatures</p>
              <p className="text-2xl font-bold text-accent">{candidatureCount}</p>
            </div>
            <FileText className="h-8 w-8 text-accent/30" />
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filter === "contact" ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
          onClick={() => setFilter("contact")}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Messages contact</p>
              <p className="text-2xl font-bold text-primary">{contactCount}</p>
            </div>
            <Phone className="h-8 w-8 text-primary/30" />
          </CardContent>
        </Card>
      </div>

      {/* Messages list */}
      {filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun message pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`${!message.is_read ? "border-accent bg-accent/5" : ""}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{message.subject}</CardTitle>
                      <Badge variant={isCandidature(message) ? "default" : "secondary"}>
                        {isCandidature(message) ? "Candidature" : "Contact"}
                      </Badge>
                      {!message.is_read && (
                        <Badge variant="destructive" className="text-xs">Nouveau</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(message.created_at), "PPP 'à' HH:mm", {
                        locale: fr,
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={message.is_read ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleReadStatus(message.id, message.is_read)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {message.is_read ? "Non lu" : "Lu"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">De: {message.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${message.email}`}
                        className="hover:text-accent"
                      >
                        {message.email}
                      </a>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a
                          href={`tel:${message.phone}`}
                          className="hover:text-accent"
                        >
                          {message.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-primary mb-2">Message:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
                {message.attachment_url && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold text-primary mb-2">
                      Pièce jointe (CV / Document):
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadAttachment(message.attachment_url!)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      <Download className="h-4 w-4" />
                      Télécharger le fichier
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MailsManager;
