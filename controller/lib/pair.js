import classRooms from "../../data/classRooms.json" assert { type: "json" };
import pidgrupa1 from "../../data/DataBase.json" assert { type: "json" };
import pairTime from "../../data/pairTime.json" assert { type: "json" };
import pidgrupa2 from "../../data/pidgrupa2.json" assert { type: "json" };

process.env.TZ = "Europe/Kyiv";

// const sampleDate = "September 14 2024 8:00"

const getCurrentPairNumber = () => {
  const currentPair = pairTime.find((pair) =>
    isCurrentTimeInRange(pair.start, pair.end),
  );
  if (!currentPair) {
    throw new Error("В цей час не проводять пари");
  }
  return currentPair.pairNumber;
};

function isCurrentTimeInRange(start, end) {
  const now = new Date();

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startTime = new Date(now);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(now);
  endTime.setHours(endHour, endMinute, 0, 0);

  return now >= startTime && now <= endTime;
}

const days = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export function getCurrentPair(group = 1) {
  const date = new Date();
  const pairNumber = getCurrentPairNumber();
  const dayNumber = date.getDay();
  const currentDay = days[dayNumber];

  if (currentDay === "sunday") {
    throw new Error("Сьогодні неділя, пар немає");
  }

  const week = getWeek(date) % 2 === 0 ? "week2" : "week1";
  const db = group === 1 ? pidgrupa1 : pidgrupa2;
  const currentWeekPairs = db[week];
  const currentDayPairs = currentWeekPairs[currentDay];
  const currentPair = currentDayPairs.find(
    (pair) => pair.pairNumber === pairNumber,
  );

  if (!currentPair) {
    throw new Error("Наразі за розкладом немає пари");
  }
  return currentPair;
}

export function getCurrentPairCode(group = 1) {
  const currentPair = getCurrentPair(group);
  const { name: pairName, pairFormat } = currentPair;
  const currentClassroom = classRooms[pairFormat][pairName];

  if (!currentClassroom) {
    throw new Error(`Немає google meet для цієї пари ${pairName}`);
  }

  const googleMeetCode = currentClassroom.googleMeet.split(".com/")[1];
  return googleMeetCode;
}

export function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export function generatePairResponse(group = 1) {
  let currentPair;
  let googleMeetCode;
  let link;
  try {
    currentPair = getCurrentPair(group).name;
    googleMeetCode = getCurrentPairCode(group);
    link = `https://meet.google.com/${googleMeetCode}`;
  } catch (err) {
    console.log(err.message);
  }
  const resp = `Підгрупа ${group}\nПара зараз: ${
    currentPair || "Відсутня"
  }\nGoogle meet: ${googleMeetCode ? link : "Відсутній"}`;
  return resp;
}

const getWeek = (date) => {
  const startDate = new Date("August 17 2024 23:59:59");
  const nowDate = new Date(date);
  const dayDifference = nowDate.getTime() - startDate.getTime();
  const daysSinceDate = dayDifference / (24 * 60 * 60 * 1000);
  return Number(Math.ceil(daysSinceDate / 7).toFixed());
};
