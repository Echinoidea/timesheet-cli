/**
 * Example timesheet-midas.json
 *
 * {
 *  timesheet: [
 *    {
 *      in: Date.now(),
 *      out: Date.later(),
 *      cat: "CODE",
 *      desc: "Created ui"
 *    },
 *    ...
 *  ]
 * }
 *
 */

import fs, { constants } from 'fs';

let timesheetArray = [];
let jobName = "";

async function DoesFileExist(path) {
  return fs.promises.access(path, constants.F_OK)
  .then(() => true)
  .catch(() => false);
}

async function LoadTimesheetData(path) {
  let timesheetJson = fs.readFileSync(path, "utf-8");
  timesheetArray = JSON.parse(timesheetJson);
}

async function InitializeJson(path, _jobName) {
  jobName = _jobName;
  fs.writeFileSync(path, '[]', 'utf-8');
}

function IsFileEmpty(path) {
  return fs.statSync(path).size === 2;
}

function CheckOpenEntry() {
  return timesheetArray[timesheetArray.length - 1]['out'] === null;
}

function ClockIn(path, category, description) {
  if (IsFileEmpty(path)) {
    timesheetArray.push(
      {
        in: Date.now(),
        out: null,
        cat: `${category}`,
        desc: `${description}`
      }
    );
    console.log("Clocked in")
    return;
  }

  if (CheckOpenEntry()) {
    ClockOut();
  }
  else {
    timesheetArray.push(
      {
        in: Date.now(),
        out: null,
        cat: `${category}`,
        desc: `${description}`
      }
    );
    console.log("Clocked in")
  }
}

function ClockOut() {
  timesheetArray[timesheetArray.length - 1].out = Date.now();
  console.log(`Clocked out`);
}

async function SaveJson(path) {
  let timesheetJson = JSON.stringify(timesheetArray, null, ' ');
  fs.writeFileSync(path, timesheetJson, 'utf-8');
}

export {DoesFileExist, LoadTimesheetData, InitializeJson, ClockIn, ClockOut, SaveJson};
