import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const person: Contact = {
  name: "Anna Doubková",
  about: "Senior software engineer at Hive.",
  image: {
    url: "people/anna.jpg",
  },
  social: {
    twitter: "lithinn",
    github: "lithin",
  },
  location: {
    country: {
      name: "Great Britain",
      code: "GB",
    },
    city: "London",
  },
  keywords: [],
  type: [ContactType.SPEAKER],
};

export default person;
