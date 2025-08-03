import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Filter, Edit, Trash2, MapPin, Clock, Users, Calendar, AlertCircle } from "lucide-react";

export const EventManagement = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Meeting",
      description: "Weekly team sync meeting to discuss project progress",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "1 hour",
      location: "Conference Room A",
      attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
      type: "meeting",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Holiday - Republic Day",
      description: "National holiday - Office closed",
      date: "2024-01-26",
      time: "All Day",
      duration: "All Day",
      location: "Office Closed",
      attendees: [],
      type: "holiday",
      status: "confirmed"
    },
    {
      id: 3,
      title: "Performance Review",
      description: "Annual performance review meeting",
      date: "2024-01-20",
      time: "2:00 PM",
      duration: "30 minutes",
      location: "HR Office",
      attendees: ["HR Manager", "Employee"],
      type: "review",
      status: "upcoming"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    attendees: "",
    type: "meeting"
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-[#843C6D]/10 text-[#843C6D]";
      case "holiday":
        return "bg-red-100 text-red-800";
      case "review":
        return "bg-purple-100 text-purple-800";
      case "training":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleAddEvent = () => {
    const event = {
      id: Date.now(),
      ...newEvent,
      attendees: newEvent.attendees ? newEvent.attendees.split(",").map(a => a.trim()) : [],
      status: "upcoming"
    };
    setEvents([...events, event]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      attendees: "",
      type: "meeting"
    });
    setIsAddDialogOpen(false);
  };

  const handleEditEvent = () => {
    if (editingEvent) {
      const updatedEvents = events.map(event =>
        event.id === editingEvent.id ? editingEvent : event
      );
      setEvents(updatedEvents);
      setEditingEvent(null);
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="holiday">Holidays</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new event with all the necessary details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: e.target.value})}
                    placeholder="e.g., 1 hour"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div>
                <Label htmlFor="attendees">Attendees (comma-separated)</Label>
                <Input
                  id="attendees"
                  value={newEvent.attendees}
                  onChange={(e) => setNewEvent({...newEvent, attendees: e.target.value})}
                  placeholder="John Doe, Jane Smith"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.map(event => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{event.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{event.time} ({event.duration})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{event.attendees.length} attendees</span>
                    </div>
                  </div>
                  {event.attendees.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-1">Attendees:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.attendees.map((attendee, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {attendee}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingEvent(event)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                          Update the event details.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-title">Event Title</Label>
                          <Input
                            id="edit-title"
                            value={editingEvent?.title || ""}
                            onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={editingEvent?.description || ""}
                            onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                              id="edit-date"
                              type="date"
                              value={editingEvent?.date || ""}
                              onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-time">Time</Label>
                            <Input
                              id="edit-time"
                              type="time"
                              value={editingEvent?.time || ""}
                              onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-duration">Duration</Label>
                            <Input
                              id="edit-duration"
                              value={editingEvent?.duration || ""}
                              onChange={(e) => setEditingEvent({...editingEvent, duration: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-type">Event Type</Label>
                            <Select 
                              value={editingEvent?.type || "meeting"} 
                              onValueChange={(value) => setEditingEvent({...editingEvent, type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="meeting">Meeting</SelectItem>
                                <SelectItem value="holiday">Holiday</SelectItem>
                                <SelectItem value="review">Review</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="edit-location">Location</Label>
                          <Input
                            id="edit-location"
                            value={editingEvent?.location || ""}
                            onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-attendees">Attendees (comma-separated)</Label>
                          <Input
                            id="edit-attendees"
                            value={editingEvent?.attendees?.join(", ") || ""}
                            onChange={(e) => setEditingEvent({...editingEvent, attendees: e.target.value.split(",").map(a => a.trim())})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingEvent(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditEvent}>Update Event</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first event."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 