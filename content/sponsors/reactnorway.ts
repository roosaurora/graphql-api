import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "React Norway",
  about: "The international event for coding inspiration",
  image: {
    url: "sponsors/reactnorway.svg",
  },
  social: {
    homepage: "https://reactnorway.com/",
    facebook: "",
    instagram: "",
    twitter: "reactnorway",
  },
  location: {
    country: {
      name: "Norway",
      code: "NO",
    },
    city: "Larvik",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
