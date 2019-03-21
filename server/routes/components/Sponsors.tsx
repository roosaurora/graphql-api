import styled from "@emotion/styled";
import * as React from "react";
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
  sponsors: {
    goldSponsors?: SponsorProps[];
    silverSponsors?: SponsorProps[];
    bronzeSponsors?: SponsorProps[];
  };
}

// TODO: Check if the structure can be simplified
const Sponsors = ({
  sponsors: { goldSponsors = [], silverSponsors = [], bronzeSponsors = [] },
}: SponsorsProps) => (
  <SponsorsContainer>
    <GoldSponsors>
      <Contacts
        items={goldSponsors}
        render={Sponsor}
        renderProps={{ type: "gold" }}
      />
    </GoldSponsors>
    <SilverSponsors>
      <Contacts
        items={silverSponsors}
        render={Sponsor}
        renderProps={{ type: "silver" }}
      />
    </SilverSponsors>
    <BronzeSponsors>
      <Contacts
        items={bronzeSponsors}
        render={Sponsor}
        renderProps={{ type: "bronze" }}
      />
    </BronzeSponsors>
  </SponsorsContainer>
);

export default Sponsors;
