import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "Creative.ai",
  about: "Artificial intelligence for the creative industries",
  image: {
    url: "sponsors/cai.svg",
  },
  social: {
    homepage: "https://creative.ai/",
    facebook: "",
    instagram: "",
    twitter: "CreativeDotAI",
  },
  location: {
    country: {
      name: "Germany",
      code: "DE",
    },
    city: "Berlin",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
