// NYC Trip Widget for Scriptable
// Install: Copy this entire script into the Scriptable app
// Then: Long-press home screen → Add Widget → Scriptable → Medium
// Select this script in the widget config

const TRIP_START = new Date('2026-03-15'); // ← SET YOUR SUNDAY ARRIVAL DATE

const DAYS = [
  {
    day: 'Sunday', label: 'SUN', theme: '#F59E0B',
    title: 'Arrival Night',
    items: [
      'Arrive JFK ~7 PM',
      'AirTrain > Subway > Moxy',
      'Joe\'s / Momofuku / Ruby\'s',
      'Van Leeuwen Ice Cream'
    ]
  },
  {
    day: 'Monday', label: 'MON', theme: '#3B82F6',
    title: 'Brooklyn Adventure',
    items: [
      'Brooklyn Bridge > DUMBO',
      'Washington St photo op',
      'Jane\'s Carousel',
      'Juliana\'s / Time Out Market',
      'Transit Museum > Promenade',
      'Staten Island Ferry (optional)',
      'Tacombi / Ruby\'s / Shake Shack'
    ]
  },
  {
    day: 'Tuesday', label: 'TUE', theme: '#8B5CF6',
    title: 'Math + Neighborhood',
    items: [
      'MoMath ~10 AM (1.5-2 hrs)',
      'Eataly / Tacombi / Daily Provisions',
      'Madison Square Park',
      'Flatiron Building photo',
      'Washington Sq / East Village',
      'Relaxed evening near hotel'
    ]
  },
  {
    day: 'Wednesday', label: 'WED', theme: '#EC4899',
    title: 'Broadway Day',
    items: [
      'Camp Store > Books > Strand',
      'Grand Central > Bryant Park',
      'Los Tacos No.1 / Urban Hawker',
      'ALADDIN 1:00 PM',
      'Times Square > NBA Store',
      'Roosevelt Island Tram',
      'Ruby\'s / Tacombi / Serafina'
    ]
  },
  {
    day: 'Thursday', label: 'THU', theme: '#10B981',
    title: 'Dinosaurs + Skyline',
    items: [
      'Natural History Museum',
      'Patsy\'s Pizza / Shake Shack',
      'Central Park + playground',
      'FAO Schwarz / LEGO / Nintendo',
      'Top of the Rock sunset',
      'Mercado Little Spain',
      'Vessel > High Line walk'
    ]
  },
  {
    day: 'Friday', label: 'FRI', theme: '#F97316',
    title: 'Aviation Day',
    items: [
      'Union Square Greenmarket',
      'Daily Provisions breakfast',
      'Xi\'an Famous Foods lunch',
      'Transit to JFK > TWA Hotel',
      'Aviation exhibits & planes',
      'Runway observation deck',
      'Connie Cocktail Lounge'
    ]
  }
];

// ── Determine which day to show ──
const now = new Date();
const msPerDay = 86400000;
const dayIndex = Math.floor((now - TRIP_START) / msPerDay);

let today;
if (dayIndex < 0) {
  // Before trip — show countdown
  today = null;
} else if (dayIndex >= DAYS.length) {
  // After trip
  today = null;
} else {
  today = DAYS[dayIndex];
}

// ── Build Widget ──
const w = new ListWidget();
w.setPadding(12, 14, 12, 14);

if (!today) {
  // Countdown or trip-over mode
  const daysUntil = Math.ceil((TRIP_START - now) / msPerDay);

  if (daysUntil > 0) {
    w.backgroundGradient = buildGradient('#1E293B', '#334155');
    w.addSpacer();
    const ct = w.addText(`${daysUntil} day${daysUntil === 1 ? '' : 's'} to NYC!`);
    ct.font = Font.boldSystemFont(22);
    ct.textColor = Color.white();
    ct.centerAlignText();
    w.addSpacer(4);
    const sub = w.addText('Moxy East Village → TWA Hotel');
    sub.font = Font.systemFont(12);
    sub.textColor = new Color('#94A3B8');
    sub.centerAlignText();
    w.addSpacer();
  } else {
    w.backgroundGradient = buildGradient('#1E293B', '#334155');
    const done = w.addText('🗽 Trip complete!');
    done.font = Font.boldSystemFont(16);
    done.textColor = Color.white();
    done.centerAlignText();
  }
} else {
  // Active trip day
  const bg1 = today.theme;
  const bg2 = adjustColor(bg1, -30);
  w.backgroundGradient = buildGradient(bg1, bg2);

  // Header row
  const header = w.addStack();
  header.layoutHorizontally();
  header.centerAlignContent();

  const dayLabel = header.addText(`${today.label} | ${today.day}`);
  dayLabel.font = Font.boldSystemFont(15);
  dayLabel.textColor = Color.white();

  header.addSpacer();

  const badge = header.addText(today.title);
  badge.font = Font.mediumSystemFont(11);
  badge.textColor = new Color('#FFFFFF', 0.75);

  w.addSpacer(6);

  // Divider
  const divider = w.addStack();
  divider.size = new Size(0, 1);
  divider.backgroundColor = new Color('#FFFFFF', 0.25);
  w.addSpacer(6);

  // Items — show as many as fit
  const maxItems = 5;
  const shown = today.items.slice(0, maxItems);

  for (const item of shown) {
    const row = w.addText(item);
    row.font = Font.systemFont(12);
    row.textColor = Color.white();
    row.lineLimit = 1;
    w.addSpacer(2);
  }

  if (today.items.length > maxItems) {
    const more = w.addText(`+${today.items.length - maxItems} more…`);
    more.font = Font.italicSystemFont(11);
    more.textColor = new Color('#FFFFFF', 0.6);
  }

  // Tap to open PWA
  w.url = 'https://elovelin.github.io/nyc-itinerary/';
}

if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  await w.presentMedium();
}
Script.complete();

// ── Helpers ──
function buildGradient(hex1, hex2) {
  const g = new LinearGradient();
  g.locations = [0, 1];
  g.colors = [new Color(hex1), new Color(hex2)];
  return g;
}

function adjustColor(hex, amount) {
  hex = hex.replace('#', '');
  let r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  let g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  let b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}
