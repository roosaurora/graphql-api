import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "Postgraphile",
  about: "Instant GraphQL API for PostgreSQL database",
  image: {
    url: "sponsors/postgraphile.svg",
  },
  social: {
    homepage: "https://www.graphile.org/postgraphile/",
    twitter: "Benjie",
  },
  location: {
    country: {
      name: "United Kingdom",
      code: "GB",
    },
    city: "Southampton",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
