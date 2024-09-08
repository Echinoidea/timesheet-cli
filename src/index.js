#!/usr/bin/env node

import { program } from 'commander';
import { CalculateHoursWorked, ClockIn, DoesFileExist, InitializeJson, LoadTimesheetData, PrintWorkTimes, SaveJson } from './api.mjs';

// Paths
let path = '.';
let projName = '';
let filePath = `${path}/${projName}.json`;

// Options
let cat = '';
let desc = '';
let query = null;
let startDate = '';
let endDate = '';

program
  .version("0.2.0")
  .description("Clock in and out with the CLI.")
  .option("-p --job <string>", "For which project is this timesheet?")
  .option("-c --cat <string>", "e.g. PLAN, READ, CODE, DOCS, ...")
  .option("-d --desc <string>", "A brief message about what work was done.")
  .option("-q --query <'y' | null>", "Get hours worked between start and end dates. Including both endpoints.")
  .option("-s --start <yyyy-mm-dd>", "Start date for query.")
  .option("-e --end <yyyy-mm-dd | 'now'>", "End date for query.")
  .action((options) => {
    projName = options.job;
    filePath = `${path}/${projName}.json`;
    cat = options.cat;
    desc = options.desc;
    query = options.query;
    startDate = options.start;
    endDate = options.end;
  });

program.parse(process.argv);



if (!query) {
  if (!(await DoesFileExist(filePath))) {
    console.log(`Creating ${filePath}`)
    InitializeJson(filePath);
  }
  else {
    LoadTimesheetData(filePath);
  }
  ClockIn(filePath, cat, desc);
  SaveJson(filePath);
}
else {
  LoadTimesheetData(filePath);
  PrintWorkTimes(startDate, endDate);
  console.log(`\n Total Hours: ${CalculateHoursWorked(startDate, endDate)}`)
}


