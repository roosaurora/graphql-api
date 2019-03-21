import { Arg, ID, Query, Resolver } from "type-graphql";
import { getSchedule, Schedule } from "../Schedule";

@Resolver(_ => Schedule)
class ScheduleResolver {
  @Query(_ => Schedule)
  public schedule(
    @Arg("conferenceId", _ => ID) conferenceId: string,
    @Arg("day") day: string
  ) {
    return getSchedule(conferenceId, day);
  }
}

export default ScheduleResolver;
