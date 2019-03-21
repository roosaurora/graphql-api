import { Arg, FieldResolver, ID, Query, Resolver, Root } from "type-graphql";
import { Interval } from "../Interval";
import { getSchedule } from "../Schedule";
import { Session } from "../Session";

@Resolver(_ => Interval)
class IntervalResolver {
  @Query(_ => [Interval])
  public intervals(
    @Arg("conferenceId", _ => ID) conferenceId: string,
    @Arg("day") day: string
  ) {
    return getSchedule(conferenceId, day).intervals;
  }

  @FieldResolver(_ => [Session])
  public sessions(@Root() interval: Interval) {
    return interval.sessions.map(session => ({
      ...session,
      interval,
    }));
  }
}

export default IntervalResolver;
