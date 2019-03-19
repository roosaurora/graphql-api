import { request } from "graphql-request";
import filter from "lodash/filter";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isObject from "lodash/isObject";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import omit from "lodash/omit";
import pickBy from "lodash/pickBy";
import * as React from "react";
import componentTypes from "../../types/component-types";
import schemaTypes from "../../types/schema";
import * as gql from "./gql-query-builder";

const schemaQueries = schemaTypes.Query;

function connected(component) {
  let queryCache = {};

  interface ConnectState {
    data: {};
  }

  const componentPropTypeAST = get(
    componentTypes[component.name],
    "component.value.members",
    []
  );

  class Connect<P = {}> extends React.Component<P, ConnectState> {
    public static propTypeAST: unknown; // TODO: Figure out the exact type
    public static filename: string;
    public static variables: Array<{
      id: string;
      query?: string;
      // TODO: Type better
      mapToCollection?: (result: any) => any;
      mapToOption?: (result: any) => { value: any; label: any };
      validation?: { type: any; default: any };
    }>;
    public state: ConnectState = {
      data: {},
    };
    constructor(props) {
      super(props);

      this.state = { data: queryCache };
    }
    public componentDidMount() {
      this.fetchData().then(data => this.setState(() => data));
    }
    public componentDidUpdate(prevProps) {
      if (!isEqual(prevProps, this.props)) {
        this.fetchData().then(data => this.setState(() => data));
      }
    }
    public render() {
      if (this.state.data === null) {
        return null;
      }

      return React.createElement(component, {
        ...this.props,
        ...this.state.data,
      });
    }
    public fetchData() {
      const endpoint = "/graphql";
      const propNames = map(componentPropTypeAST, ({ key: { name } }) => name);
      const queries = schemaQueries.fields;
      const matchingQueries = filter(
        queries,
        query => propNames.find(name => query.name === name && name !== "theme") // TODO: Remove theme hack
      ) as typeof queries;

      console.log("matching queries", matchingQueries);

      // TODO: Figure out how to deal with variable types (introspect from schema)
      // TODO: Figure out how to deal with the theme + figure out the exact shape for the query
      const operations = map(matchingQueries, query => ({
        operation: query.name,
        variables: getOperationVariables(omit(this.props, ["id", "theme"])), // TODO: remove the omit hack
        fields: getOperationFields(componentPropTypeAST, query.name),
      }));

      console.log(
        "operations",
        operations,
        "prop type ast",
        componentPropTypeAST
      );

      const gqlQuery = gql.query(operations);

      console.log("query", gqlQuery.query);

      return request(endpoint, gqlQuery.query, gqlQuery.variables)
        .then(data => {
          queryCache = data;

          return { data };
        })
        .catch(err => console.error(err));
    }
  }

  Connect.propTypeAST = componentPropTypeAST;

  return Connect;
}

function getOperationVariables(props) {
  return mapValues(pickBy(props, prop => !isObject(prop)), value => ({
    value,
  }));
}

function getOperationFields(componentAST, queryName) {
  const matchingComponent = componentAST.find(
    ({ key: { name } }) => name === queryName
  );

  if (!matchingComponent) {
    return [];
  }

  if (matchingComponent.value.members) {
    return matchingComponent.value.members.map(member => member.key.name);
  }

  if (matchingComponent.value.value) {
    return matchingComponent.value.value.name.kind;
  }

  return [];
}

export default connected;
