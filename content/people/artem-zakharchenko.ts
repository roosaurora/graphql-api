import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";
import Keyword from "../../server/schema/keywords";

const person: Contact = {
  name: "Artem Zakharchenko",
  about:
    "Full-stack JavaScript engineer, doctor, musician, designer. Walking the marvelous road of learning.",
  image: {
    url: "people/artem-z.jpg",
  },
  social: {
    homepage: "",
    twitter: "kettanaito",
    github: "kettanaito",
    linkedin: "artem-zakharchenko",
  },
  location: {
    country: {
      name: "Ukraine",
      code: "UA",
    },
    city: "",
  },
  keywords: [Keyword.REACT, Keyword.STYLING, Keyword.TOOLING],
  type: [ContactType.SPEAKER],
};

export default person;
