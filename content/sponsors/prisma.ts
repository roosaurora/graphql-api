import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "Prisma",
  about: "Build a GraphQL server with any database",
  image: {
    url: "sponsors/prisma.svg",
  },
  social: {
    homepage: "https://www.prisma.io/",
    github: "prismagraphql",
    twitter: "prisma",
  },
  location: {
    country: {
      name: "United States",
      code: "US",
    },
    city: "San Francisco",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
