import flatMap from "lodash/flatMap";
import uniq from "lodash/uniq";
import { Field, ObjectType } from "type-graphql";
import { getConference } from "./Conference";
import { Interval } from "./Interval";
import { Location } from "./Location";
import SessionType from "./types/SessionType";

@ObjectType()
export class Schedule {
  @Field(_ => String)
  public day!: string;

  @Field(_ => Location, { nullable: true })
  public location?: Location;

  @Field(_ => String, { nullable: true })
  public description?: string;

  @Field(_ => [Interval])
  public intervals!: Interval[];
}

export function getSchedule(id: string, day: string) {
  const conference = getConference(id);
  const schedule = conference.schedules.find(c => c.day === day);

  if (schedule) {
    return schedule;
  } else {
    throw new Error("Invalid date");
  }
}

export function resolveSessions(
  schedules: Schedule[],
  sessionTypes: SessionType[]
) {
  return flatMap(schedules, ({ intervals }) =>
    uniq(
      flatMap(intervals, ({ sessions }) =>
        sessions.filter(({ type }) => sessionTypes.includes(type))
      )
    )
  );
}
