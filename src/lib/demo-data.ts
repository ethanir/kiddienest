export const children = [
  {
    name: "Mia Johnson",
    room: "Toddler Room",
    status: "Checked in",
    age: "2 years old",
    pickup: "Ana Johnson",
    allergies: "Peanuts",
    lastUpdate: "Nap started at 12:20 PM",
  },
  {
    name: "Noah Smith",
    room: "Preschool",
    status: "Checked in",
    age: "4 years old",
    pickup: "Daniel Smith",
    allergies: "None",
    lastUpdate: "Lunch completed at 11:45 AM",
  },
  {
    name: "Sofia Garcia",
    room: "Infants",
    status: "Absent",
    age: "11 months",
    pickup: "Maria Garcia",
    allergies: "Dairy",
    lastUpdate: "No updates today",
  },
];

export const timeline = [
  {
    time: "8:12 AM",
    title: "Checked in",
    description: "Mia was checked in by Ana with a digital signature.",
    type: "Attendance",
  },
  {
    time: "9:30 AM",
    title: "Breakfast",
    description: "Ate oatmeal, banana, and milk.",
    type: "Meal",
  },
  {
    time: "10:25 AM",
    title: "Activity",
    description: "Practiced colors, sharing, and cleanup during circle time.",
    type: "Learning",
  },
  {
    time: "11:45 AM",
    title: "Photo shared",
    description: "Outdoor play photo added to Mia's private feed.",
    type: "Photo",
  },
  {
    time: "12:20 PM",
    title: "Nap started",
    description: "Mia started nap time in the toddler classroom.",
    type: "Nap",
  },
];

export const messages = [
  {
    from: "Ana Johnson",
    child: "Mia Johnson",
    preview: "Hi, can you let me know if Mia finishes her lunch today?",
    time: "9:08 AM",
    unread: true,
  },
  {
    from: "Daniel Smith",
    child: "Noah Smith",
    preview: "Noah will be picked up by his grandma today.",
    time: "8:42 AM",
    unread: true,
  },
  {
    from: "Maria Garcia",
    child: "Sofia Garcia",
    preview: "Sofia is staying home today. She has a small cold.",
    time: "7:55 AM",
    unread: false,
  },
];

export const forms = [
  { name: "Emergency Contact Form", status: "Signed", due: "Complete" },
  { name: "Medical / Allergy Form", status: "Needs review", due: "Today" },
  { name: "Photo Permission Form", status: "Signed", due: "Complete" },
  { name: "Parent Handbook Agreement", status: "Not sent", due: "This week" },
];

export const incidents = [
  {
    child: "Noah Smith",
    title: "Small playground scrape",
    status: "Needs parent signature",
    time: "Yesterday",
  },
  {
    child: "Mia Johnson",
    title: "Minor bump during play",
    status: "Signed",
    time: "Last week",
  },
];
