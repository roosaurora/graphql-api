import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "Vincit",
  about: "Not Another Software Company",
  image: {
    url: "sponsors/vincit.svg",
  },
  social: {
    homepage: "https://www.vincit.fi/",
    facebook: "VincitOyj",
    github: "vincit",
    linkedin: "company/vincit-oy",
    twitter: "VincitOy",
    youtube: "VincitOyTampere",
  },
  location: {
    country: {
      name: "Finland",
      code: "FI",
    },
    city: "Tampere",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
