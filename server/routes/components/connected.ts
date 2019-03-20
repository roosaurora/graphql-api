import { request } from "graphql-request";
import filter from "lodash/filter";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isObject from "lodash/isObject";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import omit from "lodash/omit";
import pickBy from "lodash/pickBy";
import property from "lodash/property";
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
      // object values have value.value.name (if value.kind is generic) that gives string (TS class + field)
      // that field can then be used for figuring out the fields
      // TODO: Figure out how to deal with the theme + figure out the exact shape for the query
      const operations = map(matchingQueries, query => ({
        operation: query.name,
        variables: getOperationVariables(
          query,
          omit(this.props, ["id", "theme"])
        ), // TODO: remove the omit hack
        fields: getOperationFields(
          componentPropTypeAST,
          query.name,
          schemaTypes
        ),
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

function getOperationVariables(query, props) {
  const args = query.args;

  return mapValues(pickBy(props, prop => !isObject(prop)), (value, name) => {
    const arg = args.find(arg => arg.name === name);

    if (!arg) {
      console.error(`${name} wasn't found in ${query}`);

      return {};
    }

    return {
      value,
      required: arg.type.kind === "NON_NULL",
      type: arg.type.ofType.name,
    };
  });
}

function getOperationFields(componentAST, queryName, schemaTypes) {
  const matchingComponent = componentAST.find(
    ({ key: { name } }) => name === queryName
  );

  if (!matchingComponent) {
    return [];
  }

  if (matchingComponent.value.members) {
    return matchingComponent.value.members.map(member => {
      const valuesType = member.value.value.name;
      // TODO: Likely this is brittle and a more specific check is required
      const parts = valuesType.split("['");
      const typeName = parts[0];
      const fieldName = parts[1].split("']")[0]; // TODO: Parse in a nicer way

      // TODO: What if type doesn't match?
      const matchingType = schemaTypes[typeName] || {};
      const matchingField = (matchingType.fields || []).find(
        ({ name }) => name === fieldName
      );

      return parseTypeFields(matchingField, member.key.name);
    });
  }

  if (matchingComponent.value.value) {
    return matchingComponent.value.value.name.kind;
  }

  return [];
}

function parseTypeFields(matchingField, memberName, i = 0) {
  // Max. recursion levels.
  // TODO: What's the right way to deal with this?
  if (i === 3) {
    return "";
  }

  if (
    get(matchingField, "type.kind") === "ENUM" ||
    get(matchingField, "type.kind") === "SCALAR" ||
    get(matchingField, "type.ofType.kind") === "ENUM" ||
    get(matchingField, "type.ofType.kind") === "SCALAR"
  ) {
    return memberName;
  } else if (
    get(matchingField, "type.kind") === "LIST" ||
    get(matchingField, "type.ofType.kind") === "LIST"
  ) {
    const listType =
      matchingField.type.ofType.ofType.name ||
      matchingField.type.ofType.ofType.ofType.name;
    const matchingListType = schemaTypes[listType] || {};
    const matchingFields = filter(
      map(matchingListType.fields, field =>
        parseTypeFields(field, field.name, i + 1)
      ),
      Boolean
    );

    if (matchingFields.length > 0) {
      return {
        [memberName]: matchingFields,
      };
    }

    return memberName;
  } else if (
    get(matchingField, "type.kind") === "OBJECT" ||
    get(matchingField, "type.ofType.kind") === "OBJECT"
  ) {
    const objectType =
      matchingField.type.name || matchingField.type.ofType.name;
    const matchingObjectType = schemaTypes[objectType] || {};

    return {
      [memberName]: map(matchingObjectType.fields, property("name")),
    };
  }

  return memberName;
}

export default connected;
