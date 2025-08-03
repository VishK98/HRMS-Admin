import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HolidayModal } from "./HolidayModal";
import { Holiday } from "@/types/broadcast";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

export const HolidayManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [filteredHolidays, setFilteredHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("view");
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  // Fetch holidays from API
  useEffect(() => {
    if (user?.company?._id) {
      fetchHolidays();
    }
  }, [user]);

  // Filter holidays when search term or filters change
  useEffect(() => {
    filterHolidays();
  }, [holidays, searchTerm, statusFilter, typeFilter]);

  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch holidays from the API
      const response = await apiClient.getHolidaysByCompany(user!.company!._id);
      
      if (response.success) {
        setHolidays(response.data!.holidays);
      } else {
        setError(response.message || "Failed to fetch holidays");
      }
    } catch (err) {
      setError("Failed to fetch holidays");
      console.error("Error fetching holidays:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterHolidays = () => {
    const filtered = holidays.filter(holiday => {
      const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           holiday.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || holiday.isActive === (statusFilter === "active");
      const matchesType = typeFilter === "all" || holiday.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
    
    setFilteredHolidays(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-success text-success-foreground">Active</Badge> :
      <Badge className="bg-destructive text-destructive-foreground">Inactive</Badge>;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "public":
        return <Badge variant="default">Public Holiday</Badge>;
      case "company":
        return <Badge variant="secondary">Company Holiday</Badge>;
      case "optional":
        return <Badge variant="outline">Optional Holiday</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleViewDetails = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAddHoliday = () => {
    setSelectedHoliday(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleSaveHoliday = async (holiday: Holiday) => {
    try {
      let response;
      if (modalMode === "add") {
        // Create new holiday
        response = await apiClient.createHoliday({ ...holiday, companyId: user!.company!._id });
      } else {
        // Update existing holiday
        response = await apiClient.updateHoliday(holiday._id, holiday);
      }
      
      if (response.success) {
        if (modalMode === "add") {
          setHolidays(prev => [...prev, response.data!]);
        } else {
          setHolidays(prev => prev.map(hol => hol._id === holiday._id ? response.data! : hol));
        }
        setModalOpen(false);
      } else {
        setError(response.message || "Failed to save holiday");
      }
    } catch (err) {
      setError("Failed to save holiday");
      console.error("Error saving holiday:", err);
    }
  };

  const handleDeleteHoliday = async (holidayId: string) => {
    try {
      const response = await apiClient.deleteHoliday(holidayId);
      
      if (response.success) {
        setHolidays(prev => prev.filter(hol => hol._id !== holidayId));
        setModalOpen(false);
      } else {
        setError(response.message || "Failed to delete holiday");
      }
    } catch (err) {
      setError("Failed to delete holiday");
      console.error("Error deleting holiday:", err);
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
          <Button onClick={fetchHolidays} className="mt-2">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Holiday Management</h2>
          <p className="text-muted-foreground">Manage company holidays and leave days</p>
        </div>
        <Button onClick={handleAddHoliday} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Holiday
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Holidays</CardTitle>
          <CardDescription>Search and filter holidays</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search holidays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Holidays
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
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Type: {typeFilter === "all" ? "All" : typeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("public")}>
                  Public Holiday
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("company")}>
                  Company Holiday
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("optional")}>
                  Optional Holiday
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Holiday Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHolidays.map((holiday) => (
                  <TableRow key={holiday._id}>
                    <TableCell>
                      <div className="font-medium">{holiday.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(holiday.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(holiday.type)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {holiday.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(holiday.isActive)}
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
                            onClick={() => handleViewDetails(holiday)}
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2" 
                            onClick={() => handleEditHoliday(holiday)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit Holiday
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive" 
                            onClick={() => handleDeleteHoliday(holiday._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Holiday
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredHolidays.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No holidays found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Holiday Modal */}
      <HolidayModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        holiday={selectedHoliday}
        onSave={handleSaveHoliday}
        onDelete={handleDeleteHoliday}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}; 