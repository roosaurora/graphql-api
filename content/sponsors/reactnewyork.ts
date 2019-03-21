import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "React New York",
  about: "The international event for coding inspiration",
  image: {
    url: "sponsors/reactnewyork.svg",
  },
  social: {
    homepage: "https://reactnewyork.com/",
    facebook: "",
    instagram: "",
    twitter: "reactnewyork",
  },
  location: {
    country: {
      name: "United States",
      code: "US",
    },
    city: "New York",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
