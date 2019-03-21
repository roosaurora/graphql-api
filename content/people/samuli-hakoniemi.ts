import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const person: Contact = {
  name: "Samuli Hakoniemi",
  about: "",
  image: {
    url: "people/samuli.jpg",
  },
  social: {
    homepage: "",
    twitter: "zvona",
    github: "zvona",
    linkedin: "",
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
