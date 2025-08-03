import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Users } from "lucide-react";

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Sample events data
  const events = [
    {
      id: 1,
      title: "Team Meeting",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "Conference Room A",
      attendees: 8,
      type: "meeting"
    },
    {
      id: 2,
      title: "Holiday - Republic Day",
      date: "2024-01-26",
      time: "All Day",
      location: "Office Closed",
      attendees: 0,
      type: "holiday"
    },
    {
      id: 3,
      title: "Performance Review",
      date: "2024-01-20",
      time: "2:00 PM",
      location: "HR Office",
      attendees: 2,
      type: "review"
    },
    {
      id: 4,
      title: "Training Session",
      date: "2024-01-22",
      time: "11:00 AM",
      location: "Training Room",
      attendees: 12,
      type: "training"
    },
    {
      id: 5,
      title: "Client Meeting",
      date: "2024-01-25",
      time: "3:00 PM",
      location: "Conference Room B",
      attendees: 4,
      type: "meeting"
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800";
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

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const renderCalendar = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const calendarDays = [];

    // Add day headers
    const headerRow = (
      <div key="header" className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
    );
    calendarDays.push(headerRow);

    // Calculate total cells needed (including empty cells for days before month starts)
    const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;
    
    // Create calendar grid
    const calendarGrid = [];
    let dayCounter = 1;

    for (let i = 0; i < totalCells; i++) {
      const isCurrentMonth = i >= startingDay && dayCounter <= daysInMonth;
      
      if (isCurrentMonth) {
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
        const dayEvents = getEventsForDate(dateString);
        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCounter).toDateString();
        const isSelected = selectedDate && selectedDate.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCounter).toDateString();

        calendarGrid.push(
          <div
            key={dayCounter}
            className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors ${
              isToday ? 'bg-blue-50 border-blue-300' : ''
            } ${isSelected ? 'bg-blue-100 border-blue-400' : ''}`}
            onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCounter))}
          >
            <div className="text-sm font-medium mb-1">{dayCounter}</div>
            <div className="space-y-1 max-h-16 overflow-y-auto">
              {dayEvents.slice(0, 2).map(event => (
                <Badge
                  key={event.id}
                  className={`text-xs px-1 py-0.5 ${getEventTypeColor(event.type)} block truncate`}
                  title={event.title}
                >
                  {event.title}
                </Badge>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
        dayCounter++;
      } else {
        // Empty cell for days before month starts or after month ends
        calendarGrid.push(
          <div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>
        );
      }

      // Start new row every 7 days
      if ((i + 1) % 7 === 0) {
        calendarDays.push(
          <div key={`row-${Math.floor(i / 7)}`} className="grid grid-cols-7 gap-1">
            {calendarGrid.slice(-7)}
          </div>
        );
      }
    }

    return calendarDays;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            {renderCalendar()}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Events for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsForDate(selectedDate.toISOString().split('T')[0]).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDate(selectedDate.toISOString().split('T')[0]).map(event => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </span>
                        {event.attendees > 0 && (
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {event.attendees} attendees
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No events scheduled for this date.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 