import Keyword from "../../../server/schema/keywords";
import { Session } from "../../../server/schema/Session";
import { SessionType } from "../../../server/schema/types";
import speaker from "../../people/maaret-pyhajarvi";

const talk: Session = {
  people: [speaker],
  title: "Intersection of Automation and Exploratory Testing",
  description: ``,
  type: SessionType.TALK,
  keywords: [Keyword.REACT, Keyword.TESTING],
};

export default talk;
