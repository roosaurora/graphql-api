import styled from "@emotion/styled";
import filter from "lodash/filter";
import * as React from "react";
import { ContactType } from "../../schema/Contact";
import Contacts from "./Contacts";
import { Sponsor, SponsorProps } from "./Sponsor";

const SponsorsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-items: center;
  margin-left: 0.5cm;
  margin-right: 0.5cm;
`;

const GoldSponsors = styled.section``;
const SilverSponsors = styled.section`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr;
`;
const BronzeSponsors = styled.section`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
`;

interface SponsorsProps {
  sponsors: SponsorProps[];
}

// TODO: Check if the structure can be simplified
const Sponsors = ({ sponsors }: SponsorsProps) => (
  <SponsorsContainer>
    <GoldSponsors>
      <Contacts
        items={getSponsorsByType(sponsors, ContactType.GOLD_SPONSOR)}
        render={Sponsor}
        renderProps={{ type: "gold" }}
      />
    </GoldSponsors>
    <SilverSponsors>
      <Contacts
        items={getSponsorsByType(sponsors, ContactType.SILVER_SPONSOR)}
        render={Sponsor}
        renderProps={{ type: "silver" }}
      />
    </SilverSponsors>
    <BronzeSponsors>
      <Contacts
        items={getSponsorsByType(sponsors, ContactType.BRONZE_SPONSOR)}
        render={Sponsor}
        renderProps={{ type: "bronze" }}
      />
    </BronzeSponsors>
  </SponsorsContainer>
);

function getSponsorsByType(allSponsors, type: ContactType) {
  return filter(allSponsors, sponsor => sponsor.type.includes(type));
}

export default Sponsors;
