/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Session {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  type: 'keynote' | 'break' | 'workshop' | 'social';
  isAfternoon: boolean;
}

export interface Greeting {
  id: string;
  userName: string;
  photoUrl: string;
  message: string;
  createdAt: number;
}

export interface TravelPost {
  id: string;
  userName: string;
  type: 'offering' | 'seeking';
  from: string;
  to: string;
  time: string;
  notes: string;
  createdAt: number;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  timestamp: number;
}

export interface FeedbackEntry {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: number;
}
