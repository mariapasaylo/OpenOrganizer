/*
 * Authors: Kevin Sirantoine
 * Created: 2025-11-07
 * Updated: 2025-11-11
 *
 * This file contains functions for generating the generated reminders to be inserted into the local database in sqlite-db.ts.
 *
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
import * as db from "../db/sqlite-db";
import {
  type Timestamp,
  getDayOfYear,
  isLeapYear,
  daysInMonth,
  parseDate,
  updateMinutes,
  addToDate,
  copyTimestamp,
  diffTimestamp,
  daysBetween
} from '@quasar/quasar-ui-qcalendar';
import type {
  DailyReminder,
  WeeklyReminder,
  MonthlyReminder,
  YearlyReminder,
  GeneratedReminder,
  RangeWindow
} from "app/src-electron/types/shared-types";
const generatedYears = new Set<number>(); // maintain a set of currently generated years

export function generateInRange(rangeWindow: RangeWindow) {
  const generatedRems: GeneratedReminder[] = [];

  const dailys = db.readDailyRemindersInRange(rangeWindow);
  const weeklys = db.readWeeklyRemindersInRange(rangeWindow);
  const monthlys = db.readMonthlyRemindersInRange(rangeWindow);
  const yearlys = db.readYearlyRemindersInRange(rangeWindow);

  if (dailys !== undefined) for (const daily of dailys) generatedRems.push(...generateDaily(daily, rangeWindow));
  if (weeklys !== undefined) for (const weekly of weeklys) generatedRems.push(...generateWeekly(weekly, rangeWindow));
  if (monthlys !== undefined) for (const monthly of monthlys) generatedRems.push(...generateMonthly(monthly, rangeWindow));
  if (yearlys !== undefined) for (const yearly of yearlys) generatedRems.push(...generateYearly(yearly, rangeWindow));

  for (let i = rangeWindow.startYear; i <= rangeWindow.endYear; i++) { // update generatedYears set
    generatedYears.add(i);
  }

  return generatedRems
}

function generateDaily(daily: DailyReminder, rangeWindow: RangeWindow) {
  const dailyStartTime = parseDate(new Date(daily.seriesStartYear, 0, daily.seriesStartDay))!;
  const windowStartTime = parseDate(new Date(rangeWindow.startYear, 0, 0, 0, rangeWindow.startMinOfYear))!;
  const {startTime, endTime} = getGenWindow(daily, rangeWindow);
  let currTime = copyTimestamp(startTime);

  // ensure that the startTime is actually a recurrence day
  const diff = daysBetween(dailyStartTime, windowStartTime); // windowStart - seriesStart
  if (diff > 0) {
    const daysSinceRecur = diff % daily.everyNDays;
    if (daysSinceRecur > 0) currTime = addToDate(currTime, {day: daily.everyNDays - daysSinceRecur}); // move to first recur day within the window
  }

  currTime = updateMinutes(currTime, daily.timeOfDayMin); // add timeOfDayMin

  const eventStartTimes: Timestamp[] = [];
  const eventEndTimes: Timestamp[] = [];
  const notifTimes: Timestamp[] = [];
  while (diffTimestamp(currTime, endTime, false) >= 0) { // while currTime <= endTime
    eventStartTimes.push(currTime);
    eventEndTimes.push(addToDate(currTime, {minute: daily.eventDurationMin}));
    notifTimes.push(addToDate(currTime, {minute: daily.notifOffsetTimeMin}));
    currTime = addToDate(currTime, {day: daily.everyNDays});
  }

  const generatedRems: GeneratedReminder[] = [];
  for (let i = 0; i < eventStartTimes.length; i++) {
    generatedRems.push(getGeneratedRem(daily, 1, eventStartTimes[i]!, eventEndTimes[i]!, notifTimes[i]!));
  }
  return generatedRems;
}

function generateWeekly(weekly: WeeklyReminder, rangeWindow: RangeWindow) {
  const weeklyStartTime = parseDate(new Date(weekly.seriesStartYear, 0, weekly.seriesStartDay))!;
  const windowStartTime = parseDate(new Date(rangeWindow.startYear, 0, 0, 0, rangeWindow.startMinOfYear))!;
  const {startTime, endTime} = getGenWindow(weekly, rangeWindow);
  let currTime = copyTimestamp(startTime);

  // ensure that the startTime is actually within a recurring week
  let firstDayOfWeeklyStartWeek = copyTimestamp(weeklyStartTime);
  if (weeklyStartTime.weekday > 0) firstDayOfWeeklyStartWeek = addToDate(weeklyStartTime, {day: (-weeklyStartTime.weekday)});
  let firstDayOfWindowStartWeek = copyTimestamp(windowStartTime);
  if (windowStartTime.weekday > 0) firstDayOfWindowStartWeek = addToDate(windowStartTime, {day: (-windowStartTime.weekday)});

  const diff = daysBetween(firstDayOfWeeklyStartWeek, firstDayOfWindowStartWeek); // firstDayOfWindowStartWeek - firstDayOfStartWeek
  if (diff > 0) {
    const weeksSinceStartWeek = Math.floor(diff / 7);
    const weeksSinceRecur = weeksSinceStartWeek % weekly.everyNWeeks;

    if (weeksSinceRecur > 0) currTime = addToDate(firstDayOfWindowStartWeek, {day: ((weekly.everyNWeeks - weeksSinceRecur) * 7) }); // move to start of first recur week within the window
  }

  currTime = updateMinutes(currTime, weekly.timeOfDayMin); // add timeOfDayMin

  const eventStartTimes: Timestamp[] = [];
  const eventEndTimes: Timestamp[] = [];
  const notifTimes: Timestamp[] = [];
  while (diffTimestamp(currTime, endTime, false) >= 0) { // while currTime <= endTime
    for (let i = currTime.weekday; i < 7; i++) {
      if (diffTimestamp(currTime, endTime, false) >= 0) break;

      if (weekly.daysOfWeek[i] === '1') {
        eventStartTimes.push(currTime);
        eventEndTimes.push(addToDate(currTime, {minute: weekly.eventDurationMin}));
        notifTimes.push(addToDate(currTime, {minute: weekly.notifOffsetTimeMin}));
      }
      currTime = addToDate(currTime, {day: 1});
    }
    currTime = addToDate(currTime, {day: ((weekly.everyNWeeks - 1) * 7)});
  }

  const generatedRems: GeneratedReminder[] = [];
  for (let i = 0; i < eventStartTimes.length; i++) {
    generatedRems.push(getGeneratedRem(weekly, 2, eventStartTimes[i]!, eventEndTimes[i]!, notifTimes[i]!));
  }
  return generatedRems;
}

function generateMonthly(monthly: MonthlyReminder, rangeWindow: RangeWindow) {
  const {startTime, endTime} = getGenWindow(monthly, rangeWindow);
  let currTime = updateMinutes(startTime, monthly.timeOfDayMin); // add timeOfDayMin

  const eventStartTimes: Timestamp[] = [];
  const eventEndTimes: Timestamp[] = [];
  const notifTimes: Timestamp[] = [];
  while (diffTimestamp(currTime, endTime, false) >= 0) { // while currTime <= endTime
    const daysInMo = daysInMonth(currTime.year, currTime.month);
    let lastDayOfMonthSet = false;

    for (let i = currTime.day; i <= daysInMo; i++) {
      if (diffTimestamp(currTime, endTime, false) >= 0) break;

      if (i === daysInMo && daysInMo < 31 && monthly.lastDayOfMonth === 1) {
        for (let j = i; j <= 31; j++) {
          if (monthly.daysOfMonth[j - 1] === '1') { // daysOfMonth is 0 based
            lastDayOfMonthSet = true;
            break
          }
        }
      }

      if (monthly.daysOfMonth[i - 1] === '1' || lastDayOfMonthSet) {
        eventStartTimes.push(currTime);
        eventEndTimes.push(addToDate(currTime, {minute: monthly.eventDurationMin}));
        notifTimes.push(addToDate(currTime, {minute: monthly.notifOffsetTimeMin}));
      }
      currTime = addToDate(currTime, {day: 1});
    }
  }

  const generatedRems: GeneratedReminder[] = [];
  for (let i = 0; i < eventStartTimes.length; i++) {
    generatedRems.push(getGeneratedRem(monthly, 3, eventStartTimes[i]!, eventEndTimes[i]!, notifTimes[i]!));
  }
  return generatedRems;
}

function generateYearly(yearly: YearlyReminder, rangeWindow: RangeWindow) {
  const {startTime, endTime} = getGenWindow(yearly, rangeWindow);
  let currTime = copyTimestamp(startTime);

  if (denormalizeDayOfYear(currTime.year, yearly.dayOfYear) < getDayOfYear(currTime)) currTime = addToDate(currTime, {year: 1}); // incr year if reminder is already passed
  currTime = parseDate(new Date(currTime.year, 0, denormalizeDayOfYear(currTime.year, yearly.dayOfYear)))!;
  currTime = updateMinutes(currTime, yearly.timeOfDayMin); // add timeOfDayMin

  const eventStartTimes: Timestamp[] = [];
  const eventEndTimes: Timestamp[] = [];
  const notifTimes: Timestamp[] = [];
  while (diffTimestamp(currTime, endTime, false) >= 0) { // while currTime <= endTime
    eventStartTimes.push(currTime);
    eventEndTimes.push(addToDate(currTime, {minute: yearly.eventDurationMin}));
    notifTimes.push(addToDate(currTime, {minute: yearly.notifOffsetTimeMin}));

    currTime = addToDate(currTime, {year: 1});
    currTime = parseDate(new Date(currTime.year, 0, denormalizeDayOfYear(currTime.year, yearly.dayOfYear)))!;
    currTime = updateMinutes(currTime, yearly.timeOfDayMin); // add timeOfDayMin
  }

  const generatedRems: GeneratedReminder[] = [];
  for (let i = 0; i < eventStartTimes.length; i++) {
    generatedRems.push(getGeneratedRem(yearly, 4, eventStartTimes[i]!, eventEndTimes[i]!, notifTimes[i]!));
  }
  return generatedRems;
}


// helpers
function getGenWindow(recurring: DailyReminder | WeeklyReminder | MonthlyReminder | YearlyReminder, rangeWindow: RangeWindow) {
  const seriesStartTime = parseDate(new Date(recurring.seriesStartYear, 0, recurring.seriesStartDay))!;
  const seriesEndTime = parseDate(new Date(recurring.seriesEndYear, 0, recurring.seriesEndDay))!;
  const windowStartTime = parseDate(new Date(rangeWindow.startYear, 0, 0, 0, rangeWindow.startMinOfYear))!;
  const windowEndTime = parseDate(new Date(rangeWindow.endYear, 0, 0, 0, rangeWindow.endMinOfYear))!;

  const startTime = (diffTimestamp(seriesStartTime, windowStartTime, false) < 0) ? seriesStartTime : windowStartTime; // if seriesStart > windowStart take seriesStart
  const endTime = (diffTimestamp(seriesEndTime, windowEndTime, false) < 0) ? seriesEndTime : windowEndTime;

  return {startTime, endTime}
}

function getGeneratedRem(recurring: DailyReminder | WeeklyReminder | MonthlyReminder | YearlyReminder, recurrenceTable: number,
                         eventStartTimes: Timestamp, eventEndTimes: Timestamp, notifTimes: Timestamp) {
  const generatedRem : GeneratedReminder = {
    itemID: recurring.itemID,
    folderID: recurring.folderID,
    eventType: recurring.eventType,
    recurrenceTable : recurrenceTable,
    origEventStartYear: eventStartTimes.year,
    origEventStartDay: getDayOfYear(eventStartTimes),
    origEventStartMin: (eventStartTimes.hour * 60) + eventStartTimes.minute,
    eventStartYear: eventStartTimes.year,
    eventStartDay: getDayOfYear(eventStartTimes),
    eventStartMin: (eventStartTimes.hour * 60) + eventStartTimes.minute,
    eventEndYear: eventEndTimes.year,
    eventEndDay: getDayOfYear(eventEndTimes),
    eventEndMin: (eventEndTimes.hour * 60) + eventEndTimes.minute,
    notifYear: notifTimes.year,
    notifDay: getDayOfYear(notifTimes),
    notifMin: (notifTimes.hour * 60) + notifTimes.minute,
    isExtended: recurring.isExtended,
    hasNotif: recurring.hasNotifs,
    title : recurring.title
  }
  applyOverride(generatedRem); // applies the generatedReminder's override if it exists

  return generatedRem;
}

function applyOverride(generatedRem: GeneratedReminder) {
  const override = db.readOverride(generatedRem.itemID, generatedRem.origEventStartYear, generatedRem.origEventStartDay, generatedRem.origEventStartMin);
  if (override !== undefined) {
    generatedRem.eventStartYear = override.eventStartYear;
    generatedRem.eventStartDay = override.eventStartDay;
    generatedRem.eventStartMin = override.eventStartMin;
    generatedRem.eventEndYear = override.eventEndYear;
    generatedRem.eventEndDay = override.eventEndDay;
    generatedRem.eventEndMin = override.eventEndMin;
    generatedRem.notifYear = override.notifYear;
    generatedRem.notifDay = override.notifDay;
    generatedRem.notifMin = override.notifMin;
    generatedRem.hasNotif = override.hasNotif;
  }
}

function denormalizeDayOfYear(year: number, dayOfYear: number) {
  let dayOfYearDenormalized = dayOfYear;
  if (isLeapYear(year))
  {
    if (dayOfYear === 366) dayOfYearDenormalized = 60; // set to 60 if dayOfYear is 366 on leap year
    else if (dayOfYearDenormalized >= 60) dayOfYearDenormalized += 1;
  }
  else if (dayOfYear === 366) dayOfYearDenormalized = 59; // set to 59 if dayOfYear is 366 on NON leap year
  return dayOfYearDenormalized;
}
