import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Shield,
  FileText,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

export const DataSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [dataSettings, setDataSettings] = useState({
    // Data Retention
    dataRetention: {
      attendance: 365, // days
      leave: 730, // days
      reports: 1095, // days
      logs: 90, // days
    },
    
    // Export Settings
    exportFormats: {
      pdf: true,
      excel: true,
      csv: true,
      json: false,
    },
    
    // Privacy Settings
    privacySettings: {
      anonymizeData: false,
      dataSharing: false,
      analytics: true,
      marketing: false,
    },
    
    // Backup Settings
    backupSettings: {
      autoBackup: true,
      backupFrequency: "daily", // daily, weekly, monthly
      backupRetention: 30, // days
      cloudBackup: false,
    },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await apiClient.updateProfile({
        dataSettings,
      });
      
      if (response.success) {
        console.log("Data settings updated successfully");
      }
    } catch (error) {
      console.error("Error updating data settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async (type: string) => {
    setLoading(true);
    try {
      const response = await apiClient.exportData({ type });
      
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hrms-data-${type}-${new Date().toISOString().split('T')[0]}.${type}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteData = async (type: string) => {
    if (!confirm(`Are you sure you want to delete all ${type} data? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.deleteData({ type });
      
      if (response.success) {
        console.log(`${type} data deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>
            Export your data in various formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label className="text-base font-medium">Export Formats</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF Reports
                  </Label>
                  <Switch
                    checked={dataSettings.exportFormats.pdf}
                    onCheckedChange={(checked) => setDataSettings(prev => ({
                      ...prev,
                      exportFormats: { ...prev.exportFormats, pdf: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Excel Files
                  </Label>
                  <Switch
                    checked={dataSettings.exportFormats.excel}
                    onCheckedChange={(checked) => setDataSettings(prev => ({
                      ...prev,
                      exportFormats: { ...prev.exportFormats, excel: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV Files
                  </Label>
                  <Switch
                    checked={dataSettings.exportFormats.csv}
                    onCheckedChange={(checked) => setDataSettings(prev => ({
                      ...prev,
                      exportFormats: { ...prev.exportFormats, csv: checked }
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON Data
                  </Label>
                  <Switch
                    checked={dataSettings.exportFormats.json}
                    onCheckedChange={(checked) => setDataSettings(prev => ({
                      ...prev,
                      exportFormats: { ...prev.exportFormats, json: checked }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Quick Export</Label>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleExportData('pdf')}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleExportData('excel')}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as Excel
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleExportData('csv')}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Data Retention
          </CardTitle>
          <CardDescription>
            Configure how long data is kept in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Attendance Data
              </Label>
              <div className="text-sm text-muted-foreground">
                Keep for {dataSettings.dataRetention.attendance} days
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Leave Data
              </Label>
              <div className="text-sm text-muted-foreground">
                Keep for {dataSettings.dataRetention.leave} days
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </Label>
              <div className="text-sm text-muted-foreground">
                Keep for {dataSettings.dataRetention.reports} days
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                System Logs
              </Label>
              <div className="text-sm text-muted-foreground">
                Keep for {dataSettings.dataRetention.logs} days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control how your data is used and shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base font-medium">Anonymize Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Remove personal identifiers from data
                  </p>
                </div>
              </div>
              <Switch
                checked={dataSettings.privacySettings.anonymizeData}
                onCheckedChange={(checked) => setDataSettings(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, anonymizeData: checked }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base font-medium">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow data to be shared with third parties
                  </p>
                </div>
              </div>
              <Switch
                checked={dataSettings.privacySettings.dataSharing}
                onCheckedChange={(checked) => setDataSettings(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, dataSharing: checked }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base font-medium">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow usage analytics collection
                  </p>
                </div>
              </div>
              <Switch
                checked={dataSettings.privacySettings.analytics}
                onCheckedChange={(checked) => setDataSettings(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, analytics: checked }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base font-medium">Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow marketing communications
                  </p>
                </div>
              </div>
              <Switch
                checked={dataSettings.privacySettings.marketing}
                onCheckedChange={(checked) => setDataSettings(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, marketing: checked }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Backup Settings
          </CardTitle>
          <CardDescription>
            Configure automatic backup preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <Label className="text-base font-medium">Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup data
                </p>
              </div>
            </div>
            <Switch
              checked={dataSettings.backupSettings.autoBackup}
              onCheckedChange={(checked) => setDataSettings(prev => ({
                ...prev,
                backupSettings: { ...prev.backupSettings, autoBackup: checked }
              }))}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-primary" />
              <div>
                <Label className="text-base font-medium">Cloud Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Store backups in the cloud
                </p>
              </div>
            </div>
            <Switch
              checked={dataSettings.backupSettings.cloudBackup}
              onCheckedChange={(checked) => setDataSettings(prev => ({
                ...prev,
                backupSettings: { ...prev.backupSettings, cloudBackup: checked }
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <div className="text-sm text-muted-foreground capitalize">
                {dataSettings.backupSettings.backupFrequency}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Retention Period</Label>
              <div className="text-sm text-muted-foreground">
                {dataSettings.backupSettings.backupRetention} days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Manage and delete your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleDeleteData('attendance')}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Attendance Data
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleDeleteData('leave')}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Leave Data
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleDeleteData('reports')}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Reports
            </Button>
            
            <Button 
              variant="destructive" 
              className="justify-start"
              onClick={() => handleDeleteData('all')}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Status
          </CardTitle>
          <CardDescription>
            Overview of your data management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Data Backup</span>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Privacy Controls</span>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Data Retention</span>
              </div>
              <Badge variant="outline">Configured</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#843C6D]" />
                <span>Last Backup</span>
              </div>
              <Badge variant="outline">2 hours ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Data Settings"}
        </Button>
      </div>
    </div>
  );
}; 