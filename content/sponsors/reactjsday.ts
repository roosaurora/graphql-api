import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "ReactJs Day",
  about: "ReactJS Day is a one-day, single track conference in Verona",
  image: {
    url: "sponsors/reactjsday.svg",
  },
  social: {
    homepage: "http://reactjsday.it/",
    facebook: "reactjsday",
    vimeo: "grusp",
    twitter: "reactjsday",
    youtube: "UCdWnwC8nz_CCFQrmLBrLCVw",
  },
  location: {
    country: {
      name: "Italy",
      code: "IT",
    },
    city: "Verona",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
