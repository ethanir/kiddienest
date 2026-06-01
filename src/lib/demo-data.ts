export const children = [
  {
    name: "Mia Johnson",
    initials: "MJ",
    emoji: "😊",
    room: "Toddler Room",
    status: "Checked in",
    attendance: "checked-in",
    age: "2 years old",
    pickup: "Ana Johnson",
    allergies: "Peanuts",
    lastUpdate: "Nap started at 12:20 PM",
    avatarBg: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
    accent: "pink",
  },
  {
    name: "Noah Smith",
    initials: "NS",
    emoji: "🧸",
    room: "Preschool",
    status: "Not checked in",
    attendance: "not-arrived",
    age: "4 years old",
    pickup: "Daniel Smith",
    allergies: "None",
    lastUpdate: "Lunch completed at 11:45 AM",
    avatarBg: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    accent: "blue",
  },
  {
    name: "Sofia Garcia",
    initials: "SG",
    emoji: "🌼",
    room: "Infants",
    status: "Absent",
    attendance: "absent",
    age: "11 months",
    pickup: "Maria Garcia",
    allergies: "Dairy",
    lastUpdate: "No updates today",
    avatarBg: "linear-gradient(135deg, #fef3c7, #fde68a)",
    accent: "amber",
  },
  {
    name: "Lucas Brown",
    initials: "LB",
    emoji: "🚗",
    room: "Toddler Room",
    status: "Checked in",
    attendance: "checked-in",
    age: "3 years old",
    pickup: "Rachel Brown",
    allergies: "Eggs",
    lastUpdate: "Photo shared at 10:45 AM",
    avatarBg: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    accent: "green",
  },
];

export const timeline = [
  {
    time: "8:12 AM",
    title: "Checked in",
    description: "Mia was checked in by Ana with a digital signature.",
    type: "Attendance",
    color: "emerald",
  },
  {
    time: "9:30 AM",
    title: "Breakfast",
    description: "Ate oatmeal, banana, and milk.",
    type: "Meal",
    color: "orange",
  },
  {
    time: "10:25 AM",
    title: "Activity",
    description: "Practiced colors, sharing, and cleanup during circle time.",
    type: "Learning",
    color: "violet",
  },
  {
    time: "11:45 AM",
    title: "Photo shared",
    description: "Outdoor play photo added to Mia's private feed.",
    type: "Photo",
    color: "sky",
  },
  {
    time: "12:20 PM",
    title: "Nap started",
    description: "Mia started nap time in the toddler classroom.",
    type: "Nap",
    color: "indigo",
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
