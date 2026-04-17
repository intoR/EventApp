import { Session } from './types';

export const SESSIONS: Session[] = [
  {
    id: 's1',
    title: 'Continental Breakfast & Registration',
    time: '08:00 AM - 09:00 AM',
    location: 'Pier 27 (Cruise Terminal)',
    description: 'Fuel up for the day and collect your badge.',
    type: 'social',
    isAfternoon: false,
  },
  {
    id: 's2',
    title: 'Opening Keynote: The Future of SF Tech',
    time: '09:00 AM - 10:30 AM',
    location: 'Main Stage, Pier 27',
    description: 'A deep dive into the innovations shaping the Bay Area.',
    type: 'keynote',
    isAfternoon: false,
  },
  {
    id: 's3',
    title: 'Morning Break & Networking',
    time: '10:30 AM - 11:00 AM',
    location: 'Observation Deck',
    description: 'Connect with fellow attendees over coffee.',
    type: 'break',
    isAfternoon: false,
  },
  {
    id: 's4',
    title: 'Workshop: Scalable AI Architectures',
    time: '11:00 AM - 12:30 PM',
    location: 'Workshop Hall A',
    description: 'Hands-on session with industry experts.',
    type: 'workshop',
    isAfternoon: false,
  },
  {
    id: 's5',
    title: 'Lunch Break & Travel to Afternoon Venue',
    time: '12:30 PM - 02:00 PM',
    location: 'Traveling to SF Jazz Center',
    description: 'Lunch served on-site, followed by guided transport to the Jazz Center.',
    type: 'social',
    isAfternoon: false,
  },
  {
    id: 's6',
    title: 'Jazz & Tech: Harmonizing Logic',
    time: '02:00 PM - 03:30 PM',
    location: 'SF Jazz Center',
    description: 'A unique exploration of creativity in engineering.',
    type: 'keynote',
    isAfternoon: true,
  },
  {
    id: 's7',
    title: 'Closing Reception & Open Bar',
    time: '04:00 PM - 06:00 PM',
    location: 'Miner Auditorium Terrace',
    description: 'Celebrate the day with drinks and live jazz.',
    type: 'social',
    isAfternoon: true,
  },
];

export const VENUES = {
  MORNING: {
    name: 'Pier 27',
    address: 'The Embarcadero, San Francisco, CA 94111',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pier+27+San+Francisco',
  },
  AFTERNOON: {
    name: 'SF Jazz Center',
    address: '201 Franklin St, San Francisco, CA 94102',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=SF+Jazz+Center+San+Francisco',
  },
};
