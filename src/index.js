#!/usr/bin/env node

import { program } from 'commander';
import { ClockIn, DoesFileExist, InitializeJson, LoadTimesheetData, SaveJson } from './api.mjs';

let path = '.';
let jobName = '';
let filePath = `${path}/${jobName}.json`;
let cat = '';
let desc = '';

program
  .version("0.1.0")
  .description("Clock in and out with the CLI")
  .option("-j --job <string>", "For which job is this timesheet?")
  .option("-c --cat <'plan'|'read'|'code'|'docs'>", "PLAN, READ, CODE, DOCS")
  .option("-d --desc <string>", "A brief message about what work was done.")
  .action((options) => {
    jobName = options.job;
    filePath = `${path}/${jobName}.json`;
    cat = options.cat;
    desc = options.desc;
  });

program.parse(process.argv);

if (!(await DoesFileExist(filePath))) {
  console.log(`Could not find ${jobName} timesheet. Creating new JSON file at ${path}`);
  InitializeJson(filePath,  jobName);
  ClockIn(filePath, cat, desc);
}
else {
  LoadTimesheetData(filePath);
  console.log("Found file. Clocking in/out");
  ClockIn(filePath, cat, desc);
}
SaveJson(filePath);