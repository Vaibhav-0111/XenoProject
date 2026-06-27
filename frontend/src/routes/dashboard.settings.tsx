import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Bell, Shield, Paintbrush, Database } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [apiKey, setApiKey] = useState("••••••••••••••••");
  const [theme, setTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [denseTables, setDenseTables] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 relative max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Settings
        </h2>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 border rounded-xl shadow-sm bg-white dark:bg-slate-900 space-y-6"
        >
          <div className="flex items-center gap-2 border-b pb-4">
            <Paintbrush className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-semibold">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Theme</Label>
                <p className="text-sm text-slate-500">Sync with your OS dark/light mode</p>
              </div>
              <Switch checked={theme} onCheckedChange={setTheme} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dense Tables</Label>
                <p className="text-sm text-slate-500">Show more rows per page in data grids</p>
              </div>
              <Switch checked={denseTables} onCheckedChange={setDenseTables} />
            </div>
          </div>
        </motion.div>

        {/* Integration Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-6 border rounded-xl shadow-sm bg-white dark:bg-slate-900 space-y-6"
        >
          <div className="flex items-center gap-2 border-b pb-4">
            <Database className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-semibold">Integrations</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>OpenAI API Key</Label>
              <div className="flex gap-2">
                <Input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  className="font-mono"
                />
                <Button variant="outline">Test</Button>
              </div>
              <p className="text-xs text-slate-500">Used for AI campaign generation and risk scoring.</p>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-6 border rounded-xl shadow-sm bg-white dark:bg-slate-900 space-y-6"
        >
          <div className="flex items-center gap-2 border-b pb-4">
            <Bell className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Campaign Alerts</Label>
                <p className="text-sm text-slate-500">Get notified when a campaign finishes</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="p-6 border rounded-xl shadow-sm bg-white dark:bg-slate-900 space-y-6"
        >
          <div className="flex items-center gap-2 border-b pb-4">
            <Shield className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-between">
              Change Password
              <Shield className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="destructive" className="w-full justify-between">
              Revoke All Sessions
              <Shield className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
