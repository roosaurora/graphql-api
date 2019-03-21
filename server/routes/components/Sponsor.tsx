import styled from "@emotion/styled";
import React from "react";
import { Contact } from "../../schema/Contact";
import { ContactType } from "../../schema/types";

interface SponsorContentProps {
  src: Contact["image"]["url"];
  name: Contact["name"];
  type: ContactType;
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
  type: ContactType;
}

const Sponsor = ({ name, image, type }: SponsorProps) => (
  <SponsorContent src={image.url} name={name} type={type} />
);

export { Sponsor, SponsorProps };
