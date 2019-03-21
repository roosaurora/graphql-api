import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "SurviveJS",
  about: "SurviveJS will take you from a JavaScript apprentice to master",
  image: {
    url: "sponsors/survivejs.svg",
  },
  social: {
    homepage: "https://survivejs.com/",
    twitter: "survivejs",
  },
  location: {
    country: {
      name: "Austria",
      code: "AT",
    },
    city: "Vienna",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
