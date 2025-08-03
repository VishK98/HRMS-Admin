import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, Megaphone
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnnouncementModal } from "./AnnouncementModal";
import { Announcement } from "@/types/broadcast";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

export const AnnouncementManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("view");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Fetch announcements from API
  useEffect(() => {
    if (user?.company?._id) {
      fetchAnnouncements();
    }
  }, [user]);

  // Filter announcements when search term or filters change
  useEffect(() => {
    filterAnnouncements();
  }, [announcements, searchTerm, statusFilter, typeFilter]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch announcements from the API
      const response = await apiClient.getAnnouncementsByCompany(user!.company!._id);
      
      if (response.success) {
        setAnnouncements(response.data!.announcements);
      } else {
        setError(response.message || "Failed to fetch announcements");
      }
    } catch (err) {
      setError("Failed to fetch announcements");
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAnnouncements = () => {
    const filtered = announcements.filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || announcement.isActive === (statusFilter === "active");
      const matchesType = typeFilter === "all" || announcement.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
    
    setFilteredAnnouncements(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-[#843C6D]/10 text-[#843C6D] border border-[#843C6D]/20">Active</Badge> :
      <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Inactive</Badge>;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "general":
        return <Badge className="bg-[#843C6D]/10 text-[#843C6D] border border-[#843C6D]/20">General</Badge>;
      case "important":
        return <Badge className="bg-orange-100 text-orange-800 border border-orange-200">Important</Badge>;
      case "urgent":
        return <Badge className="bg-red-100 text-red-800 border border-red-200">Urgent</Badge>;
      case "info":
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Info</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">{type}</Badge>;
    }
  };

  const getTargetAudienceBadge = (targetAudience: string) => {
    switch (targetAudience) {
      case "all":
        return <Badge className="bg-[#843C6D]/10 text-[#843C6D] border border-[#843C6D]/20">All Employees</Badge>;
      case "department":
        return <Badge className="bg-green-100 text-green-800 border border-green-200">Department</Badge>;
      case "designation":
        return <Badge className="bg-purple-100 text-purple-800 border border-purple-200">Designation</Badge>;
      case "specific":
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">Specific</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">{targetAudience}</Badge>;
    }
  };

  const handleViewDetails = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAddAnnouncement = () => {
    setSelectedAnnouncement(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleSaveAnnouncement = async (announcement: Announcement) => {
    try {
      let response;
      if (modalMode === "add") {
        // Create new announcement
        response = await apiClient.createAnnouncement({ ...announcement, companyId: user!.company!._id });
      } else {
        // Update existing announcement
        response = await apiClient.updateAnnouncement(announcement._id, announcement);
      }
      
      if (response.success) {
        if (modalMode === "add") {
          setAnnouncements(prev => [...prev, response.data!]);
        } else {
          setAnnouncements(prev => prev.map(ann => ann._id === announcement._id ? response.data! : ann));
        }
        setModalOpen(false);
      } else {
        setError(response.message || "Failed to save announcement");
      }
    } catch (err) {
      setError("Failed to save announcement");
      console.error("Error saving announcement:", err);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      const response = await apiClient.deleteAnnouncement(announcementId);
      
      if (response.success) {
        setAnnouncements(prev => prev.filter(ann => ann._id !== announcementId));
        setModalOpen(false);
      } else {
        setError(response.message || "Failed to delete announcement");
      }
    } catch (err) {
      setError("Failed to delete announcement");
      console.error("Error deleting announcement:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchAnnouncements} className="mt-2">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Announcement Management</h2>
          <p className="text-muted-foreground">Manage company announcements and notifications</p>
        </div>
        <Button onClick={handleAddAnnouncement} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Announcement
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Search and filter announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 hover:bg-[#843C6D] hover:text-white transition-colors">
                  <Filter className="w-4 h-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Announcements
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 hover:bg-[#843C6D] hover:text-white transition-colors">
                  <Megaphone className="w-4 h-4" />
                  Type: {typeFilter === "all" ? "All" : typeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("general")}>
                  General
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("important")}>
                  Important
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("urgent")}>
                  Urgent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("info")}>
                  Info
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Announcement Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Target Audience</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnouncements.map((announcement) => (
                  <TableRow key={announcement._id}>
                    <TableCell>
                      <div className="font-medium">{announcement.title}</div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(announcement.type)}
                    </TableCell>
                    <TableCell>
                      {getTargetAudienceBadge(announcement.targetAudience)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {announcement.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(announcement.isActive)}
                    </TableCell>
                    <TableCell>
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="gap-2" 
                            onClick={() => handleViewDetails(announcement)}
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2" 
                            onClick={() => handleEditAnnouncement(announcement)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit Announcement
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive" 
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Announcement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No announcements found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Announcement Modal */}
      <AnnouncementModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        announcement={selectedAnnouncement}
        onSave={handleSaveAnnouncement}
        onDelete={handleDeleteAnnouncement}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}; 