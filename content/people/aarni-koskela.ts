import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const person: Contact = {
  name: "Aarni Koskela",
  about: "Aarni works on the site and the app. Specializes in terrible puns.",
  image: {
    url: "people/aarni.jpg",
  },
  social: {
    homepage: "",
    twitter: "akx",
    github: "akx",
    linkedin: "aarni",
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
