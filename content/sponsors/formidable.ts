import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "Formidable",
  about: "The JavaScript Consultancy trusted by engineers",
  image: {
    url: "sponsors/formidable.svg",
  },
  social: {
    homepage: "https://formidable.com/",
    github: "formidablelabs",
    linkedin: "company/formidable-labs-inc",
    youtube: "",
    instagram: "",
    twitter: "formidablelabs",
    pinterest: "",
  },
  location: {
    country: {
      name: "United States",
      code: "US",
    },
    city: "Seattle",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
