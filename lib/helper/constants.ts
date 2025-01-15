export const suggestedTimelines = [
  { value: "3 months", label: "3 Months" },
  { value: "6 months", label: "6 Months" },
  { value: "9 months", label: "9 Months" },
  { value: "1 year", label: "1 Year" },
  { value: "2 years", label: "2 Years" },
  // { value: "3 years", label: "3 Years" },
  // { value: "5 years", label: "5 Years" },
  // { value: "10 years", label: "10 Years" },
];

export const colors = [
  // "bg-blue-100",
  // "bg-green-100",
  // "bg-purple-100",
  // "bg-yellow-100",
  // "bg-pink-100",
  // "bg-orange-100",
  // "bg-pink-200",
  // more
  "bg-blue-100",
  "bg-green-100",
  "bg-purple-100",
  "bg-yellow-100",
  "bg-pink-100",
  "bg-orange-100",
  "bg-pink-200",
  "bg-red-100",
  "bg-teal-100",
  "bg-indigo-100",
  "bg-cyan-100",
  "bg-lime-100",
  "bg-amber-100",
  "bg-rose-100",
  "bg-sky-100",
  "bg-violet-100",
  "bg-emerald-100",
  "bg-blue-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-yellow-200",
  "bg-orange-200",
  "bg-pink-300",
  "bg-fuchsia-300",
];


 // const colors = [
  //   "#E3F2FD", // light blue
  //   "#E8F5E9", // light green
  //   "#F3E5F5", // light purple
  //   "#FFF8E1", // light yellow
  //   "#FCE4EC", // light pink
  //   "#FFF3E0", // light orange
  //   "#E0F7FA", // light cyan
  //   "#FFEBEE", // light red
  //   "#E8EAF6", // light indigo
  //   "#F9FBE7", // light lime
  //   "#E0F2F1", // light teal
  //   "#EDE7F6", // light deep purple
  //   "#FBE9E7", // light coral
  // ];
  export const lightColors = [
    {
      name: "Violet",
      hex: "#ede9fe",
      tailwind: "bg-violet-100",
      description: "Soft lavender for a calming feel"
    },
    {
      name: "Blue",
      hex: "#dbeafe",
      tailwind: "bg-blue-100",
      description: "Soft sky blue for clarity and focus"
    },
    {
      name: "Green",
      hex: "#dcfce7",
      tailwind: "bg-green-100",
      description: "Soft mint green for growth and freshness"
    },
    {
      name: "Rose",
      hex: "#ffe4e6",
      tailwind: "bg-rose-100",
      description: "Soft pink for warmth and creativity"
    },
    {
      name: "Amber",
      hex: "#fef3c7",
      tailwind: "bg-amber-100",
      description: "Soft yellow for energy and positivity"
    },
    {
      name: "Cyan",
      hex: "#cffafe",
      tailwind: "bg-cyan-100",
      description: "Soft turquoise for calmness and serenity"
    },
    {
      name: "Indigo",
      hex: "#e0e7ff",
      tailwind: "bg-indigo-100",
      description: "Soft periwinkle for inspiration"
    },
    {
      name: "Emerald",
      hex: "#d1fae5",
      tailwind: "bg-emerald-100",
      description: "Soft sage for balance and harmony"
    },
    {
      name: "Fuchsia",
      hex: "#fae8ff",
      tailwind: "bg-fuchsia-100",
      description: "Soft magenta for creativity"
    },
    {
      name: "Orange",
      hex: "#ffedd5",
      tailwind: "bg-orange-100",
      description: "Soft peach for enthusiasm"
    },
    {
      name: "Teal",
      hex: "#ccfbf1",
      tailwind: "bg-teal-100",
      description: "Soft aqua for clarity and communication"
    },
    {
      name: "Red",
      hex: "#fee2e2",
      tailwind: "bg-red-100",
      description: "Soft coral for energy"
    }
  ];
  
  // Simplified array if you just need the Tailwind classes
  export const tailwindColors = lightColors.map(color => color.tailwind);
  
  // Simplified array if you just need the hex values
  export const hexColors = lightColors.map(color => color.hex);