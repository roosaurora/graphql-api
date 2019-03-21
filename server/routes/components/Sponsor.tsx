import styled from "@emotion/styled";
import React from "react";
import { Contact } from "../../schema/Contact";

interface SponsorContentProps {
  src: string;
  name: string;
  props: {};
  type: string; // TODO: Better use an enum here
}

const sponsorRules = {
  gold: {
    "max-height": "3cm",
    "max-width": "3cm",
    margin: "0 0.5cm 0.5cm 0.5cm",
    display: "block",
  },
  silver: {
    "max-height": "1.75cm",
    "max-width": "1.75cm",
    margin: "0.5cm",
  },
  bronze: {
    "max-height": "1.75cm",
    "max-width": "1.75cm",
    margin: "0.25cm 0.5cm 0cm 0.5cm",
  },
};

const SponsorContent = styled.img`
  vertical-align: middle;
  display: ${({ type }: SponsorContentProps) => sponsorRules[type].display};
  max-height: ${({ type }: SponsorContentProps) =>
    sponsorRules[type]["max-height"]};
  max-width: ${({ type }: SponsorContentProps) =>
    sponsorRules[type]["max-width"]};
  margin: ${({ type }: SponsorContentProps) => sponsorRules[type].margin};
` as React.FC<SponsorContentProps>;

interface SponsorProps {
  name: Contact["name"];
  about: Contact["about"];
  image: Contact["image"];
  logoProps: {}; // TODO: Eliminate entirely?
  type: string; // TODO: Better use the same enum here. Likely this goes away.
}

const Sponsor = ({ name, image, logoProps, type }: SponsorProps) => (
  <SponsorContent src={image.url} name={name} props={logoProps} type={type} />
);

export { Sponsor, SponsorProps };
