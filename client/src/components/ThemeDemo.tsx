import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { ChevronDown, Download, Plus, Search } from 'lucide-react';

export const ThemeDemo = () => {
  const { currentTheme, setTheme, colors, isSuperAdmin, isCompany } = useTheme();

  return (
    <div className="p-6 space-y-6">
      {/* Theme Switcher */}
      <Card className="theme-bg-primary theme-border theme-shadow">
        <CardHeader>
          <CardTitle className="theme-text-primary">Theme System Demo</CardTitle>
          <CardDescription>
            Current theme: {currentTheme} ({isSuperAdmin ? 'Super Admin' : 'Company'})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => setTheme('superAdmin')}
              variant={isSuperAdmin ? 'default' : 'outline'}
              className="theme-primary-hover"
            >
              Super Admin Theme
            </Button>
            <Button 
              onClick={() => setTheme('company')}
              variant={isCompany ? 'default' : 'outline'}
              className="theme-primary-hover"
            >
              Company Theme
            </Button>
          </div>
          
          {/* Color Palette */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-12 rounded-lg theme-primary"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">{colors.primary}</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg theme-secondary"></div>
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">{colors.secondary}</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg theme-bg-primary border"></div>
              <p className="text-sm font-medium">Primary BG</p>
              <p className="text-xs text-muted-foreground">{colors.primaryBg}</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg theme-bg-secondary border"></div>
              <p className="text-sm font-medium">Secondary BG</p>
              <p className="text-xs text-muted-foreground">{colors.secondaryBg}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buttons */}
        <Card className="theme-bg-primary theme-border theme-shadow">
          <CardHeader>
            <CardTitle className="theme-text-primary">Buttons</CardTitle>
            <CardDescription>Different button variants with theme colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="gradient">Gradient Button</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm">Small</Button>
              <Button variant="secondary" size="lg">Large</Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                With Icon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card className="theme-bg-primary theme-border theme-shadow">
          <CardHeader>
            <CardTitle className="theme-text-primary">Form Elements</CardTitle>
            <CardDescription>Inputs and dropdowns with theme styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Input</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Dropdown Menu</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select Option
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>Option 1</DropdownMenuItem>
                  <DropdownMenuItem>Option 2</DropdownMenuItem>
                  <DropdownMenuItem>Option 3</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="theme-bg-primary theme-border theme-shadow">
          <CardHeader>
            <CardTitle className="theme-text-primary">Tabs</CardTitle>
            <CardDescription>Tab navigation with theme colors</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Overview content with theme styling.
                </p>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Analytics content with theme styling.
                </p>
              </TabsContent>
              <TabsContent value="reports" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Reports content with theme styling.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Cards with Actions */}
        <Card className="theme-bg-primary theme-border theme-shadow">
          <CardHeader>
            <CardTitle className="theme-text-primary">Card with Actions</CardTitle>
            <CardDescription>Cards with themed buttons and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 theme-bg-secondary rounded-lg">
              <h4 className="font-medium mb-2">Employee Management</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your organization's workforce with comprehensive tools.
              </p>
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Employee
                </Button>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Information */}
      <Card className="theme-bg-secondary theme-border theme-shadow">
        <CardHeader>
          <CardTitle className="theme-text-primary">Theme Information</CardTitle>
          <CardDescription>Current theme configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Theme Colors</h4>
              <div className="space-y-1">
                <p><span className="font-medium">Primary:</span> {colors.primary}</p>
                <p><span className="font-medium">Secondary:</span> {colors.secondary}</p>
                <p><span className="font-medium">Primary Hover:</span> {colors.primaryHover}</p>
                <p><span className="font-medium">Secondary Hover:</span> {colors.secondaryHover}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Background Colors</h4>
              <div className="space-y-1">
                <p><span className="font-medium">Primary BG:</span> {colors.primaryBg}</p>
                <p><span className="font-medium">Secondary BG:</span> {colors.secondaryBg}</p>
                <p><span className="font-medium">Border:</span> {colors.border}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
