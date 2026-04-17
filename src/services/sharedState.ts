/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Greeting, TravelPost, GalleryPhoto, FeedbackEntry } from '../types';

// Mocking the database for now until Firebase is ready
export class SharedStateService {
  private static STORAGE_KEY = 'sf_pulse_mock_db';

  private static getData() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : {
      greetings: [],
      travel: [],
      gallery: [
        {
          id: 'p1',
          url: 'https://picsum.photos/seed/sf1/800/600',
          caption: 'Morning energy at Pier 27!',
          timestamp: Date.now() - 3600000
        },
        {
          id: 'p2',
          url: 'https://picsum.photos/seed/sf2/800/600',
          caption: 'Setting up the main stage.',
          timestamp: Date.now() - 7200000
        }
      ],
      feedback: []
    };
  }

  private static saveData(data: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
  }

  static getGreetings(): Greeting[] {
    return this.getData().greetings;
  }

  static addGreeting(userName: string, photoUrl: string, message: string) {
    const data = this.getData();
    const newGreeting: Greeting = {
      id: Math.random().toString(36).substr(2, 9),
      userName,
      photoUrl,
      message,
      createdAt: Date.now()
    };
    data.greetings.unshift(newGreeting);
    this.saveData(data);
  }

  static getTravelPosts(): TravelPost[] {
    return this.getData().travel;
  }

  static addTravelPost(post: Omit<TravelPost, 'id' | 'createdAt'>) {
    const data = this.getData();
    const newPost: TravelPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    data.travel.unshift(newPost);
    this.saveData(data);
  }

  static getGallery(): GalleryPhoto[] {
    return this.getData().gallery;
  }

  static addGalleryPhoto(caption: string, url: string) {
    const data = this.getData();
    const newPhoto: GalleryPhoto = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      caption,
      timestamp: Date.now()
    };
    data.gallery.unshift(newPhoto);
    this.saveData(data);
  }

  static addFeedback(feedback: Omit<FeedbackEntry, 'id' | 'timestamp'>) {
    const data = this.getData();
    const newFeedback: FeedbackEntry = {
      ...feedback,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    data.feedback.push(newFeedback);
    this.saveData(data);
  }
}
