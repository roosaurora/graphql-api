import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "Ginetta",
  about: "We simplify",
  image: {
    url: "sponsors/ginetta.svg",
  },
  social: {
    github: "ginetta",
    homepage: "https://ginetta.net/",
    facebook: "ginettateam",
    instagram: "ginettateam",
    twitter: "ginettateam",
  },
  location: {
    country: {
      name: "Switzerland",
      code: "CH",
    },
    city: "Zürich",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
