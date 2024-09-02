import fs, { constants } from 'fs';

let timesheetArray = [];

//#region File IO

async function DoesFileExist(path) {
  return fs.promises.access(path, constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

function IsFileEmpty(path) {
  return fs.statSync(path).size === 0;
}

/**
 * Create empty timesheet json file.
 * @param {string} path 
 */
async function InitializeJson(path) {
  fs.writeFileSync(path, '', 'utf-8');
}

/**
 * Read the timesheet JSON into an array in memory to be modified.
 * @param {string} path 
 */
async function LoadTimesheetData(path) {
  let timesheetJson = fs.readFileSync(path, "utf-8");
  timesheetArray = JSON.parse(timesheetJson);
}

/**
 * Overwrite the timesheet JSON file with the array in memory.
 * @param {string} path 
 */
async function SaveJson(path) {
  let timesheetJson = JSON.stringify(timesheetArray, null, ' ');
  fs.writeFileSync(path, timesheetJson, 'utf-8');
}

/**
 * Check if the last element's 'out' property is null. If true, it needs to be clocked out.
 * @returns bool
 */
function CheckOpenEntry(path) {
  if (IsFileEmpty(path)) {
    return false;
  }

  return timesheetArray[timesheetArray.length - 1].out === null;
}

/**
 * Create an entry in the object array with in, out, category, and description.
 * @param {string} path 
 * @param {string} category 
 * @param {string} description 
 * @returns 
 */
function ClockIn(path, category, description) {
  if (CheckOpenEntry(path)) {
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

/**
 * Set the out property of the last element of the object array.
 */
function ClockOut() {
  timesheetArray[timesheetArray.length - 1].out = Date.now();
  console.log(`Clocked out`);
}

//#endregion


//#region Query


function CalculateHoursWorked(startDate, endDate) {
  // Convert startDate and endDate to the start and end of the day timestamps
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = endDate === 'now' ? Date.now() : new Date(endDate).setHours(23, 59, 59, 999);
  
  const filtered = timesheetArray.filter((entry) => {return entry.in >= start || entry.out <= end});

  const totalMilliseconds = filtered.reduce((total, entry) => {
    const duration = entry.out - entry.in;
    return total + duration;
}, 0);

  // Convert milliseconds to hours
  const totalHours = totalMilliseconds / (1000 * 60 * 60);

  return totalHours.toFixed(2);
}

//#endregion

export { DoesFileExist, LoadTimesheetData, InitializeJson, ClockIn, SaveJson, CalculateHoursWorked };
