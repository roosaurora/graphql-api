import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const person: Contact = {
  name: "Tuuli Tiilikainen",
  about: "",
  image: {
    url: "people/tuuli.jpg",
  },
  social: {
    homepage: "https://www.columbiaroad.com/people/tuuli-tiilikainen",
  },
  location: {
    country: {
      name: "Finland",
      code: "FI",
    },
  },
  keywords: [],
  type: [ContactType.ORGANIZER],
};

export default person;
