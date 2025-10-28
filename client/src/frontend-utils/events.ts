/*
 * Authors: Rachel Patella
 * Created: 2025-10-23
 * Updated: 2025-10-28
 *
 * This file contains functions to build calendar events from reminders and retrieve event type details
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

import type { UIReminder } from '../types/ui-types';

// Reminder on calendar
export type CalendarEvent = {
  id: bigint;
  title: string;
  date: string;
  color: string;
};

export type EventField = { 
    id: string; 
    name: string; 
    type: string 
};

export type EventType = { 
   // Event type is a number, not bigint like itemID in backend
    id: number; 
    name: string; 
    color: string; 
    fields?: EventField[]; 
};

// Function to get event type fields - will render different fields based on event type selected
export function getEventTypeFields(eventTypes: EventType[], selectedEventTypeID: number) {
  // Find the event type id in the eventTypes array that matches the user selected dropdown event type id
  const type = eventTypes.find(eventType => eventType.id === selectedEventTypeID);
  // If the event type is found, return the fields. Otherwise, return an empty array
  return type ? type.fields : [];
}

// Function to get event type colors - will change checkbox to match event type color
export function getEventTypeColor(eventTypes: EventType[], selectedEventTypeID: number) {
  // Find the event type id in the eventTypes array that matches the user selected dropdown event type id
  const type = eventTypes.find(eventType => eventType.id === selectedEventTypeID);
  // If the event type is found, return the color. Otherwise, return a default color
  return type ? type.color : 'blue';
}

// Create events on calendar from reminders
// script source code similar to slot - day month example
// https://qcalendar.netlify.app/developing/qcalendar-month
export function buildCalendarEvents(reminders: UIReminder[], eventTypes: EventType[]): CalendarEvent[] {
  // Only show saved reminders on calendar
  return reminders.filter(reminder => reminder.isSaved)
    .map(reminder => ({
      id: reminder.itemID, 
      title: reminder.title,
      date: reminder.date,
      // Have background color be same as event type color
      color: getEventTypeColor(eventTypes, reminder.eventType)
    }));
}

// Map dates to array of events - key is date string, value is array of events on that date
// script source code similar to slot - day month example
// https://qcalendar.netlify.app/developing/qcalendar-month
export function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  const map: Record<string, CalendarEvent[]> = {};
  events.forEach(event => {
    (map[event.date] = map[event.date] || []).push(event);
  });
  return map;
}

// Function to rename event start time label dependent on event type
export function getEventStartLabel(eventType: number) {
  // Flight
  if (eventType === 1) {
    return 'Arrival Time';
  }
  // Hotel
  if (eventType === 2) {
    return 'Check-in Time';
  }
  // General
  return 'Start Time'; 
}

// Function to rename event start time label dependent on event type
export function getEventEndLabel(eventType: number) {
  // Flight
  if (eventType === 1) {
    return 'Departure Time';
  }
  // Hotel
  if (eventType === 2) {
    return 'Check-out Time';
  }
  // General
  return 'End Time'; 
}
