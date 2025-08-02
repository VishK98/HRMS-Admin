import { AttendanceRecord } from "@/types/attendance";

export interface ReportOptions {
  includeLocation: boolean;
  includeDistance: boolean;
  format: 'csv' | 'pdf' | 'excel';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters?: {
    department?: string;
    status?: string;
    employeeId?: string;
  };
}

export interface ReportData {
  summary: {
    totalRecords: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    halfDayCount: number;
    onLeaveCount: number;
    avgWorkingHours: number;
    totalOvertime: number;
    locationTrackedCount: number;
  };
  records: AttendanceRecord[];
}

export class AttendanceReportGenerator {
  private records: AttendanceRecord[];
  private options: ReportOptions;

  constructor(records: AttendanceRecord[], options: ReportOptions) {
    this.records = records;
    this.options = options;
  }

  generateSummary(): ReportData['summary'] {
    const totalRecords = this.records.length;
    const presentCount = this.records.filter(r => r.status === 'present').length;
    const absentCount = this.records.filter(r => r.status === 'absent').length;
    const lateCount = this.records.filter(r => r.status === 'late').length;
    const halfDayCount = this.records.filter(r => r.status === 'half_day').length;
    const onLeaveCount = this.records.filter(r => r.status === 'on_leave').length;
    
    const totalWorkingHours = this.records.reduce((sum, r) => sum + r.workingHours, 0);
    const avgWorkingHours = totalRecords > 0 ? totalWorkingHours / totalRecords : 0;
    
    const totalOvertime = this.records.reduce((sum, r) => sum + r.overtime, 0);
    
    const locationTrackedCount = this.records.filter(r => 
      r.checkInLocation || r.checkOutLocation
    ).length;

    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      halfDayCount,
      onLeaveCount,
      avgWorkingHours,
      totalOvertime,
      locationTrackedCount
    };
  }

  generateCSV(): string {
    const headers = [
      'Date',
      'Employee Name',
      'Employee ID',
      'Department',
      'Status',
      'Check-in Time',
      'Check-out Time',
      'Working Hours',
      'Overtime Hours'
    ];

    if (this.options.includeLocation) {
      headers.push(
        'Check-in Location',
        'Check-in Coordinates',
        'Check-out Location',
        'Check-out Coordinates',
        'Location Accuracy'
      );
    }

    if (this.options.includeDistance) {
      headers.push('Distance Traveled');
    }

    let csvContent = headers.join(',') + '\n';

    this.records.forEach(record => {
      const row = [
        new Date(record.date).toLocaleDateString(),
        `"${record.employee.firstName} ${record.employee.lastName}"`,
        record.employee.employeeId,
        record.employee.department || '',
        record.status,
        record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '',
        record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '',
        record.workingHours.toFixed(2),
        record.overtime.toFixed(2)
      ];

      if (this.options.includeLocation) {
        const checkInLocation = record.checkInLocation ? 
          `"${record.checkInLocation.address || 'N/A'}"` : 'N/A';
        const checkInCoords = record.checkInLocation ? 
          `${record.checkInLocation.latitude},${record.checkInLocation.longitude}` : 'N/A';
        const checkOutLocation = record.checkOutLocation ? 
          `"${record.checkOutLocation.address || 'N/A'}"` : 'N/A';
        const checkOutCoords = record.checkOutLocation ? 
          `${record.checkOutLocation.latitude},${record.checkOutLocation.longitude}` : 'N/A';
        const accuracy = record.checkInLocation?.accuracy || record.checkOutLocation?.accuracy || 'N/A';

        row.push(checkInLocation, checkInCoords, checkOutLocation, checkOutCoords, accuracy);
      }

      if (this.options.includeDistance) {
        const distance = this.calculateDistance(record);
        row.push(distance);
      }

      csvContent += row.join(',') + '\n';
    });

    return csvContent;
  }

  generatePDF(): Blob {
    // This would require a PDF generation library like jsPDF
    // For now, we'll return a simple text representation
    const content = this.generateTextReport();
    return new Blob([content], { type: 'text/plain' });
  }

  generateExcel(): Blob {
    // This would require an Excel generation library like SheetJS
    // For now, we'll return the CSV as a blob
    const csvContent = this.generateCSV();
    return new Blob([csvContent], { type: 'text/csv' });
  }

  private generateTextReport(): string {
    const summary = this.generateSummary();
    let report = '';

    // Header
    report += 'ATTENDANCE REPORT\n';
    report += '='.repeat(50) + '\n\n';

    // Date Range
    report += `Date Range: ${this.options.dateRange.startDate} to ${this.options.dateRange.endDate}\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Summary
    report += 'SUMMARY\n';
    report += '-'.repeat(30) + '\n';
    report += `Total Records: ${summary.totalRecords}\n`;
    report += `Present: ${summary.presentCount}\n`;
    report += `Absent: ${summary.absentCount}\n`;
    report += `Late: ${summary.lateCount}\n`;
    report += `Half Day: ${summary.halfDayCount}\n`;
    report += `On Leave: ${summary.onLeaveCount}\n`;
    report += `Average Working Hours: ${summary.avgWorkingHours.toFixed(2)}h\n`;
    report += `Total Overtime: ${summary.totalOvertime.toFixed(2)}h\n`;
    report += `Location Tracked: ${summary.locationTrackedCount}\n\n`;

    // Detailed Records
    report += 'DETAILED RECORDS\n';
    report += '-'.repeat(30) + '\n';

    this.records.forEach((record, index) => {
      report += `${index + 1}. ${record.employee.firstName} ${record.employee.lastName} (${record.employee.employeeId})\n`;
      report += `   Date: ${new Date(record.date).toLocaleDateString()}\n`;
      report += `   Status: ${record.status}\n`;
      report += `   Check-in: ${record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'}\n`;
      report += `   Check-out: ${record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'}\n`;
      report += `   Working Hours: ${record.workingHours.toFixed(2)}h\n`;
      report += `   Overtime: ${record.overtime.toFixed(2)}h\n`;

      if (this.options.includeLocation) {
        if (record.checkInLocation) {
          report += `   Check-in Location: ${record.checkInLocation.address || `${record.checkInLocation.latitude}, ${record.checkInLocation.longitude}`}\n`;
        }
        if (record.checkOutLocation) {
          report += `   Check-out Location: ${record.checkOutLocation.address || `${record.checkOutLocation.latitude}, ${record.checkOutLocation.longitude}`}\n`;
        }
      }

      report += '\n';
    });

    return report;
  }

  private calculateDistance(record: AttendanceRecord): string {
    if (!record.checkInLocation || !record.checkOutLocation) {
      return 'N/A';
    }

    const R = 6371e3; // Earth's radius in meters
    const φ1 = (record.checkInLocation.latitude * Math.PI) / 180;
    const φ2 = (record.checkOutLocation.latitude * Math.PI) / 180;
    const Δφ = ((record.checkOutLocation.latitude - record.checkInLocation.latitude) * Math.PI) / 180;
    const Δλ = ((record.checkOutLocation.longitude - record.checkInLocation.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return `${(distance / 1000).toFixed(2)} km`;
  }

  downloadReport(): void {
    let blob: Blob;
    let filename: string;

    switch (this.options.format) {
      case 'csv':
        blob = new Blob([this.generateCSV()], { type: 'text/csv;charset=utf-8;' });
        filename = `attendance_report_${this.options.dateRange.startDate}_${this.options.dateRange.endDate}.csv`;
        break;
      case 'pdf':
        blob = this.generatePDF();
        filename = `attendance_report_${this.options.dateRange.startDate}_${this.options.dateRange.endDate}.pdf`;
        break;
      case 'excel':
        blob = this.generateExcel();
        filename = `attendance_report_${this.options.dateRange.startDate}_${this.options.dateRange.endDate}.xlsx`;
        break;
      default:
        blob = new Blob([this.generateTextReport()], { type: 'text/plain;charset=utf-8;' });
        filename = `attendance_report_${this.options.dateRange.startDate}_${this.options.dateRange.endDate}.txt`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
} 