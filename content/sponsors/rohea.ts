import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "Rohea",
  about:
    "ROHEA is a Finnish tech company that makes demanding software simple, scalable and usable for everyday needs.",
  image: {
    url: "sponsors/rohea.png",
  },
  social: {
    homepage: "http://www.rohea.com/",
    twitter: "",
  },
  location: {
    country: {
      name: "Finland",
      code: "FI",
    },
    city: "Helsinki",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
