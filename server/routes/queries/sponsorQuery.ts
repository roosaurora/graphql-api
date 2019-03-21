const sponsorQuery = `
query PageQuery($conferenceId: ID!) {
  sponsors(id: $conferenceId) {
    type
    name
    social {
      homepage
    }
    about
    image {
      url
    }
  }
}
`;

export default sponsorQuery;
