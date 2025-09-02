import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(user?.settings?.theme || "light");
  const [notifications, setNotifications] = useState(user?.settings?.notifications ?? true);
  const [reducedMotion, setReducedMotion] = useState(user?.settings?.reducedMotion ?? false);
  const [flashcardModel, setFlashcardModel] = useState(user?.modelDefaults?.flashcards || "gpt-4");
  const [qaModel, setQaModel] = useState(user?.modelDefaults?.qa || "gpt-4");

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your StudyHub experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Model Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>AI Model Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="flashcard-model">Flashcard Generation</Label>
              <Select value={flashcardModel} onValueChange={setFlashcardModel}>
                <SelectTrigger data-testid="select-flashcard-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude-3 Sonnet</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="qa-model">Q&A Assistant</Label>
              <Select value={qaModel} onValueChange={setQaModel}>
                <SelectTrigger data-testid="select-qa-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-3-opus">Claude-3 Opus</SelectItem>
                  <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
              <i className="fas fa-info-circle mr-1"></i>
              Automatic fallback to secondary models when primary quota is exceeded.
            </div>
          </CardContent>
        </Card>

        {/* Appearance & Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance & Accessibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger data-testid="select-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-xs text-muted-foreground">Get reminders for reviews and streaks</p>
              </div>
              <Switch 
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
                <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
              </div>
              <Switch 
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
                data-testid="switch-reduced-motion"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground" data-testid="text-user-email">{user?.email || 'Not provided'}</p>
            </div>
            
            <div>
              <Label>Name</Label>
              <p className="text-sm text-muted-foreground" data-testid="text-user-name">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName || 'Not provided'
                }
              </p>
            </div>

            <div>
              <Label>Member Since</Label>
              <p className="text-sm text-muted-foreground" data-testid="text-member-since">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" data-testid="button-export-data">
              <i className="fas fa-download mr-2"></i>
              Export My Data
            </Button>
            
            <Button variant="outline" className="w-full justify-start" data-testid="button-privacy-policy">
              <i className="fas fa-shield-alt mr-2"></i>
              Privacy Policy
            </Button>
            
            <Button variant="outline" onClick={() => window.location.href = '/api/logout'} data-testid="button-logout">
              <i className="fas fa-sign-out-alt mr-2"></i>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
