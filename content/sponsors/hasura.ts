import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "Hasura",
  about: "Instant Realtime GraphQL on Postgres",
  image: {
    url: "sponsors/hasura.png",
  },
  social: {
    homepage: "https://hasura.io/",
    twitter: "hasurahq",
    github: "hasura",
  },
  location: {
    country: {
      name: "India",
      code: "IN",
    },
    city: "Bangalore",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
