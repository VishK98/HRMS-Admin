const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test data
const testCompanyId = "507f1f77bcf86cd799439011"; // Mock company ID
const testDesignation = {
  name: "Software Engineer",
  description: "Develops software applications",
  level: 3,
  department: "Engineering",
  companyId: testCompanyId,
};

const testDepartment = {
  name: "Sales Department",
  description: "Handles all sales activities",
  manager: "John Doe",
  subCategories: [
    {
      name: "Inside Sales",
      description: "Internal sales team",
      isActive: true,
    },
    { name: "Outside Sales", description: "Field sales team", isActive: true },
    {
      name: "Enterprise Sales",
      description: "Large account sales",
      isActive: true,
    },
    { name: "SMB Sales", description: "Small business sales", isActive: true },
  ],
  companyId: testCompanyId,
};

const testHoliday = {
  name: "Company Holiday",
  date: "2024-12-25",
  description: "Christmas Day",
  type: "company",
  companyId: testCompanyId,
};

const testAnnouncement = {
  title: "Important Announcement",
  content: "This is a test announcement",
  type: "important",
  targetAudience: "all",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  companyId: testCompanyId,
};

async function testBroadcastEndpoints() {
  console.log("🧪 Testing Broadcast API Endpoints...\n");

  try {
    // Test Designations
    console.log("📋 Testing Designations...");

    // Create designation
    const createDesignationRes = await axios.post(
      `${API_BASE_URL}/designations`,
      testDesignation
    );
    console.log("✅ Create designation:", createDesignationRes.data.success);

    // Get designations
    const getDesignationsRes = await axios.get(
      `${API_BASE_URL}/designations/company/${testCompanyId}`
    );
    console.log("✅ Get designations:", getDesignationsRes.data.success);
    console.log(
      `   Found ${getDesignationsRes.data.data.designations.length} designations\n`
    );

    // Test Departments
    console.log("🏢 Testing Departments...");

    // Create department
    const createDepartmentRes = await axios.post(
      `${API_BASE_URL}/departments`,
      testDepartment
    );
    console.log("✅ Create department:", createDepartmentRes.data.success);

    // Get departments
    const getDepartmentsRes = await axios.get(
      `${API_BASE_URL}/departments/company/${testCompanyId}`
    );
    console.log("✅ Get departments:", getDepartmentsRes.data.success);
    console.log(
      `   Found ${getDepartmentsRes.data.data.departments.length} departments\n`
    );

    // Test Holidays
    console.log("🎉 Testing Holidays...");

    // Create holiday
    const createHolidayRes = await axios.post(
      `${API_BASE_URL}/holidays`,
      testHoliday
    );
    console.log("✅ Create holiday:", createHolidayRes.data.success);

    // Get holidays
    const getHolidaysRes = await axios.get(
      `${API_BASE_URL}/holidays/company/${testCompanyId}`
    );
    console.log("✅ Get holidays:", getHolidaysRes.data.success);
    console.log(
      `   Found ${getHolidaysRes.data.data.holidays.length} holidays\n`
    );

    // Test Announcements
    console.log("📢 Testing Announcements...");

    // Create announcement
    const createAnnouncementRes = await axios.post(
      `${API_BASE_URL}/announcements`,
      testAnnouncement
    );
    console.log("✅ Create announcement:", createAnnouncementRes.data.success);

    // Get announcements
    const getAnnouncementsRes = await axios.get(
      `${API_BASE_URL}/announcements/company/${testCompanyId}`
    );
    console.log("✅ Get announcements:", getAnnouncementsRes.data.success);
    console.log(
      `   Found ${getAnnouncementsRes.data.data.announcements.length} announcements\n`
    );

    console.log("🎉 All broadcast API endpoints are working correctly!");
  } catch (error) {
    console.error(
      "❌ Error testing broadcast endpoints:",
      error.response?.data || error.message
    );
  }
}

// Run the test
testBroadcastEndpoints();
