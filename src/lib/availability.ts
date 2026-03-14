export type DayHours = {
  open: string;
  close: string;
} | null;

export const openingHours: Record<number, DayHours> = {
  0: null,
  1: { open: "16:30", close: "18:30" },
  2: { open: "16:30", close: "18:30" },
  3: { open: "16:30", close: "18:30" },
  4: { open: "16:30", close: "18:30" },
  5: { open: "16:30", close: "18:30" },
  6: null,
};

export const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getCopenhagenDateParts() {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Copenhagen",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date());

  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    day: weekdayMap[weekday ?? "Sun"],
    minutes: hour * 60 + minute,
  };
}

export function getAvailabilityStatus() {
  const { day: currentDay, minutes: currentMinutes } = getCopenhagenDateParts();
  const todayHours = openingHours[currentDay];

  if (todayHours) {
    const openMinutes = timeToMinutes(todayHours.open);
    const closeMinutes = timeToMinutes(todayHours.close);

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return {
        isOpen: true,
        message: `We are currently available until ${todayHours.close}.`,
      };
    }

    if (currentMinutes < openMinutes) {
      return {
        isOpen: false,
        message: `We are currently closed. We open today at ${todayHours.open}.`,
      };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDay + i) % 7;
    const nextDayHours = openingHours[nextDayIndex];

    if (nextDayHours) {
      return {
        isOpen: false,
        message: `We are currently closed. We open ${i === 1 ? "tomorrow" : `on ${dayNames[nextDayIndex]}`} at ${nextDayHours.open}.`,
      };
    }
  }

  return {
    isOpen: false,
    message: "We are currently closed.",
  };
}